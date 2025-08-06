/* eslint-disable no-unused-vars */


// components/TrafficScene.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const TrafficScene = () => {
  const [lightStates, setLightStates] = useState({
    north: 'red',
    south: 'red', 
    east: 'red',
    west: 'red'
  });
  const [cars, setCars] = useState([]);
  const characterRef = useRef();

  // Enhanced traffic light cycle with proper timing
  useEffect(() => {
    const cycle = () => {
      // Phase 1: North-South green, East-West red
      setLightStates({ north: 'green', south: 'green', east: 'red', west: 'red' });
      
      setTimeout(() => {
        // North-South yellow warning
        setLightStates({ north: 'yellow', south: 'yellow', east: 'red', west: 'red' });
      }, 10000);
      
      setTimeout(() => {
        // All red safety buffer
        setLightStates({ north: 'red', south: 'red', east: 'red', west: 'red' });
      }, 13000);
      
      setTimeout(() => {
        // Phase 2: East-West green, North-South red
        setLightStates({ north: 'red', south: 'red', east: 'green', west: 'green' });
      }, 15000);
      
      setTimeout(() => {
        // East-West yellow warning
        setLightStates({ north: 'red', south: 'red', east: 'yellow', west: 'yellow' });
      }, 25000);
      
      setTimeout(() => {
        // All red safety buffer before cycle restart
        setLightStates({ north: 'red', south: 'red', east: 'red', west: 'red' });
      }, 28000);
    };

    cycle();
    const interval = setInterval(cycle, 30000);
    return () => clearInterval(interval);
  }, []);

  // Initialize cars with proper spacing and lane positioning - FIXED POSITIONING
  useEffect(() => {
    const initialCars = [];
    const carSpacing = 6;
    
    // North-bound cars (moving from south to north) - right lane - FIXED Y POSITION
    for (let i = 0; i < 4; i++) {
      initialCars.push({
        id: `north-${i}`,
        position: [1.5, 0.4, 20 + i * carSpacing], // FIXED: proper Y position on road
        direction: 'north',
        speed: 0,
        targetSpeed: 0,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        lane: 'right'
      });
    }
    
    // South-bound cars (moving from north to south) - right lane
    for (let i = 0; i < 4; i++) {
      initialCars.push({
        id: `south-${i}`,
        position: [-1.5, 0.4, -20 - i * carSpacing], // FIXED: proper Y position on road
        direction: 'south',
        speed: 0,
        targetSpeed: 0,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        lane: 'right'
      });
    }
    
    // East-bound cars (moving from west to east) - right lane
    for (let i = 0; i < 4; i++) {
      initialCars.push({
        id: `east-${i}`,
        position: [-20 - i * carSpacing, 0.4, -1.5], // FIXED: proper Y position on road
        direction: 'east',
        speed: 0,
        targetSpeed: 0,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        lane: 'right'
      });
    }
    
    // West-bound cars (moving from east to west) - right lane
    for (let i = 0; i < 4; i++) {
      initialCars.push({
        id: `west-${i}`,
        position: [20 + i * carSpacing, 0.4, 1.5], // FIXED: proper Y position on road
        direction: 'west',
        speed: 0,
        targetSpeed: 0,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
        lane: 'right'
      });
    }
    
    setCars(initialCars);
  }, []);

  // Enhanced car collision detection function
  const checkCollision = (car1, car2, minDistance = 3.5) => {
    const dx = car1.position[0] - car2.position[0];
    const dz = car1.position[2] - car2.position[2];
    const distance = Math.sqrt(dx * dx + dz * dz);
    return distance < minDistance;
  };

  // Get cars ahead in the same direction
  const getCarAhead = (currentCar, allCars) => {
    return allCars.find(car => {
      if (car.id === currentCar.id || car.direction !== currentCar.direction) return false;
      
      switch (currentCar.direction) {
        case 'north':
          return car.position[2] < currentCar.position[2] && 
                 Math.abs(car.position[0] - currentCar.position[0]) < 2;
        case 'south':
          return car.position[2] > currentCar.position[2] && 
                 Math.abs(car.position[0] - currentCar.position[0]) < 2;
        case 'east':
          return car.position[0] > currentCar.position[0] && 
                 Math.abs(car.position[2] - currentCar.position[2]) < 2;
        case 'west':
          return car.position[0] < currentCar.position[0] && 
                 Math.abs(car.position[2] - currentCar.position[2]) < 2;
        default:
          return false;
      }
    });
  };

  // Enhanced car animation with collision avoidance - FIXED POSITIONING
  useFrame((state, delta) => {
    setCars(prevCars => 
      prevCars.map(car => {
        let targetSpeed = 0;
        let newPosition = [...car.position];
        const currentLight = lightStates[car.direction];
        const stopLinePosition = 8;

        // Check for car ahead
        const carAhead = getCarAhead(car, prevCars);
        const hasCarAhead = carAhead && checkCollision(car, carAhead, 4.5);

        // Determine target speed based on traffic light and obstacles
        const isInStopZone = (() => {
          switch (car.direction) {
            case 'north': return car.position[2] > -stopLinePosition;
            case 'south': return car.position[2] < stopLinePosition;
            case 'east': return car.position[0] < stopLinePosition;
            case 'west': return car.position[0] > -stopLinePosition;
            default: return false;
          }
        })();

        // Traffic light logic
        if (currentLight === 'green') {
          targetSpeed = hasCarAhead ? 0 : 4;
        } else if (currentLight === 'yellow') {
          if (isInStopZone && !hasCarAhead) {
            targetSpeed = hasCarAhead ? 0 : 1;
          } else {
            targetSpeed = hasCarAhead ? 0 : 4;
          }
        } else { // red light
          if (isInStopZone) {
            targetSpeed = 0;
          } else {
            targetSpeed = hasCarAhead ? 0 : 4;
          }
        }

        // Smooth speed transition
        const speedDiff = targetSpeed - car.speed;
        const acceleration = speedDiff > 0 ? 2 : -4;
        const newSpeed = Math.max(0, Math.min(targetSpeed, car.speed + acceleration * delta));

        // Update position based on direction and speed - MAINTAIN Y POSITION
        switch (car.direction) {
          case 'north':
            newPosition[2] -= newSpeed * delta;
            if (newPosition[2] < -30) {
              newPosition[2] = 30;
              newPosition[0] = 1.5;
            }
            newPosition[1] = 0.4; // FIXED: maintain proper Y position
            break;
            
          case 'south':
            newPosition[2] += newSpeed * delta;
            if (newPosition[2] > 30) {
              newPosition[2] = -30;
              newPosition[0] = -1.5;
            }
            newPosition[1] = 0.4; // FIXED: maintain proper Y position
            break;
            
          case 'east':
            newPosition[0] += newSpeed * delta;
            if (newPosition[0] > 30) {
              newPosition[0] = -30;
              newPosition[2] = -1.5;
            }
            newPosition[1] = 0.4; // FIXED: maintain proper Y position
            break;
            
          case 'west':
            newPosition[0] -= newSpeed * delta;
            if (newPosition[0] < -30) {
              newPosition[0] = 30;
              newPosition[2] = 1.5;
            }
            newPosition[1] = 0.4; // FIXED: maintain proper Y position
            break;
        }

        return {
          ...car,
          position: newPosition,
          speed: newSpeed,
          targetSpeed
        };
      })
    );

    // Enhanced character animations
    if (characterRef.current) {
      const time = state.clock.getElapsedTime();
      const activeDirections = Object.entries(lightStates)
        .filter(([_, state]) => state === 'green')
        .map(([dir, _]) => dir);
      
      if (activeDirections.length > 0) {
        // Active traffic directing - point toward active directions
        if (activeDirections.includes('north') || activeDirections.includes('south')) {
          characterRef.current.rotation.y = Math.sin(time * 2) * 0.1;
        } else {
          characterRef.current.rotation.y = Math.PI/2 + Math.sin(time * 2) * 0.1;
        }
        characterRef.current.position.y = 0.8 + Math.sin(time * 3) * 0.03; // FIXED: proper ground position
      } else {
        // Alert watching - scan all directions
        characterRef.current.rotation.y = time * 0.5;
        characterRef.current.position.y = 0.8 + Math.sin(time * 4) * 0.02; // FIXED: proper ground position
      }
    }
  });

  // FIXED: Character with proper scaling and positioning
  const Character = () => (
    <group ref={characterRef} position={[0, 0.8, 0]} scale={[0.6, 0.6, 0.6]}> {/* FIXED: proper scale and position */}
      {/* Main Body - perfect cubic match */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[1.4, 2, 1.2]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.7} />
      </mesh>
      
      {/* Head - cubic with proper proportions */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[1.2, 1.2, 1.1]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.7} />
      </mesh>
      
      {/* Police Hat Base */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.65, 0.7, 0.5, 12]} />
        <meshStandardMaterial color="#1e40af" roughness={0.3} />
      </mesh>
      
      {/* Hat Crown */}
      <mesh position={[0, 1.85, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.3, 12]} />
        <meshStandardMaterial color="#1e40af" roughness={0.3} />
      </mesh>
      
      {/* Hat Peak/Visor */}
      <mesh position={[0, 1.35, 0.6]}>
        <boxGeometry args={[1.3, 0.08, 0.5]} />
        <meshStandardMaterial color="#1e40af" roughness={0.3} />
      </mesh>
      
      {/* Hat Badge - prominent yellow circle */}
      <mesh position={[0, 1.6, 0.6]}>
        <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.2} />
      </mesh>
      
      {/* Large Eyes - exactly like image */}
      <mesh position={[-0.3, 1, 0.55]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.3, 1, 0.55]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Eye pupils - large and prominent */}
      <mesh position={[-0.3, 1, 0.68]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.3, 1, 0.68]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      {/* Eye highlights */}
      <mesh position={[-0.26, 1.04, 0.72]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.34, 1.04, 0.72]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Mustache - thick and prominent */}
      <mesh position={[0, 0.78, 0.55]}>
        <boxGeometry args={[0.6, 0.12, 0.1]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      {/* Eyebrows - angled like in image */}
      <mesh position={[-0.3, 1.2, 0.55]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.35, 0.08, 0.05]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[0.3, 1.2, 0.55]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.35, 0.08, 0.05]} />
        <meshStandardMaterial color="black" />
      </mesh>
      
      {/* Arms with proper police uniform look */}
      <mesh position={[-1, 0.1, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.15, 0.15, 1.4, 8]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
      <mesh position={[1, 0.1, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.15, 0.15, 1.4, 8]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
      
      {/* White gloves - prominent and clean */}
      <mesh position={[-1.4, -0.5, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="white" roughness={0.2} />
      </mesh>
      <mesh position={[1.4, -0.5, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="white" roughness={0.2} />
      </mesh>
      
      {/* Legs - proper police uniform */}
      <mesh position={[-0.35, -1.6, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.6, 8]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
      <mesh position={[0.35, -1.6, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1.6, 8]} />
        <meshStandardMaterial color="#d1d5db" />
      </mesh>
      
      {/* White boots/shoes */}
      <mesh position={[-0.35, -2.5, 0.25]}>
        <boxGeometry args={[0.35, 0.25, 0.7]} />
        <meshStandardMaterial color="white" roughness={0.2} />
      </mesh>
      <mesh position={[0.35, -2.5, 0.25]}>
        <boxGeometry args={[0.35, 0.25, 0.7]} />
        <meshStandardMaterial color="white" roughness={0.2} />
      </mesh>
      
      {/* Police whistle cord */}
      <mesh position={[0, 0.3, 0.55]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
        <meshStandardMaterial color="#666" />
      </mesh>
      
      {/* Small whistle */}
      <mesh position={[0.3, 0.2, 0.5]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 6]} rotation={[0, 0, Math.PI/2]} />
        <meshStandardMaterial color="silver" metalness={0.8} />
      </mesh>
    </group>
  );

  // FIXED: Traffic Light System with proper positioning
  const TrafficLightSystem = () => (
    <>
      {/* North Traffic Light - FIXED positioning */}
      <group position={[3, 0, -10]}>
        <TrafficLight direction="north" lightState={lightStates.north} />
      </group>
      
      {/* South Traffic Light - FIXED positioning */}
      <group position={[-3, 0, 10]}>
        <TrafficLight direction="south" lightState={lightStates.south} />
      </group>
      
      {/* East Traffic Light - FIXED positioning */}
      <group position={[10, 0, -3]} rotation={[0, Math.PI/2, 0]}>
        <TrafficLight direction="east" lightState={lightStates.east} />
      </group>
      
      {/* West Traffic Light - FIXED positioning */}
      <group position={[-10, 0, 3]} rotation={[0, -Math.PI/2, 0]}>
        <TrafficLight direction="west" lightState={lightStates.west} />
      </group>
    </>
  );

  // FIXED: Traffic Light Component with proper ground positioning
  const TrafficLight = ({ direction, lightState }) => (
    <group>
      {/* Pole - FIXED height and positioning */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 5, 8]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.8} />
      </mesh>
      
      {/* Light housing - FIXED positioning */}
      <mesh position={[0, 4.5, 0]}>
        <boxGeometry args={[0.8, 2.2, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
      
      {/* Red light */}
      <mesh position={[0, 5.2, 0.26]}>
        <circleGeometry args={[0.25, 16]} />
        <meshStandardMaterial 
          color={lightState === 'red' ? '#ff0000' : '#330000'}
          emissive={lightState === 'red' ? '#ff0000' : '#000000'}
          emissiveIntensity={lightState === 'red' ? 1.2 : 0}
        />
      </mesh>
      
      {/* Yellow light */}
      <mesh position={[0, 4.5, 0.26]}>
        <circleGeometry args={[0.25, 16]} />
        <meshStandardMaterial 
          color={lightState === 'yellow' ? '#ffff00' : '#333300'}
          emissive={lightState === 'yellow' ? '#ffff00' : '#000000'}
          emissiveIntensity={lightState === 'yellow' ? 1.2 : 0}
        />
      </mesh>
      
      {/* Green light */}
      <mesh position={[0, 3.8, 0.26]}>
        <circleGeometry args={[0.25, 16]} />
        <meshStandardMaterial 
          color={lightState === 'green' ? '#00ff00' : '#003300'}
          emissive={lightState === 'green' ? '#00ff00' : '#000000'}
          emissiveIntensity={lightState === 'green' ? 1.2 : 0}
        />
      </mesh>
      
      {/* Direction sign - FIXED positioning */}
      <mesh position={[0, 1, 0.3]}>
        <boxGeometry args={[0.8, 0.3, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      <Text
        position={[0, 1, 0.36]}
        fontSize={0.15}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {direction.toUpperCase()}
      </Text>
    </group>
  );

  // FIXED: Car Component with proper scaling and positioning
  const Car = ({ position, color, direction, speed }) => {
 // CORRECTED: Rotate cars 90 degrees so headlights face movement direction
const rotation = {
  north: [0, Math.PI/2, 0],  // Rotate 90° counterclockwise
  south: [0, -Math.PI/2, 0],   // Rotate 90° clockwise  
  east: [0, 0, 0],            // No rotation needed
  west: [0, Math.PI, 0]       // Rotate 180°
};

    return (
      <group position={position} rotation={rotation[direction]} scale={[0.8, 0.8, 0.8]}> {/* FIXED: proper scale */}
        {/* Main car body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3, 1.2, 1.5]} /> {/* FIXED: better proportions */}
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
        </mesh>
        
        {/* Car roof */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[2, 0.8, 1.3]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
        </mesh>
        
        {/* Front windshield */}
        <mesh position={[1, 0.8, 0]}>
          <boxGeometry args={[0.1, 0.6, 1.2]} />
          <meshStandardMaterial color="#87ceeb" transparent opacity={0.7} />
        </mesh>
        
        {/* Headlights - front of car */}
        <mesh position={[1.6, 0.3, -0.5]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[1.6, 0.3, 0.5]}>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.3} />
        </mesh>
        
        {/* Wheels - FIXED positioning */}
        {[
          [-1, -0.6, 0.8],
          [1, -0.6, 0.8],
          [-1, -0.6, -0.8],
          [1, -0.6, -0.8]
        ].map((pos, index) => (
          <mesh key={index} position={pos} rotation={[Math.PI/2, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 12]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        ))}
        
        {/* Brake lights - rear of car */}
        <mesh position={[-1.6, 0.3, -0.5]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial 
            color={speed < 0.5 ? '#ff0000' : '#440000'}
            emissive={speed < 0.5 ? '#ff0000' : '#000000'}
            emissiveIntensity={speed < 0.5 ? 0.8 : 0}
          />
        </mesh>
        <mesh position={[-1.6, 0.3, 0.5]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial 
            color={speed < 0.5 ? '#ff0000' : '#440000'}
            emissive={speed < 0.5 ? '#ff0000' : '#000000'}
            emissiveIntensity={speed < 0.5 ? 0.8 : 0}
          />
        </mesh>
      </group>
    );
  };

  // Professional Road System - NO CHANGES NEEDED, already correct
  const RoadSystem = () => (
    <>
      {/* Main intersection */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <boxGeometry args={[16, 16, 0.1]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.9} />
      </mesh>
      
      {/* North-South road */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <boxGeometry args={[8, 60, 0.1]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.9} />
      </mesh>
      
      {/* East-West road */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <boxGeometry args={[60, 8, 0.1]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.9} />
      </mesh>
      
      {/* Lane dividers - dashed lines */}
      {Array.from({length: 20}, (_, i) => (
        <mesh key={`ns-${i}`} position={[0, 0.02, -30 + i * 3]} rotation={[-Math.PI/2, 0, 0]}>
          <boxGeometry args={[0.2, 1, 0.02]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
      ))}
      
      {Array.from({length: 20}, (_, i) => (
        <mesh key={`ew-${i}`} position={[-30 + i * 3, 0.02, 0]} rotation={[-Math.PI/2, 0, Math.PI/2]}>
          <boxGeometry args={[0.2, 1, 0.02]} />
          <meshStandardMaterial color="#ffff00" />
        </mesh>
      ))}
      
      {/* Stop lines */}
      <mesh position={[0, 0.03, -8]} rotation={[-Math.PI/2, 0, 0]}>
        <boxGeometry args={[8, 0.5, 0.02]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0, 0.03, 8]} rotation={[-Math.PI/2, 0, 0]}>
        <boxGeometry args={[8, 0.5, 0.02]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-8, 0.03, 0]} rotation={[-Math.PI/2, 0, Math.PI/2]}>
        <boxGeometry args={[8, 0.5, 0.02]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[8, 0.03, 0]} rotation={[-Math.PI/2, 0, Math.PI/2]}>
        <boxGeometry args={[8, 0.5, 0.02]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Crosswalks */}
      {[-10, 10].map(pos => (
        <React.Fragment key={pos}>
          <mesh position={[0, 0.04, pos]} rotation={[-Math.PI/2, 0, 0]}>
            <boxGeometry args={[8, 3, 0.02]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[pos, 0.04, 0]} rotation={[-Math.PI/2, 0, Math.PI/2]}>
            <boxGeometry args={[8, 3, 0.02]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </React.Fragment>
      ))}
    </>
  );

  // Current active direction for display
  const getActiveDirection = () => {
    const activeDirections = Object.entries(lightStates)
      .filter(([_, state]) => state === 'green')
      .map(([direction, _]) => direction);
    return activeDirections.length > 0 ? activeDirections.join(' & ') : 'All Stop';
  };

  return (
    <>
      {/* Ground - FIXED positioning */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#228b22" roughness={0.9} />
      </mesh>
      
      {/* Add some grass texture patches - FIXED positioning */}
      {Array.from({length: 30}, (_, i) => (
        <mesh 
          key={i}
          position={[
            -40 + Math.random() * 80,
            -0.05,
            -40 + Math.random() * 80
          ]} 
          rotation={[-Math.PI/2, 0, Math.random() * Math.PI]}
        >
          <planeGeometry args={[1.5, 1.5]} />
          <meshStandardMaterial color="#32cd32" transparent opacity={0.6} />
        </mesh>
      ))}
      
      <RoadSystem />
      <TrafficLightSystem />
      <Character />
      
      {/* Render cars with enhanced details */}
      {cars.map(car => (
        <Car 
          key={car.id} 
          position={car.position} 
          color={car.color} 
          direction={car.direction}
          speed={car.speed}
        />
      ))}
      
      {/* FIXED: Status displays with better positioning */}
      <Text
        position={[0, 6, 0]}
        fontSize={0.8}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        Professional Traffic Control System
      </Text>
      
      <Text
        position={[0, 5.2, 0]}
        fontSize={0.6}
        color="blue"
        anchorX="center"
        anchorY="middle"
      >
        Active Flow: {getActiveDirection().toUpperCase()}
      </Text>
      
      {/* Direction status with better positioning */}
      <Text
        position={[-12, 4, 0]}
        fontSize={0.4}
        color={lightStates.north === 'green' ? 'green' : lightStates.north === 'yellow' ? 'orange' : 'red'}
        anchorX="center"
        anchorY="middle"
      >
        ↑ NORTH: {lightStates.north.toUpperCase()}
      </Text>
      
      <Text
        position={[12, 4, 0]}
        fontSize={0.4}
        color={lightStates.south === 'green' ? 'green' : lightStates.south === 'yellow' ? 'orange' : 'red'}
        anchorX="center"
        anchorY="middle"
      >
        ↓ SOUTH: {lightStates.south.toUpperCase()}
      </Text>
      
      <Text
        position={[0, 4, -12]}
        fontSize={0.4}
        color={lightStates.east === 'green' ? 'green' : lightStates.east === 'yellow' ? 'orange' : 'red'}
        anchorX="center"
        anchorY="middle"
      >
        → EAST: {lightStates.east.toUpperCase()}
      </Text>
      
      <Text
        position={[0, 4, 12]}
        fontSize={0.4}
        color={lightStates.west === 'green' ? 'green' : lightStates.west === 'yellow' ? 'orange' : 'red'}
        anchorX="center"
        anchorY="middle"
      >
        ← WEST: {lightStates.west.toUpperCase()}
      </Text>
    </>
  );
};

export default TrafficScene;

