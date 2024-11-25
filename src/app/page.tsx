'use client'

import Render from "@/components/render";
import Image from "next/image";
import { Canvas } from "@react-three/fiber"
import { useState } from "react";

enum Cars {
  Mclaren720s = "Mclaren720s",
  Mclaren765lt = "Mclaren765lt"
}

const carsData = [
  {
    src: "/2022-mclaren-765lt.webp",
    alt: "2022 Mclaren 765lt",
    type: Cars.Mclaren765lt,
    speed: 330,
    torque: 800,
    lbft: 590,
    power: 765,
    mph: 205,
    bhp: 755
  },
  {
    src: "/2017-mclaren-720s.jpg",
    alt: "2017 Mclaren 720s",
    type: Cars.Mclaren720s,
    speed: 341,
    torque: 770,
    lbft: 568,
    power: 720,
    mph: 212,
    bhp: 710
  }
]

export default function Home() {
  const [car, setCar] = useState<Cars>(Cars.Mclaren720s)
  const data = carsData.find((carData) => carData.type === car)
  
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
      <div className="flex relative w-full h-screen overflow-hidden justify-center items-center">
          <div
            className="flex flex-col absolute z-50 gap-2 p-5"
            style={{
              top: '20%', // Ajuste conforme necessário
              left: '1rem',
              width: 'fit-content', // Limita a largura ao conteúdo interno
              height: 'fit-content', // Limita a altura ao conteúdo interno
              pointerEvents: 'none', // Faz o contêiner ser ignorado
            }}
          >
            <div className="flex flex-row gap-2">
              <h1 className="text-3xl font-semibold">{data?.speed}</h1>
              <h3 className="text-xl font-semibold">k/m</h3>
            </div>
            <div className="flex flex-row gap-2">
              <h3 className="text-xl font-semibold">{data?.mph}</h3>
              <h3 className="text-xl font-semibold">mph</h3>
            </div>
            <h2 className="text-2xl font-semibold">Velocidade</h2>
          </div>

          <div
            className="flex flex-col absolute z-50 gap-2 p-5"
            style={{
              top: '50%',
              left: '1rem',
              width: 'fit-content',
              height: 'fit-content',
              pointerEvents: 'none',
            }}
          >
            <div className="flex flex-row gap-2">
              <h1 className="text-3xl font-semibold">{data?.torque}</h1>
              <h3 className="text-xl font-semibold">Nm</h3>
            </div>
            <div className="flex flex-row gap-2">
              <h3 className="text-xl font-semibold">{data?.lbft}</h3>
              <h3 className="text-xl font-semibold">lbft</h3>
            </div>
            <h2 className="text-2xl font-semibold">Torque</h2>
          </div>

          <div
            className="flex flex-col absolute z-50 gap-2 p-5"
            style={{
              top: '80%',
              left: '1rem',
              width: 'fit-content',
              height: 'fit-content',
              pointerEvents: 'none',
            }}
          >
            <div className="flex flex-row gap-2">
              <h1 className="text-3xl font-semibold">{data?.power}</h1>
              <h3 className="text-xl font-semibold">PS</h3>
            </div>
            <div className="flex flex-row gap-2">
              <h3 className="text-xl font-semibold">{data?.bhp}</h3>
              <h3 className="text-xl font-semibold">bhp</h3>
            </div>
            <h2 className="text-2xl font-semibold">Força</h2>
          </div>

          <div 
            className="absolute z-50 flex flex-col items-center justify-center gap-4"
            style={{
              top: '50%', // Ajuste conforme necessário
              right: '1rem',
              width: 'fit-content', // Limita a largura ao conteúdo interno
              height: 'fit-content', // Limita a altura ao conteúdo interno
              pointerEvents: 'none', // Faz o contêiner ser ignorado
            }}
          >
          {carsData.map((carData) => (
            <div key={carData.type}>
              <Image
                onClick={() => setCar(carData.type)}
                src={carData.src}
                alt={carData.alt}
                width={100}
                height={100}
                sizes="100vw"
                className="w-15 sm:w-20 md:w-24 lg:w-32 xl:w-40" // Ajuste o tamanho conforme o dispositivo
                style={{
                  height: 'auto',
                  pointerEvents: 'auto',
                  borderRadius: "1.5rem",
                  cursor: car === carData.type ? 'not-allowed' : 'pointer',
                  filter: car === carData.type ? 'grayscale(100%) brightness(70%)' : 'none',
                }}
                />
              </div>
          ))}
      </div>
      {car === Cars.Mclaren720s ? (
        <Canvas shadows>
          <Render modelPath='/2017-mclaren-720s-gt3-duke-dynamics-widebody-kit/FINAL_7_1.fbx' />
        </Canvas>
      ) : car === Cars.Mclaren765lt ? (
          <Canvas shadows>
            <Render modelPath='/2022-mclaren-765lt/Final_Model.fbx' />
          </Canvas>
      ) : <p>Nenhum carro selecionado!</p>}
      </div>
      <div className="w-full overflow-x-hidden h-screen relative flex">
        <Image
          src={'/footer.png'}
          alt="Homepage image"
          fill
          className="object-cover z-0 pointer-events-none"
        />
        </div>
    </div>
  );
}
