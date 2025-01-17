const getClientIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP:', error);
      return '';
    }
  };

const createCanvasFingerprint = () => {
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125,1,62,20);
    ctx.fillStyle = '#069';
    ctx.fillText('Hello, world!', 2, 15);
    
    return canvas.toDataURL();
  };
  
  export const generateFingerprint = async () => {

    if (typeof window === 'undefined') return '';

    const ip = await getClientIP();
  
    const deviceInfo = {
        userIp: ip,
        userAgent: navigator?.userAgent || '',
        language: navigator?.language || '',
        screen: `${window?.screen?.width || 0}x${window?.screen?.height || 0}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    };

    // Store connection info
    const connections = JSON.parse(localStorage.getItem('connections') || '[]');
    connections.push({
      deviceInfo,
      timestamp: Date.now(),
      id: Math.random().toString(36).substring(2, 11) // Fixed deprecated substr
    });
    localStorage.setItem('connections', JSON.stringify(connections));

    return btoa(JSON.stringify(deviceInfo));
  };