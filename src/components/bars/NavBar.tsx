import Image from "next/image"
import Link from "next/link"

export function NavBar() {
    return (
        <div className="absolute flex flex-row z-50 w-full h-[131px] justify-between bg-black px-6">
            <Image
              src={'/logo.png'}
              alt="logo"
              width={385}
              height={81}
            />
            <div className="flex flex-row justify-center items-center gap-5">
                <Link href={'/about'} className="text-xl">Inicio</Link>
                <Link href={'/about'} className="text-xl">Clube</Link>
                <Link href={'/about'} className="text-xl">Sobre</Link>
                <Link href={'/about'} className="text-xl">Ajuda</Link>
                <button className="text-xl border p-2 border-white">Register Now</button>
            </div>
        </div>
    )
}
