import { Environment, Sphere } from "@react-three/drei";
import { Gradient, LayerMaterial } from "lamina";
import * as THREE from "three"

export const Background=()=>{
    return (
        <>
        <Environment preset="sunset"/>
        <Sphere args={[1, 64, 64]} scale={[-50, 50, 50]}>
            <LayerMaterial
            lighting="physical" 
            transmission={1} 
            side={THREE.BackSide}>
                <Gradient 
                colorA="blue" 
                colorB="white" axes="y"/>
            </LayerMaterial>
        </Sphere>
        </>
    )
}