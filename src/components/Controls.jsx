import React from 'react';
import { Play, Pause, Square } from 'lucide-react';

const Controls = ({ isPlaying, onPlay, onPause, onStop, volume, onVolumeChange }) => {
    return (
        <div className="flex items-center space-x-6 p-4 border-t border-monitor-ui bg-black/50">
            <div className="flex space-x-4">
                {!isPlaying ? (
                    <button
                        onClick={onPlay}
                        aria-label="Play"
                        className="p-3 rounded-full bg-monitor-ui hover:bg-monitor-line hover:text-black transition-colors"
                    >
                        <Play size={24} />
                    </button>
                ) : (
                    <button
                        onClick={onPause}
                        aria-label="Pause"
                        className="p-3 rounded-full bg-monitor-ui hover:bg-yellow-500 hover:text-black transition-colors"
                    >
                        <Pause size={24} />
                    </button>
                )}
                <button
                    onClick={onStop}
                    aria-label="Stop"
                    className="p-3 rounded-full bg-monitor-ui hover:bg-red-600 hover:text-white transition-colors"
                >
                    <Square size={24} />
                </button>
            </div>

            <div className="flex-1 flex items-center space-x-3">
                <span className="text-sm">VOL</span>
                <input
                    type="range"
                    min="-60"
                    max="0"
                    value={volume}
                    aria-label="Volume Control"
                    onChange={(e) => onVolumeChange(Number(e.target.value))}
                    className="w-full h-1 bg-monitor-ui rounded-lg appearance-none cursor-pointer accent-monitor-line"
                />
            </div>
        </div>
    );
};

export default Controls;
