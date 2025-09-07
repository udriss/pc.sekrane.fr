import { useState, useEffect } from 'react';
import { ExpandMore as ChevronDown, ExpandLess as ChevronUp } from '@mui/icons-material';

interface ConnectionLog {
  id: string;
  ip: string;
  timestamp: string;
  endpoint: string;
  method: string;
  userAgent: string;
  language: string;
  screen: string;
  timezone: string;
}

interface GroupedConnection {
  ip: string;
  count: number;
  logs: ConnectionLog[];
}

export function ConnectionsList() {
  const [groupedConnections, setGroupedConnections] = useState<GroupedConnection[]>([]);
  const [expandedIps, setExpandedIps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await fetch('/api/connection-logs');
      if (response.ok) {
        const data = await response.json();
        setGroupedConnections(data.groupedConnections);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (ip: string) => {
    setExpandedIps(prev => 
      prev.includes(ip) ? prev.filter(i => i !== ip) : [...prev, ip]
    );
  };

  if (loading) {
    return <div className="p-4">Chargement des connexions...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Connexions</h2>
      <div className="space-y-2">
        {groupedConnections.map((group) => (
          <div key={group.ip} className="border rounded-lg p-3">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand(group.ip)}
            >
              <div>
                <span className="font-medium">{group.ip}</span>
                <span className="ml-4 text-gray-500">
                  {group.count} requête{group.count > 1 ? 's' : ''}
                </span>
              </div>
              {expandedIps.includes(group.ip) ? <ChevronUp /> : <ChevronDown />}
            </div>
            
            {expandedIps.includes(group.ip) && (
              <div className="mt-2 pl-4 space-y-2">
                {group.logs.map((log) => (
                  <div key={log.id} className="border-l-2 border-gray-300 pl-3 text-sm">
                    <p><strong>Endpoint:</strong> {log.endpoint} ({log.method})</p>
                    <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                    <p><strong>User Agent:</strong> {log.userAgent}</p>
                    <p><strong>Language:</strong> {log.language}</p>
                    <p><strong>Screen:</strong> {log.screen}</p>
                    <p><strong>Timezone:</strong> {log.timezone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}