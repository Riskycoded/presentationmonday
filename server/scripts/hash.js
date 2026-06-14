const bcrypt = require('bcryptjs');

const passwordToHash = process.argv[2] || 'admin123';

async function generateHash() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(passwordToHash, salt);
    
    console.log('\n🔐 --- BCrypt Hashing Utility ---');
    console.log(`Original Plaintext Password: "${passwordToHash}"`);
    console.log(`Generated BCrypt Hash:       ${hash}`);
    console.log('\nSave the Generated BCrypt Hash in your .env file as:');
    console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generateHash();
