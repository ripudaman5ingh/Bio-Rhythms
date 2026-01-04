import React, { useState, useEffect, useRef } from 'react';
import { Sonifier } from './audio/Sonifier';
import Oscilloscope from './components/Oscilloscope';
import Controls from './components/Controls';
import RhythmSelector from './components/RhythmSelector';
import FaultyTerminal from './components/FaultyTerminal';
import { Heart } from 'lucide-react';

const sonifier = new Sonifier();

function App() {
  const [data, setData] = useState(null);
  const [currentRhythmId, setCurrentRhythmId] = useState('sinus_normal');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(-12);
  const playbackRef = useRef(null);

  // Load Data
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`/data/${currentRhythmId}.json`);
        const json = await response.json();
        setData(json);
        setCurrentIndex(0);
      } catch (err) {
        console.error("Failed to load rhythm data", err);
      }
    }
    loadData();
  }, [currentRhythmId]);

  // Audio Initialization & Volume
  useEffect(() => {
    sonifier.setVolume(volume);
  }, [volume]);

  // Playback Loop
  useEffect(() => {
    if (isPlaying && data) {
      // Start audio context if not started
      sonifier.initialize();

      const intervalMs = 1000 / data.sampleRate;

      playbackRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const nextIndex = (prev + 1) % data.samples.length;
          const voltage = data.samples[nextIndex];

          // Play sound
          sonifier.play(voltage);

          return nextIndex;
        });
      }, intervalMs);
    } else {
      if (playbackRef.current) {
        clearInterval(playbackRef.current);
      }
      sonifier.stop();
    }

    return () => {
      if (playbackRef.current) clearInterval(playbackRef.current);
    };
  }, [isPlaying, data]);

  const handlePlay = () => {
    sonifier.start();
    setIsPlaying(true);
  };
  const handlePause = () => {
    sonifier.stop();
    setIsPlaying(false);
  };
  const handleStop = () => {
    sonifier.stop();
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-8 overflow-hidden bg-monitor-bg">
      {/* Background Terminal - Memoized to prevent re-renders/flashing during playback */}
      {React.useMemo(() => (
        <div className="absolute inset-0 z-0 opacity-50">
          <FaultyTerminal
            scale={1.5}
            gridMul={[2, 1]}
            digitSize={1.2}
            timeScale={0.5}
            pause={false}
            scanlineIntensity={0.5}
            glitchAmount={1}
            flickerAmount={1}
            noiseAmp={1}
            chromaticAberration={0}
            dither={0}
            curvature={0.1}
            tint="#a855f7"
            mouseReact={true}
            mouseStrength={0.5}
            pageLoadAnimation={true}
            brightness={0.6}
          />
        </div>
      ), [])}

      <div className="max-w-4xl w-full border border-monitor-ui rounded-xl bg-black/80 shadow-2xl overflow-hidden backdrop-blur-md shadow-[0_0_50px_rgba(88,28,135,0.4)] relative z-10">

        {/* Header */}
        <header className="p-6 border-b border-monitor-ui flex items-center justify-between bg-black/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-monitor-ui/20 rounded-lg animate-pulse">
              <Heart className="text-monitor-line" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wider text-white">BIO-RHYTHMS</h1>
              <p className="text-xs text-monitor-line uppercase tracking-[0.2em] opacity-80">Physiological Sonification Node</p>
            </div>
          </div>
          <RhythmSelector
            currentRhythmId={currentRhythmId}
            onSelect={(id) => {
              handleStop();
              setCurrentRhythmId(id);
            }}
          />
        </header>

        {/* Main Display */}
        <main className="p-8 space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-2">
              {/* Metadata Display */}
              <div className="flex justify-between items-end mb-2 px-1">
                <div>
                  <h2 className="text-xl text-white font-light">{data?.name || "Loading..."}</h2>
                  <p className="text-xs text-gray-400">{data?.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-mono text-monitor-line">
                    {data ? (
                      // Simple mapping for realistic display based on ID
                      data.id === 'sinus_normal' ? '72' :
                        data.id === 'bradycardia' ? '48' :
                          data.id === 'tachycardia' ? '135' :
                            data.id === 'afib' ? '110' :
                              data.id === 'flutter' ? '150' : '--'
                    ) : "--"}
                    <span className="text-xs ml-1">BPM</span>
                  </div>
                  <div className="text-xs text-monitor-ui">HR EST.</div>
                </div>
              </div>

              <Oscilloscope data={data} currentIndex={currentIndex} />
            </div>

            <div className="bg-monitor-grid/30 rounded border border-monitor-ui/30 p-4 font-mono text-xs space-y-4">
              <div>
                <h3 className="text-monitor-ui mb-1">SIGNAL DATA</h3>
                <div className="grid grid-cols-2 gap-2 text-gray-400">
                  <span>RATE:</span> <span className="text-white text-right">{data?.sampleRate} Hz</span>
                  <span>SAMPLES:</span> <span className="text-white text-right">{data?.samples?.length}</span>
                  <span>DURATION:</span> <span className="text-white text-right">{data ? data.samples.length / data.sampleRate : 0}s</span>
                </div>
              </div>

              <div>
                <h3 className="text-monitor-ui mb-1">AUDIO ENGINE</h3>
                <div className="grid grid-cols-2 gap-2 text-gray-400">
                  <span>STATUS:</span>
                  <span className={isPlaying ? "text-monitor-line text-right animate-pulse" : "text-yellow-500 text-right"}>
                    {isPlaying ? "ACTIVE" : "STANDBY"}
                  </span>
                  <span>WAVE:</span> <span className="text-white text-right">SINE</span>
                  <span>ENV:</span> <span className="text-white text-right">FAST</span>
                </div>
              </div>

              <div className="pt-8 text-center text-monitor-ui/50">
                  // VISUALYZER V1.0.4
              </div>
            </div>
          </div>

        </main>

        {/* Controls */}
        <Controls
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onStop={handleStop}
          volume={volume}
          onVolumeChange={setVolume}
        />

      </div>
    </div>
  );
}

export default App;
