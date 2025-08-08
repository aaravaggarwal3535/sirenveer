/* eslint-disable react-hooks/exhaustive-deps */



/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { CloudArrowUpIcon, PlayIcon, XMarkIcon, SparklesIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [imageBoxFloating, setImageBoxFloating] = useState(false);
  const [imageBoxFlipped, setImageBoxFlipped] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [contentAnimatingOut, setContentAnimatingOut] = useState(false);
 const [predictionResult, setPredictionResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAnalysisCard, setShowAnalysisCard] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
 const [watchdemo,setwatchdemo] = useState(false)
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [videoCentered, setVideoCentered] = useState(false);
const [uploadedFile, setUploadedFile] = useState(null); // NEW
const navigate = useNavigate();
const [showPredictedVideo, setShowPredictedVideo] = useState(false);
const [predictedVideoEnded, setPredictedVideoEnded] = useState(false);
const[forwardfeatures,setforwardfeatures]= useState(false)
const[forwardfutureplans,setforwardfutureplans]= useState(false)
  useEffect(() => {
    if (forwardfeatures) {
      navigate("/#features");
    }
    setforwardfeatures(false)
  }, [forwardfeatures]);
  useEffect(() => {
    if (forwardfutureplans) {
      navigate("/#future-plans");
    }
    setforwardfutureplans(false)
  }, [forwardfutureplans]);

const handleSubmit = async () => {
  console.log("🚀 handleSubmit called");
  
  if (uploadedImage && uploadedFile) {
    console.log("✅ Validation passed, starting sequence...");
    setContentAnimatingOut(true);
    
    setTimeout(() => {
      console.log("🎬 Starting video sequence...");
      setShowVideo(true);
      setImageBoxFloating(false);
      setImageBoxFlipped(false);
      setVideoProgress(0);
      setVideoCentered(false);
    }, 800);
  } else {
    alert("Please make sure an image is uploaded before starting analysis.");
  }
};


// Auto-trigger API call when blackboard appears

// Extract API logic into separate function
const handleAPICall = async () => {
  if (!uploadedFile) return;
  
  setIsProcessing(true);
  
  try {
    const formData = new FormData();
    formData.append("file", uploadedFile);
    
    console.log("📤 Sending request to API...");
    
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("📊 API Response:", data);
    
    if (data.status === "error") {
      throw new Error(data.error);
    }
    
    setApiResponse(data);
    setPredictionResult(data.prediction);
    setIsProcessing(false);
    
    // After API response, show predicted video fullscreen
    setTimeout(() => {
      setShowPredictedVideo(true);
    }, 1000);
    
  } catch (error) {
    console.error("❌ Error predicting traffic light:", error);
    setIsProcessing(false);
  }
};



const handleImageUpload = (e) => {
  console.log("📁 File upload triggered");
  const file = e.target.files[0];
  console.log("📁 Selected file:", file);
  
  if (file) {
    setUploadedFile(file); // Store file in state
    
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log("📷 Image loaded successfully");
      setUploadedImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  setUploadedImage(null);
  setUploadedFile(null);
};



  const resetAll = () => {
  setUploadedImage(null);
  setUploadedFile(null);
  setShowVideo(false);
  setShowPredictedVideo(false);
  setPredictedVideoEnded(false);
  setContentAnimatingOut(false);
  setImageBoxFloating(false);
  setImageBoxFlipped(false);
  setAnalysisResult(null);
  setVideoProgress(0);
  setVideoCentered(false);
  setPredictionResult("");
  setShowAnalysisCard(false);
  setIsProcessing(false);
  setApiResponse(null);
};

  
  
  useEffect(() => {
    const particleArray = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 1.5,
      speedY: (Math.random() - 0.5) * 1.5,
    }));
    setParticles(particleArray);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  useEffect(() => {
  const preloadVideos = async () => {
    const videoSources = [
      "./walkingdude.webm",
      "./videos/red-light-video.mp4",
      "./videos/yellow-light-video.mp4", 
      "./videos/green-light-video.mp4"
    ];

    console.log("🎬 Starting video preload...");

    videoSources.forEach((src, index) => {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.muted = true;
      
      video.addEventListener('loadeddata', () => {
        console.log(`✅ Video ${index + 1} preloaded: ${src}`);
      });
      
      video.addEventListener('error', (e) => {
        console.error(`❌ Failed to preload video: ${src}`, e);
      });
      
      video.src = src;
    });
  };

  preloadVideos();
}, []);


  // Video control logic - Updated to trigger blackboard transition after video centers
  // useEffect(() => {
  //   let interval;
  //   if (showVideo && videoRef.current) {
  //     const video = videoRef.current;

  //     interval = setInterval(() => {
  //       const currentTime = video.currentTime;

  //       // CASE 1: Before center – loop between 1s and 3s
  //       if (!videoCentered) {
  //         if (currentTime >= 2.5 || currentTime < 1) {
  //           video.currentTime = 1;
  //         }
  //       } else {
  //         // CASE 2: After center – start from 3s onward
  //         if (currentTime < 3.5) {
  //           video.currentTime = 3.5;
  //         }
  //         if (currentTime >= 4) {
  //           video.currentTime = 3.5;
  //         }
  //       }

  //       setVideoProgress(currentTime);

  //       // Trigger blackboard transition IMMEDIATELY when video centers (not after 4s)
  //       if (videoCentered && !imageBoxFloating) {
  //         setImageBoxFloating(true);
  //       }

  //     }, 100);
  //   }

  //   return () => clearInterval(interval);
  // }, [showVideo, videoCentered, imageBoxFloating]);
  // Video control logic - Updated for synchronized timing
useEffect(() => {
  let interval;
  if (showVideo && videoRef.current) {
    const video = videoRef.current;

    interval = setInterval(() => {
      const currentTime = video.currentTime;

      // CASE 1: During video transition to center (0-2.5s for walking)
      if (!videoCentered) {
        if (currentTime >= 3 || currentTime < 1) {
          video.currentTime = 1;
        }
      } else {
        // CASE 2: After video centers - STOP walking animation sooner
        if (currentTime < 3) {
          video.currentTime = 3;
        }
        // SHORTENED: Stop at 3.5s instead of 4s to sync with blackboard
        if (currentTime >= 4.5) {
          video.currentTime = 3.5;
        }
      }

      setVideoProgress(currentTime);

      // Trigger blackboard when video centers (walking should end soon after)
      if (videoCentered && currentTime >= 3.2 && !imageBoxFloating) {
        setImageBoxFloating(true);
      }

    }, 100);
  }

  return () => clearInterval(interval);
}, [showVideo, videoCentered, imageBoxFloating]);


  const getVideoSource = (prediction) => {
    switch (prediction.toLowerCase()) {
      case "red":
        return "./videos//red-light-video.mp4";
      case "yellow":
      case "light_yellow":
        return "./videos/yellow-light-video.mp4";
      case "green":
        return "./videos/green-light-video.mp4";
      default:
        return "./walkingdude.mp4"; // Default video
    }
  };


  const getAnalysisResult = () => {
    if (!apiResponse) return null;

    const statusColors = {
      red: "red",
      yellow: "yellow", 
      light_yellow: "yellow",
      green: "green"
    };

    const recommendations = {
      red: "Traffic light is RED. Vehicles must stop. Monitor for violations and ensure safety.",
      yellow: "Traffic light is YELLOW. Prepare for transition. Exercise caution.",
      light_yellow: "Traffic light is LIGHT YELLOW. Prepare for transition. Exercise caution.", 
      green: "Traffic light is GREEN. Traffic flow is optimal. Maintain current signal timing."
    };

    return {
      status: statusColors[apiResponse.prediction.toLowerCase()] || "unknown",
      confidence: Math.round(apiResponse.confidence * 100),
      prediction: apiResponse.prediction,
      recommendation: recommendations[apiResponse.prediction.toLowerCase()] || "Unable to determine traffic light status. Manual verification required.",
      probabilities: apiResponse.probabilities
    };
  };
useEffect(() => {
  if (imageBoxFloating && !isProcessing && !apiResponse && uploadedFile) {
    console.log("🎯 Blackboard appeared - Auto-triggering API call");
    handleAPICall();
  }
}, [imageBoxFloating, isProcessing, apiResponse, uploadedFile]);

  

  return (
    <div className="min-h-screen fulll bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <motion.div className="absolute inset-0 bg-[linear-gradient(to_right,_#0f172a,_#0f232a,_#000000,_#1a1a1a,_#0f172a)]" />

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


      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white opacity-20"
          style={{
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            x: [particle.x, particle.x + particle.speedX * 200],
            y: [particle.y, particle.y + particle.speedY * 200],
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
      // Predicted Video Fullscreen Component
<AnimatePresence>
  {showPredictedVideo && apiResponse && (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative w-full h-full max-w-4xl max-h-4xl"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <video
          className="w-full h-full object-cover rounded-2xl"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={() => {
            setPredictedVideoEnded(true);
            setTimeout(() => {
              setShowPredictedVideo(false);
              setShowAnalysisCard(true);
            }, 500);
          }}
        >
          <source src={getVideoSource(apiResponse.prediction)} type="video/mp4" />
        </video>
        
        {/* Video overlay with prediction info */}
        <motion.div
          className="absolute bottom-8 left-8 right-8 bg-black/70 backdrop-blur-sm rounded-xl p-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Traffic Light: {apiResponse.prediction.toUpperCase()}
              </h3>
              <p className="text-gray-300">
                Confidence: {Math.round(apiResponse.confidence * 100)}%
              </p>
            </div>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
              apiResponse.prediction.toLowerCase() === 'red' ? 'bg-red-500' :
              apiResponse.prediction.toLowerCase() === 'yellow' || apiResponse.prediction.toLowerCase() === 'light_yellow' ? 'bg-yellow-500' :
              apiResponse.prediction.toLowerCase() === 'green' ? 'bg-green-500' : 'bg-gray-500'
            }`}>
              🚦
            </div>
          </div>
        </motion.div>
        
        {/* Skip button */}
        <motion.button
          className="absolute top-8 right-8 px-4 py-2 bg-slate-500/70 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowPredictedVideo(false);
            setShowAnalysisCard(true);
          }}
        >
          Skip →
        </motion.button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


      {/* Mouse Follower */}
      <motion.div
        className="absolute w-96 h-96 rounded-full pointer-events-none mix-blend-screen"
        style={{
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)",
        }}
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 15 }}
      />

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
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
              🚦
            </div>
            <div>
              <h1 className="text-2xl font-bold">SirenVeer AI</h1>
              <p className="text-sm text-gray-400">Traffic Intelligence System</p>
            </div>
          </motion.div>
          
          <div className="hidden md:flex space-x-8">
            {['Home', 'Features', 'Future Plans', 'Contact'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
onClick={() => {
  if (item.toLowerCase() === "features") {
    setforwardfeatures(true);
  } else if (item.startsWith('future')) {
    setforwardfutureplans(true);
  } else {
    setforwardfeatures(false);
    setforwardfutureplans(false);
  }
}}
                className="hover:text-indigo-400 transition-colors cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start min-h-[80vh]">
          
          {/* Left Side - Hero Content */}
          <AnimatePresence>
            {!showVideo && !showAnalysisCard && (
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: contentAnimatingOut ? -200 : 0, opacity: contentAnimatingOut ? 0 : 1 }}
                exit={{ x: -200, opacity: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="space-y-8"
              >
                <motion.div
                  className="inline-flex items-center space-x-2 bg-indigo-500/20 rounded-full px-4 py-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <SparklesIcon className="w-5 h-5 text-indigo-400" />
                  <span className="text-sm">AI-Powered Traffic Analysis</span>
                </motion.div>

                <div className="space-y-6">
                  <motion.h1
                    className="text-6xl lg:text-7xl font-bold leading-tight"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    Intelligent 
                    <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent block">
                      Traffic Control
                    </span>
                  </motion.h1>

                  <motion.p
                    className="text-xl text-gray-300 leading-relaxed max-w-2xl"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    Upload a traffic image and watch our AI system analyze real-time traffic patterns, 
                    predict optimal signal timing, and provide intelligent recommendations for better traffic flow.
                  </motion.p>
                </div>

                {/* Feature Highlights */}
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {[
                    { icon: "🎯", title: "Real-time Analysis", desc: "Instant traffic pattern recognition" },
                    { icon: "⚡", title: "Smart Predictions", desc: "AI-powered signal optimization" },
                    { icon: "🛡️", title: "Safety First", desc: "Priority emergency vehicle routing" },
                    { icon: "📊", title: "Data Insights", desc: "Comprehensive traffic analytics" }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{feature.icon}</span>
                        <div>
                          <h3 className="font-semibold text-sm">{feature.title}</h3>
                          <p className="text-xs text-gray-400">{feature.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Call to Action */}
                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <motion.button
                    className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-semibold shadow-xl"
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload & Analyze →
                  </motion.button>
                  
                  <motion.button
                    className="px-8 py-4 border border-gray-600 bg-black rounded-xl font-semibold hover:bg-white/5 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={()=>{
                    setwatchdemo(true)
                    }}
                  >
                    Watch Demo
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Side - Upload Area & Video */}
          <motion.div
            className="relative  h-full " 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Upload Container with improved blackboard transition timing */}
           {!showAnalysisCard && <motion.div
              className="relative"
              animate={{
                // Phase 1: Initial rotation when content animates out
                rotateY: contentAnimatingOut && !showVideo ? 90 : 
                         // Phase 2: Stay at 90 degrees during video transition AND until video is fully centered
                         showVideo && !videoCentered ? 90 :
                         showVideo && videoCentered && !imageBoxFloating ? 90 :
                         // Phase 3: Blackboard state - face forward with mirror effect
                         imageBoxFloating ? 0 : 0,
                
                // Position transitions - only move when blackboard activates
                x: contentAnimatingOut && !showVideo ? 200 : 
                   showVideo && imageBoxFloating ? window.innerWidth / 2 - 350 : 0,
                
                y: showVideo && imageBoxFloating ? window.innerHeight / 2 - 250 : 0,
                
                // Scale and opacity changes
                scale: showVideo && imageBoxFloating ? 1.2 : 1,
                opacity: contentAnimatingOut && !showVideo ? 0 : 
                         showVideo && imageBoxFloating ? 0.7 : 1,
              }}
              transition={{ 
                // Different timing for blackboard transition vs initial rotation
                duration: imageBoxFloating ? 2.0 : 0.8,  // Slower blackboard transition
                type: imageBoxFloating ? "spring" : "tween",
                stiffness: imageBoxFloating ? 50 : undefined,  // Slightly slower spring
                damping: imageBoxFloating ? 25 : undefined
              }}
              style={{ 
                transformStyle: 'preserve-3d',
                position: showVideo && imageBoxFloating ? 'fixed' : 'relative',
                zIndex: showVideo && imageBoxFloating ? 60 : 'auto'
              }}
            >
              <div 
                className={`backdrop-blur-xl ${showVideo ? "adjustment":""}   rounded-3xl p-8 shadow-2xl border border-white/20`}
                style={{
                  background: showVideo && imageBoxFloating ? 
                             "rgba(255, 255, 255, 0.08)" : 
                             "rgba(255, 255, 255, 0.1)",
                  backdropFilter: showVideo && imageBoxFloating ? 
                                 "blur(15px)" : 
                                 "blur(20px)",
                  // Mirror effect when in blackboard mode
                  transform: showVideo && imageBoxFloating ? "scaleX(-1)" : "scaleX(1)"
                }}
              >
                <h3 
                  className="text-2xl font-bold text-center mb-8"
                  style={{
                    // Flip text back to readable in mirror mode
                    transform: showVideo && imageBoxFloating ? "scaleX(-1)" : "scaleX(1)"
                  }}
                >
                  Traffic Image Analysis
                </h3>
                
                {/* Upload Zone */}
                {!uploadedImage ? (
                  <motion.div
                    className="border-2 border-dashed border-indigo-400/50 rounded-2xl p-12 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-500/5 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <motion.div
                      initial={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <CloudArrowUpIcon className="w-16 h-16 mx-auto mb-4 text-indigo-400" />
                    </motion.div>
                    <p className="text-xl mb-2">Drop your traffic image here</p>
                    <p className="text-gray-400">or click to browse files</p>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </motion.div>
                ) : (
                  /* Enhanced Image Preview with blackboard functionality */
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                    style={{
                      // Flip content back to readable in mirror mode
                      transform: showVideo && imageBoxFloating ? "scaleX(-1)" : "scaleX(1)"
                    }}
                  >
                    {/* Main container with result box styling */}
                    <motion.div
                      className="w-full bg-white/15  backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/40 overflow-hidden"
                      style={{ 
                        transformStyle: "preserve-3d",
                        backdropFilter: "blur(20px)",
                        background: showVideo && imageBoxFloating ? 
                                   "rgba(255, 255, 255, 0.06)" : 
                                   "rgba(255, 255, 255, 0.12)"
                      }}
                      whileHover={{ scale: showVideo && imageBoxFloating ? 1 : 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* Image container */}
                      <div className="relative overflow-hidden rounded-xl group mb-4">
                        <motion.img
                          src={uploadedImage}
                          alt="Traffic analysis preview"
                          className="w-full h-64 object-cover"
                          style={{
                            opacity: showVideo && imageBoxFloating ? 0.6 : 1,
                            // Double flip to show correct orientation in mirror mode
                            transform: showVideo && imageBoxFloating ? "scaleX(-1)" : "scaleX(1)"
                          }}
                          whileHover={{ scale: showVideo && imageBoxFloating ? 1 : 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        {/* Gradient overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: showVideo && imageBoxFloating ? 0.3 : 1 
                          }}
                        />
                        
                        {/* Enhanced Remove Button - hide in blackboard mode */}
                        {!(showVideo && imageBoxFloating) && (
                          <motion.button
                            className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-all backdrop-blur-sm border border-red-400/50"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={removeImage}
                            style={{ backdropFilter: "blur(10px)" }}
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </motion.button>
                        )}

                        {/* Blackboard mode indicator */}
                        {showVideo && imageBoxFloating && (
                          <div className="absolute top-4 right-4">
                            <motion.div
                              className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-2 text-white text-center border border-white/15"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1 }}
                              // style={{ transform: "scaleX(-1)" }} // Flip text back to readable
                            >
                              <div className="flex items-center space-x-2">
                                <div className="text-lg">🚦</div>
                                <p className="text-sm font-semibold">Traffic Image</p>
                              </div>
                            </motion.div>
                          </div>
                        )}
                      </div>

                      {/* Image info section - modified for blackboard mode */}
                      {!(showVideo && imageBoxFloating) && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-center space-x-3">
                            <div className="w-4 h-4 rounded-full bg-blue-500" />
                            <span className="text-lg font-semibold text-white">Image Ready for Processing</span>
                          </div>
                          
                          <div className="bg-blue-500/30 rounded-lg p-4 border border-blue-400/50">
                            <p className="text-sm text-blue-100 text-center">
                              <strong>Upload Status:</strong><br />
                              Traffic image loaded successfully. Click "Start Analysis" to begin AI processing.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Blackboard mode bottom label */}
                      {showVideo && imageBoxFloating && (
                        <motion.div 
                          className="mt-4 text-center"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.2 }}
                          // style={{ transform: "scaleX(-1)" }} // Flip text back to readable
                        >
                          <h3 className="text-xl font-bold text-white opacity-80">Ready for Analysis</h3>
                          <div className="w-24 h-1 bg-gradient-to-l from-indigo-400 to-purple-500 mx-auto rounded-full mt-2"></div>
                        </motion.div>
                      )}

                      {/* Enhanced Submit Button - hide in blackboard mode */}
                      {!(showVideo && imageBoxFloating) && (
                        <motion.button
                          className="w-full mt-6 py-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center space-x-2 backdrop-blur-sm border border-green-400/30"
                          whileHover={{ 
                            scale: 1.02, 
                            boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)",
                            background: "linear-gradient(to right, rgb(34, 197, 94), rgb(37, 99, 235))"
                          }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSubmit}
                          style={{ backdropFilter: "blur(10px)" }}
                        >
                          <PlayIcon className="w-6 h-6" />
                          <span>Start Analysis</span>
                        </motion.button>
                      )}

                      {/* Enhanced screen effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-2xl pointer-events-none"
                        animate={{ 
                          opacity: showVideo && imageBoxFloating ? [0.2, 0.05, 0.2] : [0.3, 0.1, 0.3]
                        }}
                        transition={{ 
                          duration: showVideo && imageBoxFloating ? 4 : 3, 
                          repeat: Infinity, 
                          ease: "easeInOut" 
                        }}
                      />
                    </motion.div>
                  </motion.div>
                )}

                {/* Additional glass effect for blackboard mode */}
                {showVideo && imageBoxFloating && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)"
                    }}
                  />
                )}
              </div>
            </motion.div>}
          </motion.div>
        </div>

        {/* Video from Left Side */}
        <AnimatePresence>
          {showVideo && (
            <motion.div
              className="fixed inset-0 z-40 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Video Container - SLOWER transition from left to center */}
              <motion.div
                className="relative w-[500px] h-[350px] rounded-3xl shadow-2xl"
                initial={{ x: -window.innerWidth - 500, scale: 0.6 }}
                animate={{ 
                  x: 0, 
                  scale: 1,
                  y: 0
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 40,      // Reduced from 60 for slower movement
                  damping: 30,        // Increased from 25 for smoother deceleration
                  duration: 3       // Increased from 1.2 for much slower transition
                }}
                // Here is where movement from left to center happens - SLOWER NOW
                onAnimationComplete={() => setVideoCentered(true)}
              >
                {/* Video Element */}
                <video
                  ref={videoRef}
                  className="w-full h-full object-fit rounded-3xl"
                  autoPlay
                  muted
                  preload="auto"
                  playsInline
                >
                  <source src="./walkingdude.webm" type="video/webm" />
                  {/* Fallback for video */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center rounded-3xl">
                    <motion.div
                      className="text-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="text-6xl mb-4">🚦</div>
                      <p className="text-xl font-semibold">Traffic Analysis in Progress...</p>
                      <motion.div
                        className="w-32 h-2 bg-white/20 rounded-full mt-4 mx-auto overflow-hidden"
                      >
                        <motion.div
                          className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                          animate={{ width: `${((videoProgress - 1) / 2) * 100}%` }}
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                </video>

           
<AnimatePresence>
  {showAnalysisCard && apiResponse && (
    <motion.div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Analysis card header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                🚦
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Analysis Complete</h2>
                <p className="text-gray-600">Traffic light detection results</p>
              </div>
            </div>
            <motion.button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetAll}
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </motion.button>
          </div>
        </div>
        
        {/* Analysis results content */}
        <div className="p-6">
          {getAnalysisResult() && (
            <div className="space-y-6">
              {/* Main result */}
              <div className="text-center p-6 bg-gray-50 rounded-2xl">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl ${
                  getAnalysisResult().status === 'red' ? 'bg-red-100' :
                  getAnalysisResult().status === 'yellow' ? 'bg-yellow-100' :
                  getAnalysisResult().status === 'green' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  🚦
                </div>
                <h3 className="text-3xl font-bold mb-2 capitalize text-gray-800">
                  {getAnalysisResult().prediction}
                </h3>
                <p className="text-lg text-gray-600">
                  {getAnalysisResult().confidence}% Confidence
                </p>
              </div>
              
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* <div className="bg-blue-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {getAnalysisResult().vehicles}
                  </div>
                  <div className="text-sm text-blue-800">Detected Vehicles</div>
                </div> */}
                <div className="bg-purple-50 p-4 rounded-xl text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {getAnalysisResult().confidence}%
                  </div>
                  <div className="text-sm text-purple-800">Accuracy</div>
                </div>
              </div>
              
              {/* Recommendation */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
                <h4 className="font-semibold text-indigo-800 mb-3 flex items-center">
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Recommendation
                </h4>
                <p className="text-indigo-700">
                  {getAnalysisResult().recommendation}
                </p>
              </div>
              
              {/* Probabilities */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-800 mb-4">Detection Probabilities</h4>
                <div className="space-y-3">
                  {Object.entries(getAnalysisResult().probabilities || {}).map(([className, probability]) => (
                    <div key={className} className="flex items-center justify-between">
                      <span className="capitalize text-gray-700">{className}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${probability * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-800 w-12">
                          {(probability * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer with action button */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-3xl">
          <motion.button
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetAll}
          >
            Analyze Another Image
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


                {/* Reset Button */}
                {/* <motion.button
                  className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetAll}
                >
                  <XMarkIcon className="w-5 h-5" />
                </motion.button> */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      
      {/* Floating geometric shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-10"
        style={{ background: "linear-gradient(45deg, #6366f1, #8b5cf6)" }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-24 h-24 opacity-10"
        style={{ 
          background: "linear-gradient(45deg, #3b82f6, #6366f1)",
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
};

export default Homepage;
