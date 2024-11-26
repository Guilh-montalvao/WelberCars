'use client'

import { useLoader, extend, useThree, useFrame, ReactThreeFiber } from "@react-three/fiber"
import { FBXLoader } from "three/addons/loaders/FBXLoader.js"
import { useEffect, useRef, useState } from 'react'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { Reflector, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { Bloom, EffectComposer, ToneMapping } from "@react-three/postprocessing"
import { BlendFunction } from 'postprocessing'
import { useWindowSize } from "@uidotdev/usehooks"

// Criando um material com Shader para bordas pretas e centro branco
const TransparentBorderMaterial = shaderMaterial(
  { fadeDistance: 0.4 },
  // Vertex Shader
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`
  ,
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
  }`
)

extend({ TransparentBorderMaterial })

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      transparentBorderMaterial: ReactThreeFiber.Object3DNode<
        typeof TransparentBorderMaterial,
        typeof TransparentBorderMaterial
      > & { fadeDistance: number }
    }
  }
}

const Render = ({ modelPath }: { modelPath: string }) => {
  const mesh = useRef<THREE.Mesh>(null!)
  const model = useLoader(FBXLoader, modelPath)
  const { width } = useWindowSize()
  const [isMobile, setIsMobile] = useState(false)
  const { camera, gl } = useThree()

  useEffect(() => {
    const handleResize = () => setIsMobile((width ?? window.innerWidth) < 800)
    console.log(width)
    window.addEventListener('resize', handleResize)
    handleResize()

    return () => window.removeEventListener('resize', handleResize)
  }, [width])

  useEffect(() => {
    camera.position.set(0, isMobile ? 20 : 10, 10)
    camera.lookAt(0, 0, 0)

    const controls = new OrbitControls(camera, gl.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.25
    controls.maxPolarAngle = Math.PI / 2
    controls.enableZoom = false
    controls.update()

    return () => controls.dispose()
  }, [camera, gl, isMobile])

  useFrame(() => {
    if (mesh.current) mesh.current.rotation.y += 0.005
  })

  return (
    <>
      {/* Fundo preto */}
      <color attach="background" args={['black']} />

      {/* Pós-processamento */}
      <EffectComposer>
        <ToneMapping
          blendFunction={BlendFunction.NORMAL}
          adaptive
          resolution={256}
          middleGrey={0.4}
          maxLuminance={8.0}
          averageLuminance={1.0}
          adaptationRate={1.0}
        />
        <Bloom
          intensity={0.1}
          luminanceThreshold={0.4}
          luminanceSmoothing={0.1}
        />
      </EffectComposer>

      {/* Cena */}
      <group scale={[3, 3, 3]} rotation={[0, 0, 0]}>
        {/* Luzes */}
        <ambientLight intensity={5} />
        <pointLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight
          position={[5, 5, 5]}
          intensity={5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.1}
          shadow-camera-far={50}
          shadow-bias={-0.0001}
        />

        {/* Modelo */}
        <mesh ref={mesh} castShadow receiveShadow>
          <primitive object={model} />
        </mesh>
       {/* Reflexo no chão com bordas transparentes */}
       <Reflector
        resolution={1024}
        args={[10, 64]} // [Raio, segmentos] para CircleGeometry
        mirror={0.75} // Intensidade do reflexo
        mixBlur={0.5} // Intensidade do blur
        mixStrength={0.8} // Intensidade do reflexo
        rotation={[-Math.PI / 2, 0, 0]} // Rotação para plano horizontal
        geometry={new THREE.CircleGeometry(5, 64)} // Geometria circular com raio 5 e 64 segmentos
        blur={[400, 100]} // Intensidade do blur nas direções X e Y
      >
        {(Material, props) => (
          <Material
            color="#a0a0a0" // Cor do reflexo
            metalness={0.9} // Metalicidade do material refletor
            roughness={0.1} // Rugosidade do material refletor
            {...props}
          />
        )}
      </Reflector>
      </group>
    </>
  )
}

export default Render