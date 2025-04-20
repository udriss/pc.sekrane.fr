import { useState, useEffect } from 'react';
import { ExpandMore as ChevronDown, ExpandLess as ChevronUp } from '@mui/icons-material';

interface Connection {
  deviceInfo: {
    userIp: string;
    userAgent: string;
    language: string;
    screen: string;
    timezone: string;
  };
  timestamp: number;
  id: string;
}

export function ConnectionsList() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  useEffect(() => {
    const storedConnections = localStorage.getItem('connections');
    if (storedConnections) {
      setConnections(JSON.parse(storedConnections));
    }
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Connexions</h2>
      <div className="space-y-2">
        {connections.map((conn) => (
          <div key={conn.id} className="border rounded-lg p-3">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand(conn.id)}
            >
              <div>
                <span className="font-medium">{conn.deviceInfo.userIp}</span>
                <span className="ml-4 text-gray-500">
                  {new Date(conn.timestamp).toLocaleString()}
                </span>
              </div>
              {expandedIds.includes(conn.id) ? <ChevronUp /> : <ChevronDown />}
            </div>
            
            {expandedIds.includes(conn.id) && (
              <div className="mt-2 pl-4 space-y-1 text-sm">
                <p>User Agent: {conn.deviceInfo.userAgent}</p>
                <p>Language: {conn.deviceInfo.language}</p>
                <p>Screen: {conn.deviceInfo.screen}</p>
                <p>Timezone: {conn.deviceInfo.timezone}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}