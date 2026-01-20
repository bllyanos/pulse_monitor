
import React, { useState } from 'react';
import { PlusCircle, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { STYLES } from '../constants';

interface MonitorFormProps {
  onAdd: (name: string, url: string, interval: number) => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export const MonitorForm: React.FC<MonitorFormProps> = ({ onAdd, isExpanded, setIsExpanded }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [interval, setInterval] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;
    onAdd(name, url, interval);
    setName('');
    setUrl('');
    setInterval(30);
  };

  return (
    <div className={`${STYLES.containerPrimary} p-4 mb-6 transition-all duration-200`}>
      <div 
        className={`${STYLES.headerUnderlined} cursor-pointer group p-1 -m-1 rounded-t-sm select-none border-stone-800 transition-colors`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <PlusCircle size={18} className="text-orange-600 group-hover:scale-110 transition-transform" />
          <span className="font-bold uppercase tracking-tight text-stone-900">Add New Target</span>
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded border-2 border-stone-800 bg-white shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-active:translate-x-[1px] group-active:translate-y-[1px] group-active:shadow-none transition-all">
          {isExpanded ? (
            <ChevronUp size={20} className="text-stone-900 group-hover:text-orange-600" />
          ) : (
            <ChevronDown size={20} className="text-stone-900 group-hover:text-orange-600" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="md:col-span-1">
            <label className={STYLES.label}>Endpoint Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className={STYLES.input}
              placeholder="e.g. API Gateway"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className={STYLES.label}>Target URL</label>
            <input 
              type="url" 
              value={url}
              onChange={e => setUrl(e.target.value)}
              className={STYLES.input}
              placeholder="https://api.example.com/health"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className={STYLES.label}>Check (s)</label>
            <input 
              type="number" 
              min="5"
              max="3600"
              value={interval}
              onChange={e => setInterval(parseInt(e.target.value) || 30)}
              className={STYLES.input}
            />
          </div>
          <div className="md:col-span-1">
            <button 
              type="submit" 
              className={`${STYLES.btn} ${STYLES.btnPrimary} w-full`}
            >
              <Activity size={16} />
              <span className="font-bold">DEPLOY</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
