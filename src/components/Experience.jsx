import { Float, OrbitControls,Line, PerspectiveCamera, useScroll, Text } from "@react-three/drei";
import {Background} from "./Background";
import { Airplane } from "./Airplane";
import { Cloud } from "./Cloud";
import { useMemo } from "react";
import * as THREE from "three"
import { Group, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import TextSection from "./TextSection";


const LINE_NB_POINTS=12000
const CURVE_DISTANCE=250;
const CURVE_AHEAD_CAMERA=0.008;
const CURVE_AHEAD_AIRPLANE=0.02;
const AIRPLANE_MAX_ANGLE=35;

export const Experience = () => {

  const curvePoints=useMemo(()=>[
    new THREE.Vector3(0,0,0),
    new THREE.Vector3(0,0,-CURVE_DISTANCE),
    new THREE.Vector3(100,0,-2*CURVE_DISTANCE),
    new THREE.Vector3(-100,0,-3*CURVE_DISTANCE),
    new THREE.Vector3(100,0,-4*CURVE_DISTANCE),
    new THREE.Vector3(0, 0, -5*CURVE_DISTANCE),
    new THREE.Vector3(0, 0, -6*CURVE_DISTANCE),
    new THREE.Vector3(0, 0, -7*CURVE_DISTANCE),
    
  ],
  [])

  const curve=useMemo(()=>{
    return new THREE.CatmullRomCurve3(curvePoints,
  false, "catmullrom", 0.5)
  },[])

  const textSections=useMemo(()=>{
    return[
      {
        position: new Vector3(
          curvePoints[1].x-3,
          curvePoints[1].y,
          curvePoints[1].z
        ),
        subtitle:`Welcome to my website,
        Have a seat and enjoy the ride!`
      },
      {
        position: new Vector3(
          curvePoints[2].x-3,
          curvePoints[2].y,
          curvePoints[2].z
        ),
        title:`Services`,
        subtitle:`Do you want a drink?
        We have a wide range of bevarages!`
      },
      {
        position: new Vector3(
          curvePoints[3].x-3,
          curvePoints[3].y,
          curvePoints[3].z
        ),
        title:`Fear of flying?`,
        subtitle:`Our flight attendants will help you have a great journey`
      },
      {
        position: new Vector3(
          curvePoints[4].x-3,
          curvePoints[4].y,
          curvePoints[4].z
        ),
        title:`Movies`,
        subtitle:`We provide a large selection of medias.`
      },
    ]
  })


  const shape=useMemo(()=>{
    const shape=new THREE.Shape();
    shape.moveTo(0,-0.2)
    shape.lineTo(0,0.2)
    
    return shape;
  },[curve])

  const cameraGroup=useRef();
  const scroll=useScroll();

  useFrame((_state,delta)=>{
    
    const scrollOffset=Math.max(0,scroll.offset);

    const curPoint=curve.getPoint(scrollOffset);

    cameraGroup.current.position.lerp(curPoint,delta*24)

    const lookAtPoint=curve.getPoint(
      Math.min(scrollOffset+CURVE_AHEAD_CAMERA,1)
    )

    const currentLookAt=cameraGroup.current.getWorldDirection(
      new THREE.Vector3()
    )

    const targetLookAt=new THREE.Vector3()
    .subVectors(curPoint,lookAtPoint)
    .normalize()

    const lookAt=currentLookAt.lerp(targetLookAt,delta*24);
    cameraGroup.current.lookAt(
      cameraGroup.current.position.clone().add(lookAt)
    )

    const tangent=curve.getTangent(scrollOffset+CURVE_AHEAD_CAMERA)

    const nonLerpLookAt=new Group();
    nonLerpLookAt.position.copy(curPoint);
    nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt))

    tangent.applyAxisAngle(
      new THREE.Vector3(0,1,0),
      -nonLerpLookAt.rotation.y
    )

    let angle=Math.atan2(-tangent.z,tangent.x);
    angle=-Math.PI/2 +angle;

    let angleDegrees=(angle*180)/Math.PI;
    angleDegrees*=2.4;

    if(angleDegrees<0){
      angleDegrees=Math.max(angleDegrees,-AIRPLANE_MAX_ANGLE);
    }

    if(angleDegrees>0){
      angleDegrees=Math.min(angleDegrees,AIRPLANE_MAX_ANGLE);
    }

    angle=(angleDegrees*Math.PI)/180;

    const targetAirplaneQuaternion= new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angle,
      )
    )

    airplane.current.quaternion.slerp(targetAirplaneQuaternion,delta*2)

  })

  const airplane=useRef();

  return (
    <>
      {/* <OrbitControls enableZoom={false} /> */}
      <group ref={cameraGroup}>
        <Background/>
        <PerspectiveCamera position={[0,0,5]} fov={30} makeDefault/>
        <group ref={airplane}>
          <Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
          <Airplane rotation-y={Math.PI/2} scale={[0.2,0.2,0.2]} position-y={0.1} />
          </Float>
        </group>
      </group>

      {
        textSections.map((textSection,index)=>(
          <TextSection {...textSection} key={index}/>
        ))
      }

      <group position-y={-2}>
        <mesh>
          <extrudeGeometry args={[
            shape,
            {
              steps:LINE_NB_POINTS,
              bevelEnabled:false,
              extrudePath:curve,
            }
          ]}/>
          <meshStandardMaterial color={"white"} opacity={0.7} transparent/>
        </mesh>
      </group>

      <Cloud scale={[1, 1, 1.5]} position={[-3.5, -1.2, -7]} />
      <Cloud scale={[1, 1, 2]} position={[3.5, -1, -10]} rotation-y={Math.PI} />
      <Cloud
        scale={[1, 1, 1]}
        position={[-3.5, 0.2, -12]}
        rotation-y={Math.PI / 3}
      />
      <Cloud scale={[1, 1, 1]} position={[3.5, 0.2, -12]} />

      <Cloud
        scale={[0.4, 0.4, 0.4]}
        rotation-y={Math.PI / 9}
        position={[1, -0.2, -12]}
      />
      <Cloud scale={[0.3, 0.5, 2]} position={[-4, -0.5, -53]} />
      <Cloud scale={[0.8, 0.8, 0.8]} position={[-1, -1.5, -100]} />
    </>
  );
};
