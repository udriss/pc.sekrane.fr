import { useMemo, useState, useEffect } from 'react';
import { ExpandMore as ChevronDown, ExpandLess as ChevronUp } from '@mui/icons-material';
import { TextField, Chip, IconButton, Tooltip, Checkbox, FormControlLabel } from '@mui/material';

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
  const [excludeIps, setExcludeIps] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('connections.excludeIps') || '';
  });
  const [hideBots, setHideBots] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('connections.hideBots') === 'false' ? false : true;
  });

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

  const excludedSet = useMemo(() => {
    return new Set(
      excludeIps
        .split(/[\s,;]+/)
        .map(s => s.trim())
        .filter(Boolean)
    );
  }, [excludeIps]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('connections.excludeIps', excludeIps);
      localStorage.setItem('connections.hideBots', String(hideBots));
    }
  }, [excludeIps, hideBots]);

  const filtered = useMemo(() => {
    return groupedConnections.filter(g => {
      if (excludedSet.has(g.ip)) return false;
      if (!hideBots) return true;
      // simple bot heuristic: userAgent includes 'bot' on most entries
      const uaSet = new Set(g.logs.map(l => (l.userAgent || '').toLowerCase()));
      const allBot = uaSet.size > 0 && Array.from(uaSet).every(ua => ua.includes('bot'));
      return !allBot;
    });
  }, [groupedConnections, excludedSet, hideBots]);

  const summarizeUA = (logs: ConnectionLog[]) => {
    const uas = Array.from(new Set(logs.map(l => l.userAgent).filter(Boolean)));
    return uas.join(' | ');
  };

  const summarizeLang = (logs: ConnectionLog[]) => {
    const langs = Array.from(new Set(logs.map(l => l.language).filter(Boolean)));
    return langs.join(', ');
  };

  const groupByPage = (logs: ConnectionLog[]) => {
    const map = new Map<string, { count: number; lastAt: string }>();
    for (const l of logs) {
      const key = l.endpoint || '';
      const entry = map.get(key) || { count: 0, lastAt: l.timestamp };
      entry.count += 1;
      if (new Date(l.timestamp) > new Date(entry.lastAt)) entry.lastAt = l.timestamp;
      map.set(key, entry);
    }
    return Array.from(map.entries())
      .map(([page, info]) => ({ page, count: info.count, lastAt: info.lastAt }))
      .sort((a, b) => b.count - a.count);
  };

  if (loading) {
    return <div className="p-4">Chargement des connexions...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Connexions</h2>
      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <TextField
          label="Exclure IP (séparées par virgule/espaces)"
          size="small"
          value={excludeIps}
          onChange={(e) => setExcludeIps(e.target.value)}
        />
        <FormControlLabel
          control={<Checkbox checked={hideBots} onChange={(e) => setHideBots(e.target.checked)} />}
          label="Masquer les bots"
        />
      </div>
      <div className="space-y-2">
        {filtered.map((group) => (
          <div key={group.ip} className="border rounded-lg p-3">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleExpand(group.ip)}
            >
              <div>
                <span className="font-medium">{group.ip}</span>
                <span className="ml-4 text-gray-500">{group.count} req</span>
                <div className="text-xs text-gray-500 mt-1">
                  <span>UA: {summarizeUA(group.logs) || '—'}</span>
                  <span className="ml-2">Lang: {summarizeLang(group.logs) || '—'}</span>
                </div>
              </div>
              {expandedIps.includes(group.ip) ? <ChevronUp /> : <ChevronDown />}
            </div>
            
            {expandedIps.includes(group.ip) && (
              <div className="mt-2 pl-4 space-y-2">
                {/* Group by originating page (endpoint now stores x-page) */}
                {groupByPage(group.logs).map((p) => (
                  <div key={p.page} className="border-l-2 border-gray-300 pl-3 text-sm">
                    <p><strong>Page:</strong> {p.page || '(inconnue)'} — <strong>{p.count}</strong> req</p>
                    <p className="text-xs text-gray-500">Dernière: {new Date(p.lastAt).toLocaleString()}</p>
                    {/* Show one example log with screen/timezone if available */}
                    {(() => {
                      const example = group.logs.find(l => l.endpoint === p.page) || group.logs[0];
                      return (
                        <p className="text-xs mt-1">
                          Screen: {example?.screen || '—'} | TZ: {example?.timezone || '—'}
                        </p>
                      );
                    })()}
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