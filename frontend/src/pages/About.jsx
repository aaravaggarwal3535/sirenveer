/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import {  CloudArrowUpIcon,  SparklesIcon, ShieldCheckIcon, GlobeAltIcon, TruckIcon, UserGroupIcon, ChartBarIcon } from "@heroicons/react/24/outline";

const Aboutpage = () => {
  const imageCycle = ["stopdude.png", "waitdude.png", "godude.png", "all"];
  const [uploadedImage, setUploadedImage] = useState(null);
  const [trafficPrediction, setTrafficPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const[forwardlogin,setforwardlogin] = useState(false)
   const [watchdemo,setwatchdemo] = useState(false)

  // const [activeFeature, setActiveFeature] = useState(0);
  const fileInputRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [stage, setStage] = useState(0);
    const navigate = useNavigate()

    useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % imageCycle.length);
    }, 2000); // 2 seconds interval

    return () => clearInterval(interval);
  }, []);

useEffect(() => {
    if (forwardlogin) {
      navigate("/Home");
    }
    setforwardlogin(false)
  }, [forwardlogin]);


  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Simulate traffic analysis
  const analyzeTraffic = async (file) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock prediction results
    const predictions = [
      { status: 'red', confidence: 92, vehicles: 45, avgSpeed: 8, congestion: 'Heavy' },
      { status: 'yellow', confidence: 87, vehicles: 28, avgSpeed: 15, congestion: 'Moderate' },
      { status: 'green', confidence: 95, vehicles: 12, avgSpeed: 35, congestion: 'Light' }
    ];
    
    const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
    setTrafficPrediction(randomPrediction);
    setIsAnalyzing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        analyzeTraffic(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const features = [
    {
      title: "Smart Traffic Prediction",
      description: "AI-powered analysis of traffic conditions from images and real-time data",
      icon: "🚦",
      color: "from-blue-500 to-purple-600"
    },
    {
      title: "Optimal Route Planning",
      description: "Dynamic path optimization for fastest travel times and jam avoidance",
      icon: "🗺️",
      color: "from-green-500 to-teal-600"
    },
    {
      title: "Emergency Priority System",
      description: "Instant route clearing for ambulances, VIP vehicles, and government cars",
      icon: "🚨",
      color: "from-red-500 to-pink-600"
    },
    {
      title: "Real-time Traffic Management",
      description: "Live monitoring and adaptive signal control for maximum efficiency",
      icon: "⚡",
      color: "from-yellow-500 to-orange-600"
    }
  ];

  const futureFeatures = [
    {
      icon: <TruckIcon className="w-8 h-8" />,
      title: "Fleet Management",
      description: "Comprehensive tracking and optimization for delivery and transport fleets"
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: "Emergency Response",
      description: "Automated emergency vehicle detection and priority routing"
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: "Traffic Analytics",
      description: "Advanced analytics and reporting for traffic pattern insights"
    },
    {
      icon: <GlobeAltIcon className="w-8 h-8" />,
      title: "Smart City Integration",
      description: "Seamless integration with smart city infrastructure and IoT devices"
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Citizen App",
      description: "Mobile app for real-time traffic updates and route suggestions"
    },
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: "AI Weather Integration",
      description: "Weather-aware traffic management and predictive routing"
    }
  ];

  return (
    <div className="min-h-screen max-w-screen two fulll overflow-x-hidden overflow-y-auto  bg-[linear-gradient(to_right,_#0f172a,_#0f232a,_#000000,_#1a1a1a,_#0f172a)] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none overflow-x-hidden overflow-y-auto two ">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20 mix-blend-screen"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)",
          }}
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        />

           {watchdemo && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
    <div className="relative w-full h-2/3   max-w-md p-4 rounded-md bg-gray-900 shadow-lg">
      
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 p-2 rounded-full bg-white/70 hover:bg-red-500 text-black hover:text-white transition"
        onClick={() => setwatchdemo(false)}
        aria-label="Close demo"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>

      {/* Video */}
      <video
        src="./videos/demovideo.mp4"
        controls
        autoPlay
        className="w-full h-full rounded-md"
      />
    </div>
  </div>
)}
        
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 p-6"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
              🚦
            </div>
            <div>
              <h1 className="text-2xl font-bold">SirenVeer AI</h1>
              <p className="text-sm text-gray-400">Traffic Intelligence System</p>
            </div>
          </motion.div>
          
          <div className="hidden md:flex space-x-8">
            {['Features', 'About Sirenveer', 'Future Plans', 'Contact'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="hover:text-blue-400 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="inline-flex items-center space-x-2 bg-blue-500/20 rounded-full px-4 py-2 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <SparklesIcon className="w-5 h-5 text-blue-400" />
                <span className="text-sm">AI-Powered Traffic Management</span>
              </motion.div>
              
              <h1 className="text-6xl lg:text-7xl font-bold mb-6">
                Meet{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  SirenVeer
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                The world's most advanced AI traffic officer. SirenVeer combines cutting-edge computer vision, 
                real-time analytics, and intelligent decision-making to revolutionize urban traffic management.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-lg shadow-xl"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={()=>{setforwardlogin(true)}}
                >
                  Get Started
                </motion.button>
                
                <motion.button
                  className="px-8 py-4 border border-gray-600 rounded-xl bg-black font-semibold text-lg hover:bg-gray-800/50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={()=>{setwatchdemo(true)}}
                >
                  Watch Demo
                </motion.button>
              </div>
            </motion.div>

            {/* Right Content - Traffic Analysis Tool */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
                {/* <h3 className="text-2xl font-bold mb-6 text-center">AI Traffic Analysis</h3> */}
                <motion.div ><img className="glow-image" src=".//nobggptpolice.png" alt="sireenveer" width={300} /></motion.div>
                
            
            </motion.div>
          </div>
        </div>
      </section>

      {/* About SirenVeer Section */}
      <section id="about-sirenveer" className="relative z-10 px-6 py-20 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">Meet Your AI Traffic Officer</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              SirenVeer isn't just software—he's a digital guardian of the roads, equipped with advanced AI capabilities and an unwavering commitment to traffic safety.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold mb-4">🎓 Background & Training</h3>
                <p className="text-gray-300 leading-relaxed">
                  Born from years of traffic engineering research and trained on millions of traffic scenarios, 
                  SirenVeer has developed an intuitive understanding of urban flow dynamics. His neural networks 
                  have been shaped by data from major metropolitan areas worldwide.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold mb-4">🧠 Core Capabilities</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Real-time computer vision analysis</li>
                  <li>• Predictive traffic modeling</li>
                  <li>• Multi-modal transportation optimization</li>
                  <li>• Emergency response coordination</li>
                  <li>• Weather-adaptive decision making</li>
                </ul>
              </div>

              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold mb-4">💫 Personality Traits</h3>
                <p className="text-gray-300 leading-relaxed">
                  SirenVeer is methodical yet adaptive, always prioritizing safety while optimizing for efficiency. 
                  He takes pride in his work and considers every successful traffic flow a personal achievement. 
                  His dedication to protecting lives makes him the ideal digital traffic guardian.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
            
                <div className="relative w-96 h-96 mx-auto">
      {/* Background glow animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-30"
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Image container */}
      <div className="absolute inset-16 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {imageCycle[stage] !== "all" ? (
            <motion.img
              key={imageCycle[stage]}
              src={`./${imageCycle[stage]}`}
              className="w-56 h-56 object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            />
          ) : (
            <motion.div
              key="trio"
              className="flex  items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img src="./godude.png" className="w-42h-42 rotate-[-10deg]" />
              <img src="./stopdude.png" className="w-42 h-42 z-10" />
              <img src="./waitdude.png" className="w-42 h-42 rotate-[10deg]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating emojis */}
      {["🚦", "🚨", "⚡", "🛡️"].map((emoji, index) => (
        <motion.div
          key={index}
          className="absolute w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl border border-white/30"
          style={{
            top: `${20 + Math.sin((index * Math.PI) / 2) * 30}%`,
            left: `${20 + Math.cos((index * Math.PI) / 2) * 30}%`,
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 3 + index,
            repeat: Infinity,
            delay: index * 0.5,
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>

              {/* Stats */}
              <motion.div
                className="mt-8 grid grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-green-500/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">99.7%</div>
                  <div className="text-sm text-gray-300">Accuracy Rate</div>
                </div>
                <div className="bg-blue-500/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">24/7</div>
                  <div className="text-sm text-gray-300">Active Monitoring</div>
                </div>
                <div className="bg-purple-500/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">500ms</div>
                  <div className="text-sm text-gray-300">Response Time</div>
                </div>
                <div className="bg-yellow-500/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">50+</div>
                  <div className="text-sm text-gray-300">Cities Deployed</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Current Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">Current Capabilities</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              SirenVeer's current feature set represents the cutting edge of traffic management technology.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group cursor-pointer"
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 h-full hover:border-white/40 transition-all">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Features Section */}
      <section id="future-plans" className="relative z-10 px-6 py-20 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6">The Future of Traffic</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our roadmap includes revolutionary features that will transform how cities manage transportation and emergency response.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {futureFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all group"
              >
                <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                
                <motion.div
                  className="mt-4 text-xs text-blue-400 font-medium"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  Coming Soon →
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Priority Features Highlight */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-r from-red-500/20 to-purple-600/20 rounded-3xl p-8 border border-red-500/30"
          >
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">Emergency Priority System</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Our flagship upcoming feature will revolutionize emergency response with intelligent priority routing.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/30 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  🚑
                </div>
                <h4 className="font-bold mb-2">Ambulance Priority</h4>
                <p className="text-sm text-gray-300">Instant route clearing with 30-second response time</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/30 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  🏛️
                </div>
                <h4 className="font-bold mb-2">Government Vehicles</h4>
                <p className="text-sm text-gray-300">Secure, high-priority routing for official convoys</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/30 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  ⭐
                </div>
                <h4 className="font-bold mb-2">VIP Transport</h4>
                <p className="text-sm text-gray-300">Discrete priority handling for high-profile movements</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6">Ready to Transform Your City?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the future of intelligent traffic management with SirenVeer AI.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-lg shadow-xl"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={()=>{setforwardlogin(true)}}
              
              >
               Get Started
              </motion.button>
              
              <motion.button
                className="px-8 py-4 border border-gray-600 bg-black rounded-xl font-semibold text-lg hover:bg-gray-800/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Demo Video
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-xl">
                🚦
              </div>
              <div>
                <h3 className="font-bold">SirenVeer AI</h3>
                <p className="text-sm text-gray-400">The Future of Traffic Management</p>
              </div>
            </div>
            
            <div className="text-center text-gray-400 text-sm">
              © 2025 SirenVeer AI. All rights reserved. | Powered by Advanced AI Technology
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Aboutpage;


