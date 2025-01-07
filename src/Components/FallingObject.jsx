import { useGLTF } from '@react-three/drei';

const FallingObject = ({ position }) => {
  const meshRef = useRef();
  const [velocity, setVelocity] = useState(0);
  const { scene } = useGLTF('/path/to/your/model.glb');

  useFrame((state, delta) => {
    setVelocity(prev => prev + 0.001);
    meshRef.current.position.y -= velocity;
    meshRef.current.rotation.x += 0.02;
    meshRef.current.rotation.y += 0.02;
  });

  return (
    <primitive 
      ref={meshRef}
      object={scene.clone()} 
      position={position}
      scale={[0.5, 0.5, 0.5]} // Adjust scale as needed
    />
  );
}; 