'use client'
import { useLoader, extend, useThree, useFrame, ReactThreeFiber } from "@react-three/fiber"
import { FBXLoader } from "three/addons/loaders/FBXLoader.js"
import { useEffect, useRef } from 'react'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Criando um material com Shader para bordas pretas e centro branco
const TransparentBorderMaterial = shaderMaterial(
  { fadeDistance: 0.4 },
  // Vertex Shader
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment Shader
  `
  uniform float fadeDistance;
  varying vec2 vUv;

  void main() {
    // Calcula a distância do centro do plano
    float dist = distance(vUv, vec2(0.5));
    // Define a intensidade da cor com um gradiente de branco (centro) para preto (bordas)
    float intensity = 1.0 - smoothstep(fadeDistance, 0.5, dist);
    vec3 color = mix(vec3(0.0), vec3(1.0), intensity); // Preto para branco
    gl_FragColor = vec4(color, 1.0); // Sempre opaco
  }
  `
)

// Estender o Fiber com o material personalizado
extend({ TransparentBorderMaterial })
// Extender tipagem para JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      transparentBorderMaterial: ReactThreeFiber.Object3DNode<
        typeof TransparentBorderMaterial,
        typeof TransparentBorderMaterial
      > & { fadeDistance: number };  // Adicionando fadeDistance na tipagem
    }
  }
}

const Render = ({ modelPath }: { modelPath: string }) => {
  const mesh = useRef<THREE.Mesh>(null!)
  const model = useLoader(FBXLoader, modelPath)

  // Acesso à câmera e controles
  const { camera, gl } = useThree()

  useEffect(() => {
    camera.position.set(0, 2, 10)
    camera.lookAt(0, 0, 0)

    const controls = new OrbitControls(camera, gl.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.screenSpacePanning = false
    controls.maxPolarAngle = Math.PI / 2

    controls.enableZoom = false

    controls.update()

    return () => {
      controls.dispose()
    }
  }, [camera, gl])

  // Efeito de rotação do carro
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.y += 0.005
    }
  })

  return (
    <>
      {/* Fundo preto */}
      <color attach="background" args={['black']} />

      {/* Agrupamento com escala global */}
      <group scale={[2, 2, 2]}>
        {/* Luzes da cena */}
        <pointLight position={[5, 5, 5]} intensity={60} castShadow />
        <ambientLight intensity={15} />
        <directionalLight
          position={[5, 5, 5]}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
        />

        {/* Modelo do McLaren */}
        <mesh ref={mesh} castShadow receiveShadow>
          <primitive object={model} />
        </mesh>

        {/* Chão/Plano com bordas pretas e centro branco */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          {/* Usando o material personalizado */}
          <transparentBorderMaterial fadeDistance={0.1} />
        </mesh>
      </group>
    </>
  )
}

export default Render
