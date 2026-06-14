import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

const Particles = () => {
  const count = 120;
  const mesh = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.03;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#0ea5e9" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

const FloatingOrb = () => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.1;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.5}>
      <Sphere ref={mesh} args={[1.2, 64, 64]} position={[2, 0, -1]}>
        <MeshDistortMaterial
          color="#0ea5e9"
          roughness={0.15}
          metalness={0.9}
          distort={0.3}
          speed={1.5}
          transparent
          opacity={0.35}
        />
      </Sphere>
    </Float>
  );
};

const FloatingRing = () => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.2;
      mesh.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1}>
      <mesh ref={mesh} position={[-2.5, 1, -2]}>
        <torusGeometry args={[0.8, 0.05, 16, 100]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.5} transparent opacity={0.4} />
      </mesh>
    </Float>
  );
};

const HeroScene = () => {
  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <pointLight position={[-3, 2, 4]} intensity={0.4} color="#0ea5e9" />
        <Particles />
        <FloatingOrb />
        <FloatingRing />
      </Canvas>
    </div>
  );
};

export default HeroScene;
