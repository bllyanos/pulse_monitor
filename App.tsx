
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Activity, ShieldCheck, AlertTriangle, List, LayoutGrid, Clock, Settings, RefreshCw } from 'lucide-react';
import { Monitor, MonitorLog } from './types';
import { STYLES } from './constants';
import { MonitorForm } from './components/MonitorForm';
import { UrlCard } from './components/UrlCard';

const App: React.FC = () => {
  // Load initial monitors from localStorage
  const [monitors, setMonitors] = useState<Monitor[]>(() => {
    const saved = localStorage.getItem('pulse_monitors');
    return saved ? JSON.parse(saved) : [];
  });

  const [isGrid, setIsGrid] = useState(true);
  
  // Collapse form by default if there are existing monitors on page load
  const [isFormExpanded, setIsFormExpanded] = useState(monitors.length === 0);
  
  const timersRef = useRef<{ [key: string]: any }>({});

  // Persist monitors to localStorage
  useEffect(() => {
    localStorage.setItem('pulse_monitors', JSON.stringify(monitors));
  }, [monitors]);

  const checkHealth = useCallback(async (monitor: Monitor) => {
    const startTime = performance.now();
    try {
      const urlWithBuster = new URL(monitor.url);
      urlWithBuster.searchParams.append('_pulse', Date.now().toString());

      const response = await fetch(urlWithBuster.toString(), {
        method: 'GET',
        mode: 'cors', 
      });

      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      const log: MonitorLog = {
        timestamp: Date.now(),
        status: response.ok ? 'UP' : 'DOWN',
        statusCode: response.status,
        latency: latency,
      };

      setMonitors(prev => prev.map(m => 
        m.id === monitor.id 
          ? { ...m, logs: [...m.logs.slice(-49), log] } 
          : m
      ));
    } catch (error) {
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      
      const log: MonitorLog = {
        timestamp: Date.now(),
        status: 'ERROR',
        statusCode: null,
        latency: latency,
        message: error instanceof Error ? error.message : 'Unknown error'
      };

      setMonitors(prev => prev.map(m => 
        m.id === monitor.id 
          ? { ...m, logs: [...m.logs.slice(-49), log] } 
          : m
      ));
    }
  }, []);

  useEffect(() => {
    monitors.forEach(monitor => {
      if (timersRef.current[monitor.id]) {
        clearInterval(timersRef.current[monitor.id]);
      }

      if (monitor.isActive) {
        checkHealth(monitor);
        timersRef.current[monitor.id] = setInterval(() => {
          checkHealth(monitor);
        }, monitor.interval * 1000);
      }
    });

    return () => {
      Object.values(timersRef.current).forEach(clearInterval);
    };
  }, [monitors.length, monitors.map(m => m.isActive).join(','), monitors.map(m => m.interval).join(','), checkHealth]);

  const addMonitor = (name: string, url: string, interval: number) => {
    const newMonitor: Monitor = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      url,
      interval,
      isActive: true,
      logs: []
    };
    setMonitors(prev => [...prev, newMonitor]);
  };

  const deleteMonitor = (id: string) => {
    if (timersRef.current[id]) clearInterval(timersRef.current[id]);
    setMonitors(prev => prev.filter(m => m.id !== id));
  };

  const toggleMonitor = (id: string) => {
    setMonitors(prev => prev.map(m => 
      m.id === id ? { ...m, isActive: !m.isActive } : m
    ));
  };

  const globalUptime = monitors.length > 0
    ? Math.round((monitors.filter(m => {
        const lastLog = m.logs[m.logs.length - 1];
        return lastLog?.status === 'UP';
      }).length / monitors.length) * 100)
    : 100;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-600 text-stone-50 border-2 border-stone-900 rounded-md flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Activity size={24} />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter uppercase">PULSE_MONITOR v1.0</h1>
          </div>
          <p className="text-stone-500 text-sm max-w-md font-medium">
            Real-time health monitoring, latency tracking, and uptime reporting for your web endpoints.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className={`${STYLES.container} px-4 py-2 flex items-center gap-3 bg-stone-50`}>
             <div className="flex flex-col">
               <span className={STYLES.label}>Fleet Health</span>
               <div className="flex items-center gap-2">
                 <ShieldCheck size={18} className="text-orange-600" />
                 <span className="text-xl font-bold">{globalUptime}% UP</span>
               </div>
             </div>
          </div>
          <div className={`${STYLES.container} px-4 py-2 flex items-center gap-3 bg-stone-50`}>
             <div className="flex flex-col">
               <span className={STYLES.label}>Total Targets</span>
               <div className="flex items-center gap-2">
                 <List size={18} className="text-stone-600" />
                 <span className="text-xl font-bold">{monitors.length} NODES</span>
               </div>
             </div>
          </div>
        </div>
      </header>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsGrid(true)}
            className={`${STYLES.btn} ${isGrid ? 'bg-stone-800 text-stone-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'}`}
          >
            <LayoutGrid size={16} />
          </button>
          <button 
            onClick={() => setIsGrid(false)}
            className={`${STYLES.btn} ${!isGrid ? 'bg-stone-800 text-stone-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white'}`}
          >
            <List size={16} />
          </button>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold text-stone-400 uppercase">
          <RefreshCw size={14} className="animate-spin text-orange-500" />
          Live Auto-Refresh
        </div>
      </div>

      <MonitorForm 
        onAdd={addMonitor} 
        isExpanded={isFormExpanded} 
        setIsExpanded={setIsFormExpanded} 
      />

      {monitors.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-stone-300 rounded-md bg-stone-50">
          <AlertTriangle size={48} className="text-stone-300 mb-4" />
          <p className="text-stone-400 font-bold uppercase tracking-widest">No Active Monitors</p>
          <p className="text-stone-400 text-xs mt-1">Deploy your first target to begin telemetry collection.</p>
        </div>
      ) : (
        <div className={isGrid ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
          {monitors.map(monitor => (
            <UrlCard 
              key={monitor.id} 
              monitor={monitor} 
              onDelete={deleteMonitor} 
              onToggle={toggleMonitor}
            />
          ))}
        </div>
      )}

      <footer className="mt-12 pt-8 border-t-2 border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            System Operational
          </div>
          <div>CORS: BYPASSED (ASSUMED)</div>
          <div>PROTO: HTTPS/1.1</div>
        </div>
        <div>
          &copy; {new Date().getFullYear()} PULSE_OPS_SYSTEMS
        </div>
      </footer>
    </div>
  );
};

export default App;
