import { Text } from "@react-three/drei"
// import {fadeOnBeforeCompileFlat}

export default function TextSection({title,subtitle,...props}){
    return (
        <group {...props}>
        {!!title && (    
            <Text
            color={"white"}
            anchorX={"left"}
            anchorY={"center"}
            fontSize={0.52}
            maxWidth={2.5}
            font={"./fonts/DM_Serif_Display/DMSerifDisplay-Regular.ttf"}>
                {title}
                <meshStandardMaterial
                color={"white"}
                />
            </Text>
        )}
        <Text
        color={"white"}
        anchorX={"left"}
        anchorY={"top"}
        position-y={-0.66}
        fontSize={0.22}
        maxWidth={2.5}
        font={"./fonts/DM_Serif_Display/DMSerifDisplay-Regular.ttf"}>
            {subtitle}
            <meshStandardMaterial color={"white"}/>
        </Text>
        </group>
    )
}