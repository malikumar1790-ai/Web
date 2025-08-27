import React, { useState, useEffect } from 'react';
import { Brain, Zap, Eye, Mic, MessageSquare, BarChart3, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIFeature {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  status: 'active' | 'processing' | 'idle';
  accuracy: number;
  color: string;
}

const EnhancedAIFeatures: React.FC = () => {
  const [features, setFeatures] = useState<AIFeature[]>([
    {
      id: 'nlp',
      name: 'Natural Language Processing',
      icon: MessageSquare,
      description: 'Advanced text understanding and generation',
      status: 'active',
      accuracy: 98.5,
      color: 'blue'
    },
    {
      id: 'computer-vision',
      name: 'Computer Vision',
      icon: Eye,
      description: 'Real-time image and video analysis',
      status: 'active',
      accuracy: 99.2,
      color: 'green'
    },
    {
      id: 'voice-ai',
      name: 'Voice AI',
      icon: Mic,
      description: 'Speech recognition and synthesis',
      status: 'processing',
      accuracy: 97.8,
      color: 'purple'
    },
    {
      id: 'predictive-analytics',
      name: 'Predictive Analytics',
      icon: BarChart3,
      description: 'Data-driven forecasting and insights',
      status: 'active',
      accuracy: 96.3,
      color: 'orange'
    },
    {
      id: 'neural-networks',
      name: 'Neural Networks',
      icon: Brain,
      description: 'Deep learning model optimization',
      status: 'active',
      accuracy: 99.7,
      color: 'red'
    },
    {
      id: 'security-ai',
      name: 'AI Security',
      icon: Shield,
      description: 'Threat detection and prevention',
      status: 'idle',
      accuracy: 99.9,
      color: 'cyan'
    }
  ]);

  const [globalStats, setGlobalStats] = useState({
    totalProcessed: 0,
    activeModels: 0,
    averageAccuracy: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setFeatures(prev => prev.map(feature => ({
        ...feature,
        accuracy: Math.min(99.9, feature.accuracy + (Math.random() - 0.5) * 0.1)
      })));

      setGlobalStats(prev => ({
        totalProcessed: prev.totalProcessed + Math.floor(Math.random() * 100),
        activeModels: features.filter(f => f.status === 'active').length,
        averageAccuracy: features.reduce((acc, f) => acc + f.accuracy, 0) / features.length
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [features]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'idle': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getFeatureColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
      cyan: 'from-cyan-500 to-cyan-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-3xl border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI System Status</h3>
            <p className="text-gray-400 text-sm">Real-time AI performance monitoring</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">All Systems Operational</span>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{globalStats.totalProcessed.toLocaleString()}</div>
          <div className="text-xs text-gray-400">Requests Processed</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{globalStats.activeModels}</div>
          <div className="text-xs text-gray-400">Active Models</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{globalStats.averageAccuracy.toFixed(1)}%</div>
          <div className="text-xs text-gray-400">Avg Accuracy</div>
        </div>
      </div>

      {/* AI Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${getFeatureColor(feature.color)} rounded-lg flex items-center justify-center`}>
                <feature.icon className="h-5 w-5 text-white" />
              </div>
              <div className={`flex items-center space-x-1 ${getStatusColor(feature.status)}`}>
                <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                <span className="text-xs font-medium capitalize">{feature.status}</span>
              </div>
            </div>
            
            <h4 className="text-white font-semibold mb-2 text-sm">{feature.name}</h4>
            <p className="text-gray-400 text-xs mb-3">{feature.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Accuracy</span>
              <span className="text-sm font-bold text-white">{feature.accuracy.toFixed(1)}%</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
              <div 
                className={`bg-gradient-to-r ${getFeatureColor(feature.color)} h-1.5 rounded-full transition-all duration-500`}
                style={{ width: `${feature.accuracy}%` }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Real-time Activity Feed */}
      <div className="mt-6 bg-gray-800/30 rounded-xl p-4">
        <h4 className="text-white font-semibold mb-3 flex items-center">
          <Zap className="h-4 w-4 text-yellow-400 mr-2" />
          Live Activity Feed
        </h4>
        <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600">
          {[
            'Neural network processed 1,247 image classifications',
            'Voice AI handled 89 speech-to-text conversions',
            'NLP model analyzed 2,156 text documents',
            'Predictive analytics generated 45 forecasts',
            'Computer vision detected 312 objects in real-time'
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300">{activity}</span>
              <span className="text-gray-500 ml-auto">now</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedAIFeatures;