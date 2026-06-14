const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class MockCollection {
  constructor(dbFile, collectionName) {
    this.dbFile = dbFile;
    this.collectionName = collectionName;
  }

  _read() {
    try {
      if (!fs.existsSync(this.dbFile)) {
        fs.mkdirSync(path.dirname(this.dbFile), { recursive: true });
        fs.writeFileSync(this.dbFile, JSON.stringify({ projects: [], sessions: [], contacts: [] }, null, 2));
      }
      const data = JSON.parse(fs.readFileSync(this.dbFile, 'utf8'));
      return data[this.collectionName] || [];
    } catch (e) {
      return [];
    }
  }

  _write(dataList) {
    try {
      let data = {};
      if (fs.existsSync(this.dbFile)) {
        data = JSON.parse(fs.readFileSync(this.dbFile, 'utf8'));
      }
      data[this.collectionName] = dataList;
      fs.writeFileSync(this.dbFile, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("Failed to write to local mock db:", e);
    }
  }

  async insertOne(doc) {
    const list = this._read();
    if (!doc._id) {
      doc._id = crypto.randomBytes(12).toString('hex');
    }
    list.push(doc);
    this._write(list);
    return { insertedId: doc._id };
  }

  async insertMany(docs) {
    const list = this._read();
    docs.forEach(doc => {
      if (!doc._id) {
        doc._id = crypto.randomBytes(12).toString('hex');
      }
      list.push(doc);
    });
    this._write(list);
    return { insertedCount: docs.length };
  }

  find(query = {}) {
    let list = this._read();
    
    // Simple filter matching
    if (query && Object.keys(query).length > 0) {
      list = list.filter(item => {
        return Object.keys(query).every(key => {
          if (!query[key]) return true;
          // Handle ObjectId check
          const queryVal = query[key].toString();
          const itemVal = item[key] ? item[key].toString() : '';
          return itemVal === queryVal;
        });
      });
    }

    return {
      sort: (sortQuery) => {
        const sortKey = Object.keys(sortQuery)[0];
        const sortOrder = sortQuery[sortKey]; // -1 or 1
        list.sort((a, b) => {
          const valA = a[sortKey];
          const valB = b[sortKey];
          if (valA < valB) return -1 * sortOrder;
          if (valA > valB) return 1 * sortOrder;
          return 0;
        });
        return {
          toArray: async () => list
        };
      },
      toArray: async () => list
    };
  }

  async findOne(query) {
    const list = this._read();
    return list.find(item => {
      return Object.keys(query).every(key => {
        if (!query[key]) return true;
        const queryVal = query[key].toString();
        const itemVal = item[key] ? item[key].toString() : '';
        return itemVal === queryVal;
      });
    }) || null;
  }

  async updateOne(query, update) {
    const list = this._read();
    const index = list.findIndex(item => {
      return Object.keys(query).every(key => {
        if (!query[key]) return true;
        const queryVal = query[key].toString();
        const itemVal = item[key] ? item[key].toString() : '';
        return itemVal === queryVal;
      });
    });

    if (index === -1) {
      return { matchedCount: 0, modifiedCount: 0 };
    }

    if (update.$set) {
      list[index] = { ...list[index], ...update.$set };
    }
    this._write(list);
    return { matchedCount: 1, modifiedCount: 1 };
  }

  async deleteOne(query) {
    const list = this._read();
    const index = list.findIndex(item => {
      return Object.keys(query).every(key => {
        if (!query[key]) return true;
        const queryVal = query[key].toString();
        const itemVal = item[key] ? item[key].toString() : '';
        return itemVal === queryVal;
      });
    });

    if (index === -1) {
      return { deletedCount: 0 };
    }

    list.splice(index, 1);
    this._write(list);
    return { deletedCount: 1 };
  }

  async deleteMany(query = {}) {
    if (Object.keys(query).length === 0) {
      this._write([]);
      return { deletedCount: 99 };
    }
    let list = this._read();
    const initialLen = list.length;
    list = list.filter(item => {
      return !Object.keys(query).every(key => {
        if (!query[key]) return true;
        const queryVal = query[key].toString();
        const itemVal = item[key] ? item[key].toString() : '';
        return itemVal === queryVal;
      });
    });
    this._write(list);
    return { deletedCount: initialLen - list.length };
  }
}

class MockDb {
  constructor(dbFile) {
    this.dbFile = dbFile;
  }
  collection(name) {
    return new MockCollection(this.dbFile, name);
  }
}

let client;
let db;

async function connectDB() {
  if (db) return db;

  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';
  client = new MongoClient(uri, { serverSelectionTimeoutMS: 3000 });

  try {
    // Attempt a quick connection (3-second timeout) so we don't hang local boot for 30s
    await client.connect();
    db = client.db();
    console.log('🔌 Connected successfully to MongoDB via Native Driver!');
    return db;
  } catch (error) {
    console.warn('⚠️ Failed to connect to MongoDB Atlas:', error.message);
    console.log('📂 Falling back to local JSON file-based database for offline capability...');
    const dbFile = path.join(__dirname, '../data/db.json');
    db = new MockDb(dbFile);
    return db;
  }
}

module.exports = { connectDB };
