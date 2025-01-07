import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Single falling object component
const FallingObject = ({ position }) => {
  const meshRef = useRef();
  const [velocity, setVelocity] = useState(0);

  useFrame((state, delta) => {
    // Update velocity and position
    setVelocity(prev => prev + 0.001);
    meshRef.current.position.y -= velocity;
    
    // Rotate the object
    meshRef.current.rotation.x += 0.02;
    meshRef.current.rotation.y += 0.02;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusKnotGeometry args={[0.5, 0.2, 100, 16]} />
      <meshPhongMaterial color={`hsl(${Math.random() * 360}, 70%, 50%)`} />
    </mesh>
  );
};

// Main scene component
const Scene = () => {
  const [objects, setObjects] = useState([]);

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      setObjects(prev => [
        ...prev,
        {
          id: Math.random(),
          position: [
            (Math.random() - 0.5) * 10, // x
            10, // y
            (Math.random() - 0.5) * 5 // z
          ]
        }
      ]);
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, []);

  // Clean up objects that have fallen below the scene
  useFrame(() => {
    setObjects(prev => prev.filter(obj => obj.position[1] > -10));
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 1, 1]} intensity={0.5} />
      {objects.map(obj => (
        <FallingObject key={obj.id} position={obj.position} />
      ))}
    </>
  );
};

// Main component
const FallingModels = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <Scene />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default FallingModels; 