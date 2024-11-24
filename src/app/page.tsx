'use client'

import Render from "@/components/render";
import Image from "next/image";
import { Canvas } from "@react-three/fiber"

export default function Home() {
  
  return (
    <div className="flex w-full overflow-x-hidden flex-col">
      {/* Página 1 */}
      <div className="w-full overflow-x-hidden h-screen relative flex">
        <Image
          src={'/homepage-bg.png'}
          alt="Homepage image"
          fill
          className="object-cover z-0 pointer-events-none"
        />
        <div className="flex flex-1 flex-col z-[1] justify-center items-center text-center">
          <h1 className="text-[54px] font-bold">BEM-VINDO A WELBERCARS</h1>
          <h3 className="text-[24px]">SUA REVENDEDORA MCLAREN</h3>
        </div>
      </div>
      {/* Página 2 */}
      <div className="w-full overflow-x-hidden h-screen flex justify-center items-center">
        <Canvas
          className='h-full w-full'
          shadows
        >
          <Render modelPath='/2022-mclaren-765lt/Final_Model.fbx' />
        </Canvas>
      </div>
     {/* Página 3 */}
      <div className="w-full overflow-x-hidden h-screen flex justify-center items-center">
        <Canvas
          className='h-full w-full'
          shadows
        >
          <Render modelPath='/2017-mclaren-720s-gt3-duke-dynamics-widebody-kit/FINAL_7_1.fbx' />
        </Canvas>
      </div>
    </div>
  );
}
