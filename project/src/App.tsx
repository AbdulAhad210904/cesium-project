import React, { useEffect, useState } from 'react';
import CesiumMap from './components/CesiumMap';
import { useGeoJsonData } from './hooks/useGeoJsonData';
import { checkServerHealth } from './services/api';
import { AlertCircle, MapPin, Server, Wifi } from 'lucide-react';

function App() {
  const { data: geoJsonData, isLoading, error, refetch } = useGeoJsonData();
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const checkServer = async () => {
      const health = await checkServerHealth();
      setServerStatus(health.error ? 'offline' : 'online');
    };

    checkServer();
    const interval = setInterval(checkServer, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="relative w-full h-screen bg-gray-900">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-400" />
            <h1 className="text-white font-semibold text-lg">
              GeoJSON Cesium Viewer
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Server Status */}
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-gray-300" />
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    serverStatus === 'online'
                      ? 'bg-green-400'
                      : serverStatus === 'offline'
                      ? 'bg-red-400'
                      : 'bg-yellow-400'
                  }`}
                />
                <span className="text-white text-sm capitalize">
                  {serverStatus}
                </span>
              </div>
            </div>

            {/* Data Status */}
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-gray-300" />
              <span className="text-white text-sm">
                {geoJsonData ? 'Connected' : 'No Data'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="absolute top-20 left-4 right-4 z-50">
          <div className="bg-red-500/90 text-white p-4 rounded-lg shadow-lg border border-red-400">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Failed to load map data</p>
                <p className="text-sm opacity-90 mt-1">{error}</p>
              </div>
              <button
                onClick={handleRetry}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <CesiumMap 
        geoJsonData={geoJsonData} 
        isLoading={isLoading}
        error={error}
      />

      {/* Footer Info */}
      {geoJsonData && (
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent">
          <div className="p-4">
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center gap-4">
                <span>Points: 3</span>
                <span>Lines: 3</span>
                <span>Region: Punjab, India</span>
              </div>
              <div className="text-xs opacity-70">
                Powered by Cesium & React
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;