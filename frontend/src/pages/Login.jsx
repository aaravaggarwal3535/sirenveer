/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import TrafficScene from "./trafficlightControl";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function Login() {
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Generate floating particles
  useEffect(() => {
    const particleArray = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 1,
      speedY: (Math.random() - 0.5) * 1,
    }));
    setParticles(particleArray);
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
    console.log("Form submitted!");
  };

  const containerVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1, boxShadow: "0 4px 15px rgba(0,0,0,0.1)" },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
      transition: { type: "spring", stiffness: 300 }
    },
    tap: { scale: 0.95 }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex">
      
      {/* Animated background gradient */}
      <motion.div
        animate={{
          background: [
            "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
            "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)",
            "linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)",
            "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
          ]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      />

      {/* Interactive floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white opacity-20"
          style={{
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            x: [particle.x, particle.x + particle.speedX * 100],
            y: [particle.y, particle.y + particle.speedY * 100],
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Mouse follower effect */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
        }}
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 15 }}
      />

      {/* LEFT SIDE - Login Form */}
      <motion.div 
        className="relative z-10 w-2/3 min-w-[400px] flex items-center justify-center p-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Glassmorphism container */}
        <motion.div
          className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-50"
            style={{
              background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
            }}
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-6">
            <motion.h1 className="text-2xl font-bold text-white mb-2">
              Traffic Predictor 🚦
            </motion.h1>
            <motion.p className="text-white/80 text-3xl font-extrabold">
              Travels just got faster 
            </motion.p>
          </motion.div>

          {/* Social login buttons */}
          <motion.div variants={itemVariants} className="space-y-3 mb-4">
            <motion.button
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/50 hover:bg-white/30 rounded-xl text-white text-sm font-medium backdrop-blur-sm border border-white/30"
            >
              <svg className="w-4 h-4 me-2" ariaHidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
<path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clipRule="evenodd"/>
</svg>
              Continue with Google
            </motion.button>

            <motion.button
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 hover:bg-gray-900/70 rounded-xl text-white text-sm font-medium backdrop-blur-sm border border-gray-700/50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </motion.button>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
            <hr className="flex-1 border-white/30" />
            <span className="text-white/60 text-xs">or</span>
            <hr className="flex-1 border-white/30" />
          </motion.div>

          {/* Form */}
          <motion.form variants={itemVariants} onSubmit={handleFormSubmit} className="space-y-3">
            <motion.input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 border border-white/20 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm"
              whileFocus={{ scale: 1.02 }}
              required
            />

            <motion.input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl text-white placeholder-white/60 border border-white/20 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 text-sm"
              whileFocus={{ scale: 1.02 }}
              required
            />

            <motion.button
              type="submit"
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              className="w-full py-3 mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl"
            >
              Start Traffic Control
            </motion.button>
          </motion.form>

          {/* Footer */}
          {/* <motion.div variants={itemVariants} className="mt-4 text-center">
            <p className="text-white/60 text-xs">
              New here? 
              <span className="text-white font-medium cursor-pointer ml-1 hover:underline">
                Create account
              </span>
            </p>
          </motion.div> */}
        </motion.div>
      </motion.div>

      {/* RIGHT SIDE - Traffic Scene */}
      <motion.div 
        className="relative z-10 flex-1 h-1/2 md:hide  top-1/4"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
      >
        {/* Scene container with border */}
        <div className="relative h-full right-32 rounded-3xl overflow-hidden border-2 border-white/20 bg-black/20 backdrop-blur-sm">
          {/* Scene title overlay */}
          <motion.div
            className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <h3 className="text-white font-semibold text-sm">Live Traffic Control Demo</h3>
            <p className="text-white/70 text-xs">Drag to rotate • Scroll to zoom</p>
          </motion.div>

          {/* 3D Scene */}
          <Canvas camera={{ position: [12, 6, 12], fov: 75 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 15, 5]} intensity={1.2} />
            <TrafficScene />
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              minDistance={6}
              maxDistance={35}
              minPolarAngle={0.2}
              maxPolarAngle={Math.PI / 2.1}
              enableDamping={true}
              dampingFactor={0.08}
              target={[0, 1, 0]}
            />
          </Canvas>

          {/* Scene controls overlay */}
          <motion.div
            className="absolute bottom-4 right-4 z-20 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              {/* <span className="text-white text-xs font-medium">System Active</span> */}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full opacity-20 mix-blend-multiply pointer-events-none"
        style={{ background: "linear-gradient(45deg, #ff9a56, #ffb347)" }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 opacity-20 mix-blend-multiply pointer-events-none"
        style={{ 
          background: "linear-gradient(45deg, #667eea, #764ba2)",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%"
        }}
        animate={{
          borderRadius: [
            "30% 70% 70% 30% / 30% 30% 70% 70%",
            "70% 30% 30% 70% / 70% 70% 30% 30%",
            "30% 70% 70% 30% / 30% 30% 70% 70%"
          ],
          rotate: [0, -180, -360],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}




