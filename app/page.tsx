"use client";
import SpiderLogo from "@/components/3d models/spider logo";
import IntroSection from "@/components/main page/intro section";
import TitleSection from "@/components/main page/title section";
import { getTailwindColor } from "@/libs/utils/get tailwind color";
import {
  Center,
  ContactShadows,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";


export default function HomePage() {
  getTailwindColor('red')
  return (
    <main>
      <div className='w-full h-screen'>
        <Canvas
          className='bg-spider-red-500'
          camera={{
            position: [0, 2.8, -5],
            rotation: [0, 3.15, 0],
            fov: 100,
            near: 0.1,
            far: 1000,
          }}
        >
          <>
            <directionalLight />
            <ContactShadows
              opacity={1}
              scale={10}
              blur={1}
              far={10}
              resolution={256}
              color='#000000'
            />

            <Center top>
              <group position={[0, 0.5, 0]}>
                <SpiderLogo />
              </group>
            </Center>

            <mesh
              scale={5}
              rotation-x={-Math.PI * 0.5}
              position-y={-0.01}
            >
              <planeGeometry />
              <meshStandardMaterial color={"red"} />
            </mesh>
          </>
        </Canvas>
      </div>
      {/* <IntroSection /> */}
      {/* <TitleSection /> */}
    </main>
  );
}
