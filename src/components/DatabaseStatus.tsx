import React, { useState, useEffect } from 'react';
import { CustomerService } from '../services/customerService';
import { Database, Wifi, WifiOff, AlertCircle } from 'lucide-react';

const DatabaseStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const connected = await CustomerService.testConnection();
      setIsConnected(connected);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Her 30 saniyede bir bağlantıyı kontrol et
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null && !isChecking) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg text-sm font-medium ${
        isConnected 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {isChecking ? (
          <>
            <Database className="w-4 h-4 animate-pulse" />
            <span>Kontrol ediliyor...</span>
          </>
        ) : isConnected ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>Veritabanı Bağlı</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>Çevrimdışı Mod</span>
            <AlertCircle className="w-4 h-4" />
          </>
        )}
      </div>
    </div>
  );
};

export default DatabaseStatus;