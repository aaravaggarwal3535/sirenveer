/* eslint-disable no-unused-vars */
// EmergencyRoutePage.js
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPinIcon, 
  TruckIcon, 
  ClockIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  CameraIcon,
  CloudArrowUpIcon,
  PlayIcon,
  XMarkIcon,
  SparklesIcon,
  ArrowPathIcon,
  SignalIcon,
  PhoneIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const EmergencyRoutePage = () => {
  // Core state management
  const [currentStep, setCurrentStep] = useState('selection'); // selection, analysis, routing, complete
  const [selectedFromHospital, setSelectedFromHospital] = useState(null);
  const [selectedToHospital, setSelectedToHospital] = useState(null);
  const [emergencyType, setEmergencyType] = useState('ambulance');
  const [patientInfo, setPatientInfo] = useState({ name: '', age: '', condition: '' });
  
  // Traffic analysis states
  const [trafficImages, setTrafficImages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [trafficData, setTrafficData] = useState({});
  const [currentAnalysisPoint, setCurrentAnalysisPoint] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  // Route execution states
  const [routeStatus, setRouteStatus] = useState('planning');
  const [routeProgress, setRouteProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [currentIntersection, setCurrentIntersection] = useState(null);
  const [emergencyOverrides, setEmergencyOverrides] = useState([]);
  
  // UI states
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [showEmergencyPanel, setShowEmergencyPanel] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const fileInputRef = useRef(null);
  const mapRef = useRef(null);

  // Hospital and route data
  const hospitals = {
    max: {
      id: 'max',
      name: 'Max Super Speciality Hospital',
      location: 'Saket, New Delhi',
      position: { x: 150, y: 200 },
      icon: '🏥',
      color: 'from-blue-500 to-blue-600',
      specialities: ['Cardiology', 'Neurology', 'Emergency'],
      contact: '+91-11-2651-5050'
    },
    apollo: {
      id: 'apollo',
      name: 'Apollo Hospital',
      location: 'Indraprastha, New Delhi',
      position: { x: 700, y: 400 },
      icon: '🏥',
      color: 'from-green-500 to-green-600',
      specialities: ['Oncology', 'Transplant', 'Critical Care'],
      contact: '+91-11-2692-5801'
    },
    aiims: {
      id: 'aiims',
      name: 'AIIMS Hospital',
      location: 'Ansari Nagar, New Delhi',
      position: { x: 400, y: 120 },
      icon: '🏥',
      color: 'from-purple-500 to-purple-600',
      specialities: ['General Medicine', 'Surgery', 'Trauma'],
      contact: '+91-11-2658-8500'
    },
    fortis: {
      id: 'fortis',
      name: 'Fortis Hospital',
      location: 'Shalimar Bagh, New Delhi',
      position: { x: 600, y: 300 },
      icon: '🏥',
      color: 'from-red-500 to-red-600',
      specialities: ['Orthopedics', 'Cardiology', 'Pediatrics'],
      contact: '+91-11-4713-3333'
    }
  };

  // Traffic intersection points
  const trafficPoints = {
    point1: {
      id: 'point1',
      name: 'ITO Junction',
      position: { x: 300, y: 250 },
      status: 'analyzing',
      cameras: 4,
      avgWaitTime: 45
    },
    point2: {
      id: 'point2',
      name: 'Lajpat Nagar Cross',
      position: { x: 500, y: 220 },
      status: 'analyzing',
      cameras: 3,
      avgWaitTime: 35
    },
    point3: {
      id: 'point3',
      name: 'AIIMS Flyover',
      position: { x: 450, y: 350 },
      status: 'analyzing',
      cameras: 2,
      avgWaitTime: 25
    },
    point4: {
      id: 'point4',
      name: 'Ring Road Junction',
      position: { x: 650, y: 380 },
      status: 'analyzing',
      cameras: 5,
      avgWaitTime: 55
    }
  };

  // Emergency vehicle types
  const emergencyVehicles = {
    ambulance: {
      id: 'ambulance',
      name: 'Ambulance',
      icon: '🚑',
      priority: 'critical',
      color: 'from-red-500 to-red-600',
      signalOverride: true,
      description: 'Life-saving emergency transport'
    },
    fire: {
      id: 'fire',
      name: 'Fire Engine',
      icon: '🚒',
      priority: 'critical',
      color: 'from-orange-500 to-red-600',
      signalOverride: true,
      description: 'Fire emergency response'
    },
    police: {
      id: 'police',
      name: 'Police Vehicle',
      icon: '🚓',
      priority: 'high',
      color: 'from-blue-500 to-indigo-600',
      signalOverride: true,
      description: 'Law enforcement emergency'
    }
  };

  // Mock traffic analysis function
  const analyzeTrafficImage = async (imageFile, pointId) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const predictions = ['red', 'yellow', 'green'];
    const prediction = predictions[Math.floor(Math.random() * predictions.length)];
    const confidence = 0.75 + Math.random() * 0.25;
    
    return {
      pointId,
      prediction,
      confidence,
      probabilities: {
        red: prediction === 'red' ? confidence : Math.random() * 0.4,
        yellow: prediction === 'yellow' ? confidence : Math.random() * 0.4,
        green: prediction === 'green' ? confidence : Math.random() * 0.4
      },
      timestamp: new Date().toISOString(),
      waitTime: prediction === 'red' ? 40 + Math.random() * 20 : 
                prediction === 'yellow' ? 15 + Math.random() * 10 : 0
    };
  };

  // Handle image uploads
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageObjects = files.map((file, index) => ({
      id: `img_${Date.now()}_${index}`,
      file,
      url: URL.createObjectURL(file),
      pointId: Object.keys(trafficPoints)[index % Object.keys(trafficPoints).length],
      status: 'pending'
    }));
    
    setTrafficImages(prev => [...prev, ...imageObjects]);
    addNotification('Traffic images uploaded successfully', 'success');
  };

  // Start route analysis
  const startRouteAnalysis = async () => {
    if (!selectedFromHospital || !selectedToHospital) {
      addNotification('Please select both hospitals', 'error');
      return;
    }

    setCurrentStep('analysis');
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate traffic analysis for each point
    const analysisPromises = Object.keys(trafficPoints).map(async (pointId, index) => {
      setCurrentAnalysisPoint(pointId);
      
      // Find corresponding image or use mock data
      const imageForPoint = trafficImages.find(img => img.pointId === pointId);
      const mockFile = imageForPoint?.file || new File([''], 'mock.jpg');
      
      const result = await analyzeTrafficImage(mockFile, pointId);
      
      setAnalysisProgress(((index + 1) / Object.keys(trafficPoints).length) * 100);
      
      return result;
    });

    const results = await Promise.all(analysisPromises);
    
    // Process results
    const newTrafficData = {};
    results.forEach(result => {
      newTrafficData[result.pointId] = {
        ...trafficPoints[result.pointId],
        ...result,
        status: result.prediction
      };
    });

    setTrafficData(newTrafficData);
    setIsAnalyzing(false);
    setCurrentAnalysisPoint(null);
    
    // Calculate route
    setTimeout(() => {
      calculateOptimalRoute(newTrafficData);
    }, 1000);
  };

  // Calculate optimal route
  const calculateOptimalRoute = (trafficData) => {
    setCurrentStep('routing');
    setRouteStatus('calculating');
    
    let totalDelay = 0;
    let overrides = 0;
    
    Object.values(trafficData).forEach(point => {
      if (point.prediction === 'red') {
        if (emergencyVehicles[emergencyType].signalOverride) {
          overrides++;
          totalDelay += 5; // Override delay
        } else {
          totalDelay += point.waitTime || 40;
        }
      } else if (point.prediction === 'yellow') {
        totalDelay += 10;
      }
    });

    const baseTime = 18; // Base route time in minutes
    const optimizedTime = Math.max(8, baseTime - (overrides * 2) + Math.floor(totalDelay / 60));
    
    setEstimatedTime(optimizedTime);
    setEmergencyOverrides(Array(overrides).fill().map((_, i) => `Override ${i + 1}`));
    
    setTimeout(() => {
      setRouteStatus('ready');
      setCurrentStep('complete');
      addNotification(`Route optimized! ETA: ${optimizedTime} minutes`, 'success');
    }, 2000);
  };

  // Execute emergency route
  const executeRoute = () => {
    setRouteStatus('active');
    setShowEmergencyPanel(true);
    
    // Simulate route execution
    const interval = setInterval(() => {
      setRouteProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRouteStatus('completed');
          addNotification('Route completed successfully!', 'success');
          return 100;
        }
        return prev + 2;
      });
    }, 200);
  };

  // Add notification
  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    
    setNotifications(prev => [...prev, notification]);
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Reset all states
  const resetRoute = () => {
    setCurrentStep('selection');
    setSelectedFromHospital(null);
    setSelectedToHospital(null);
    setTrafficImages([]);
    setTrafficData({});
    setRouteStatus('planning');
    setRouteProgress(0);
    setEstimatedTime(0);
    setEmergencyOverrides([]);
    setShowRouteDetails(false);
    setShowEmergencyPanel(false);
    addNotification('Route reset successfully', 'info');
  };

  // Get traffic light color
  const getTrafficColor = (status) => {
    switch (status) {
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 p-6 border-b border-white/20 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center text-3xl">
              🚑
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Emergency Route Optimizer
              </h1>
              <p className="text-blue-200/80">AI-Powered Hospital Navigation & Traffic Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.div className="text-right">
              <div className="text-sm text-blue-200/60">Emergency Hotline</div>
              <div className="text-lg font-bold text-red-400">102 | 108</div>
            </motion.div>
            
            <motion.button
              className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetRoute}
            >
              Reset Route
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Notifications */}
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -50, x: 50 }}
            className={`fixed top-24 right-6 z-50 px-4 py-3 rounded-xl shadow-lg backdrop-blur-xl border ${
              notification.type === 'success' ? 'bg-green-500/20 border-green-400/30 text-green-100' :
              notification.type === 'error' ? 'bg-red-500/20 border-red-400/30 text-red-100' :
              'bg-blue-500/20 border-blue-400/30 text-blue-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              {notification.type === 'success' && <CheckCircleIcon className="w-5 h-5" />}
              {notification.type === 'error' && <ExclamationTriangleIcon className="w-5 h-5" />}
              {notification.type === 'info' && <SparklesIcon className="w-5 h-5" />}
              <span className="font-medium">{notification.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { step: 'selection', label: 'Hospital Selection', icon: MapPinIcon },
              { step: 'analysis', label: 'Traffic Analysis', icon: CameraIcon },
              { step: 'routing', label: 'Route Planning', icon: ArrowPathIcon },
              { step: 'complete', label: 'Ready to Go', icon: CheckCircleIcon }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    currentStep === item.step ? 'bg-blue-500 border-blue-400 text-white' :
                    ['selection', 'analysis', 'routing', 'complete'].indexOf(currentStep) > index 
                      ? 'bg-green-500 border-green-400 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
                <div className="ml-2 mr-6">
                  <div className="text-sm font-medium">{item.label}</div>
                </div>
                {index < 3 && (
                  <div className={`w-8 h-0.5 ${
                    ['selection', 'analysis', 'routing', 'complete'].indexOf(currentStep) > index 
                      ? 'bg-green-400' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            
            {/* Hospital Selection */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <MapPinIcon className="w-6 h-6 mr-3 text-blue-400" />
                Route Selection
              </h2>
              
              {/* Emergency Vehicle Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Emergency Vehicle:</label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(emergencyVehicles).map(([key, vehicle]) => (
                    <motion.button
                      key={key}
                      className={`p-3 rounded-lg border border-white/20 transition-all text-center ${
                        emergencyType === key ? 'bg-blue-500/20 border-blue-400' : 'bg-white/5 hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setEmergencyType(key)}
                    >
                      <div className="text-2xl mb-1">{vehicle.icon}</div>
                      <div className="text-xs font-medium">{vehicle.name}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* From Hospital */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">From Hospital:</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(hospitals).map(([key, hospital]) => (
                    <motion.button
                      key={key}
                      className={`p-4 rounded-xl border border-white/20 transition-all text-left ${
                        selectedFromHospital === key ? 'bg-blue-500/20 border-blue-400' : 'bg-white/5 hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedFromHospital(key)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{hospital.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold">{hospital.name}</div>
                          <div className="text-xs text-gray-400">{hospital.location}</div>
                          <div className="text-xs text-blue-300 mt-1">
                            {hospital.specialities.slice(0, 2).join(', ')}
                          </div>
                        </div>
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <TruckIcon className="w-8 h-8 text-blue-400 transform rotate-90" />
              </div>

              {/* To Hospital */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">To Hospital:</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(hospitals).filter(([key]) => key !== selectedFromHospital).map(([key, hospital]) => (
                    <motion.button
                      key={key}
                      className={`p-4 rounded-xl border border-white/20 transition-all text-left ${
                        selectedToHospital === key ? 'bg-green-500/20 border-green-400' : 'bg-white/5 hover:bg-white/10'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedToHospital(key)}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{hospital.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold">{hospital.name}</div>
                          <div className="text-xs text-gray-400">{hospital.location}</div>
                          <div className="text-xs text-green-300 mt-1">
                            {hospital.specialities.slice(0, 2).join(', ')}
                          </div>
                        </div>
                        <PhoneIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Patient Information */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3">Patient Information (Optional):</label>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Patient Name"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:border-blue-400 focus:outline-none"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Age"
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:border-blue-400 focus:outline-none"
                      value={patientInfo.age}
                      onChange={(e) => setPatientInfo(prev => ({ ...prev, age: e.target.value }))}
                    />
                    <input
                      type="text"
                      placeholder="Condition"
                      className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:border-blue-400 focus:outline-none"
                      value={patientInfo.condition}
                      onChange={(e) => setPatientInfo(prev => ({ ...prev, condition: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Traffic Images Upload */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <CameraIcon className="w-5 h-5 mr-2 text-green-400" />
                Traffic Images
              </h3>
              
              <motion.div
                className="border-2 border-dashed border-green-400/50 rounded-xl p-6 text-center cursor-pointer hover:border-green-400 hover:bg-green-500/5 transition-all"
                whileHover={{ scale: 1.02 }}
                onClick={() => fileInputRef.current?.click()}
              >
                <CloudArrowUpIcon className="w-12 h-12 mx-auto mb-3 text-green-400" />
                <p className="font-medium mb-2">Upload Traffic Images</p>
                <p className="text-sm text-gray-400">Multiple images from route intersections</p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </motion.div>

              {trafficImages.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-medium">Uploaded Images ({trafficImages.length}):</div>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                    {trafficImages.map((img) => (
                      <div key={img.id} className="relative">
                        <img
                          src={img.url}
                          alt="Traffic"
                          className="w-full h-16 object-cover rounded-lg"
                        />
                        <div className="absolute top-1 right-1 bg-black/60 text-xs px-1 rounded">
                          {trafficPoints[img.pointId]?.name.slice(0, 8)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Action Button */}
            <motion.button
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold text-lg shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={startRouteAnalysis}
              disabled={!selectedFromHospital || !selectedToHospital || isAnalyzing}
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center space-x-2">
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  <span>Analyzing Traffic...</span>
                </div>
              ) : currentStep === 'complete' ? (
                <div className="flex items-center justify-center space-x-2">
                  <PlayIcon className="w-5 h-5" />
                  <span>Execute Route</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <SignalIcon className="w-5 h-5" />
                  <span>Analyze & Plan Route</span>
                </div>
              )}
            </motion.button>
          </div>

          {/* Center Panel - Map Visualization */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 h-[700px] relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Route Map</h2>
                <div className="flex items-center space-x-4">
                  {estimatedTime > 0 && (
                    <div className="flex items-center space-x-2 bg-green-500/20 px-3 py-1 rounded-full">
                      <ClockIcon className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-medium">ETA: {estimatedTime} min</span>
                    </div>
                  )}
                  {emergencyOverrides.length > 0 && (
                    <div className="flex items-center space-x-2 bg-orange-500/20 px-3 py-1 rounded-full">
                      <ExclamationTriangleIcon className="w-4 h-4 text-orange-400" />
                      <span className="text-sm font-medium">{emergencyOverrides.length} Overrides</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div ref={mapRef} className="w-full h-full bg-gradient-to-br from-gray-900/50 to-blue-900/30 rounded-xl relative border border-white/10">
                {/* Hospitals */}
                {Object.entries(hospitals).map(([key, hospital]) => (
                  <motion.div
                    key={key}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: hospital.position.x,
                      top: hospital.position.y
                    }}
                    whileHover={{ scale: 1.1 }}
                    animate={{
                      scale: selectedFromHospital === key || selectedToHospital === key ? 1.1 : 1,
                    }}
                  >
                    <div className={`w-20 h-20 bg-gradient-to-r ${hospital.color} rounded-full flex items-center justify-center text-3xl border-4 ${
                      selectedFromHospital === key ? 'border-blue-400 shadow-blue-400/50' :
                      selectedToHospital === key ? 'border-green-400 shadow-green-400/50' :
                      'border-white'
                    } shadow-xl`}>
                      {hospital.icon}
                    </div>
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black/80 px-3 py-1 rounded-lg text-xs text-center whitespace-nowrap">
                      <div className="font-semibold">{hospital.name.split(' ')[0]} {hospital.name.split(' ')[1]}</div>
                      <div className="text-gray-400">{hospital.location.split(',')[0]}</div>
                    </div>
                  </motion.div>
                ))}

                {/* Traffic Points */}
                {Object.entries(trafficPoints).map(([key, point]) => {
                  const trafficInfo = trafficData[key];
                  return (
                    <motion.div
                      key={key}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: point.position.x,
                        top: point.position.y
                      }}
                      whileHover={{ scale: 1.1 }}
                      animate={{
                        scale: currentAnalysisPoint === key ? 1.2 : 1,
                      }}
                    >
                      <div className={`w-16 h-16 ${
                        trafficInfo ? getTrafficColor(trafficInfo.status) : 'bg-gray-500'
                      } rounded-full flex items-center justify-center text-white font-bold border-4 border-white shadow-xl relative`}>
                        🚦
                        {currentAnalysisPoint === key && (
                          <motion.div
                            className="absolute inset-0 border-4 border-yellow-400 rounded-full"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </div>
                      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs whitespace-nowrap text-center">
                        <div className="font-medium">{point.name}</div>
                        {trafficInfo && (
                          <div className="text-gray-300">
                            {trafficInfo.prediction?.toUpperCase()} - {Math.round(trafficInfo.confidence * 100)}%
                          </div>
                        )}
                        {isAnalyzing && currentAnalysisPoint === key && (
                          <div className="text-yellow-400 animate-pulse">Analyzing...</div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Route Path */}
                {selectedFromHospital && selectedToHospital && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                      <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                        <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8"/>
                      </linearGradient>
                    </defs>
                    <motion.path
                      d={`M ${hospitals[selectedFromHospital].position.x},${hospitals[selectedFromHospital].position.y} 
                          ${Object.values(trafficPoints).map(point => `L ${point.position.x},${point.position.y}`).join(' ')}
                          L ${hospitals[selectedToHospital].position.x},${hospitals[selectedToHospital].position.y}`}
                      stroke="url(#routeGradient)"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray="15,10"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ 
                        pathLength: currentStep === 'complete' ? 1 : 0.5, 
                        opacity: 1,
                        strokeDashoffset: routeStatus === 'active' ? [0, -25] : 0
                      }}
                      transition={{ 
                        pathLength: { duration: 2, ease: "easeInOut" },
                        strokeDashoffset: { duration: 2, repeat: Infinity, ease: "linear" }
                      }}
                    />
                  </svg>
                )}

                {/* Analysis Progress Overlay */}
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-xl"
                  >
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center">
                      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <h3 className="text-xl font-bold mb-2">Analyzing Traffic Patterns</h3>
                      <p className="text-gray-300 mb-4">Processing real-time intersection data...</p>
                      <div className="w-64 bg-gray-700 rounded-full h-3 mb-2">
                        <motion.div
                          className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${analysisProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="text-sm text-gray-400">{Math.round(analysisProgress)}% Complete</div>
                    </div>
                  </motion.div>
                )}

                {/* Route Execution Overlay */}
                {routeStatus === 'active' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-4 left-4 right-4 bg-red-500/20 backdrop-blur-xl rounded-xl p-4 border border-red-400/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                        <h3 className="text-lg font-bold text-red-300">EMERGENCY ROUTE ACTIVE</h3>
                      </div>
                      <div className="text-sm font-medium text-red-300">
                        {Math.round(routeProgress)}% Complete
                      </div>
                    </div>
                    <div className="w-full bg-red-900/50 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-red-400 to-orange-400 h-2 rounded-full"
                        style={{ width: `${routeProgress}%` }}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Traffic Analysis Results */}
            {Object.keys(trafficData).length > 0 && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center">
                    <SparklesIcon className="w-5 h-5 mr-2 text-yellow-400" />
                    Traffic Analysis Results
                  </h3>
                  <motion.button
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center space-x-1"
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowRouteDetails(!showRouteDetails)}
                  >
                    <DocumentTextIcon className="w-4 h-4" />
                    <span>View Details</span>
                  </motion.button>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(trafficData).map(([pointId, traffic]) => (
                    <motion.div
                      key={pointId}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sm">{traffic.name}</h4>
                        <div className={`w-4 h-4 ${getTrafficColor(traffic.status)} rounded-full`}></div>
                      </div>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className={`font-semibold capitalize ${
                            traffic.status === 'red' ? 'text-red-400' :
                            traffic.status === 'yellow' ? 'text-yellow-400' :
                            'text-green-400'
                          }`}>
                            {traffic.prediction}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Confidence:</span>
                          <span className="font-semibold">{Math.round(traffic.confidence * 100)}%</span>
                        </div>
                        {traffic.waitTime && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Wait Time:</span>
                            <span className="font-semibold">{Math.round(traffic.waitTime)}s</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Route Summary */}
                {currentStep === 'complete' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-6 p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl border border-green-400/30"
                  >
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{estimatedTime} min</div>
                        <div className="text-sm text-gray-300">Estimated Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{emergencyOverrides.length}</div>
                        <div className="text-sm text-gray-300">Signal Overrides</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{Object.keys(trafficData).length}</div>
                        <div className="text-sm text-gray-300">Intersections</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <motion.button
                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl font-bold shadow-xl"
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={executeRoute}
                        disabled={routeStatus === 'active'}
                      >
                        {routeStatus === 'active' ? 'Route In Progress...' : 'Execute Emergency Route'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Panel */}
      <AnimatePresence>
        {showEmergencyPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-gradient-to-br from-red-900/50 to-orange-900/50 backdrop-blur-xl rounded-3xl p-8 border border-red-400/30 max-w-2xl w-full"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  🚨
                </div>
                <h2 className="text-3xl font-bold text-red-300 mb-2">EMERGENCY ROUTE ACTIVE</h2>
                <p className="text-red-200/80">Real-time navigation in progress</p>
              </div>

              <div className="space-y-6">
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-red-300 font-medium">Route Progress</span>
                    <span className="text-red-300 font-bold">{Math.round(routeProgress)}%</span>
                  </div>
                  <div className="w-full bg-red-900/50 rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-red-400 to-orange-400 h-3 rounded-full"
                      style={{ width: `${routeProgress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-orange-400">{estimatedTime}</div>
                    <div className="text-sm text-orange-300">Minutes ETA</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{emergencyOverrides.length}</div>
                    <div className="text-sm text-yellow-300">Overrides Used</div>
                  </div>
                </div>

                {routeStatus === 'completed' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-500/20 rounded-xl p-4 text-center border border-green-400/30"
                  >
                    <CheckCircleIcon className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <h3 className="text-xl font-bold text-green-300 mb-1">Route Completed!</h3>
                    <p className="text-green-200/80">Emergency vehicle has reached destination</p>
                  </motion.div>
                )}

                <div className="flex justify-center space-x-4">
                  <motion.button
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-xl font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEmergencyPanel(false)}
                  >
                    Minimize
                  </motion.button>
                  {routeStatus === 'completed' && (
                    <motion.button
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setShowEmergencyPanel(false);
                        resetRoute();
                      }}
                    >
                      New Route
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmergencyRoutePage;
