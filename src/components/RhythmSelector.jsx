import React from 'react';
import { Activity } from 'lucide-react';

const availableRhythms = [
    { id: 'sinus_normal', name: 'Normal Sinus Rhythm' },
    { id: 'afib', name: 'Atrial Fibrillation' },
    { id: 'bradycardia', name: 'Sinus Bradycardia' },
    { id: 'tachycardia', name: 'Sinus Tachycardia' },
    { id: 'flutter', name: 'Atrial Flutter' },
];

const RhythmSelector = ({ currentRhythmId, onSelect }) => {
    return (
        <div className="relative inline-block w-64">
            <div className="flex items-center space-x-2 mb-1 text-xs text-monitor-line uppercase tracking-widest">
                <Activity size={14} />
                <span>Rhythm Select</span>
            </div>
            <select
                value={currentRhythmId}
                aria-label="Select Heart Rhythm"
                onChange={(e) => onSelect(e.target.value)}
                className="block w-full px-4 py-2 text-monitor-text bg-monitor-bg border border-monitor-ui rounded focus:outline-none focus:border-monitor-line shadow-[0_0_10px_rgba(0,0,0,0.5)] appearance-none"
            >
                {availableRhythms.map(r => (
                    <option key={r.id} value={r.id}>
                        {r.name}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-monitor-line mt-5">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
        </div>
    );
};

export default RhythmSelector;
