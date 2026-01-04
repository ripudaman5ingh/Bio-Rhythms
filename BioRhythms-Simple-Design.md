# Bio-Rhythms: Simple System Design

## What It Is
A static website that plays ECG heart data as music. User selects a heart rhythm → sees the waveform → hears it as sound.

## Tech Stack
- React + Vite
- Tone.js (audio)
- Canvas (visualization)
- Tailwind CSS (styling)

## Project Structure
```
bio-rhythms/
├── public/
│   └── data/
│       ├── sinus_normal.json
│       ├── afib.json
│       ├── bradycardia.json
│       ├── tachycardia.json
│       └── flutter.json
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   │   ├── Oscilloscope.jsx
│   │   ├── Controls.jsx
│   │   └── RhythmSelector.jsx
│   └── audio/
│       └── Sonifier.js
└── index.html
```

## Data Format (JSON files)
Each ECG file looks like this:
```json
{
  "id": "sinus_normal",
  "name": "Normal Sinus Rhythm",
  "description": "Healthy regular heartbeat",
  "sampleRate": 100,
  "samples": [0.1, 0.15, 0.2, 0.8, 0.3, ...]
}
```
- `samples`: Array of voltage values (1000 samples = 10 seconds at 100Hz)
- `sampleRate`: 100 (samples per second)

## How It Works

### 1. User Flow
```
Select Rhythm → Click Play → See Waveform + Hear Sound → Stop
```

### 2. Audio Logic (Sonifier.js)
```javascript
import * as Tone from 'tone';

class Sonifier {
  constructor() {
    this.synth = new Tone.Synth().toDestination();
  }

  // Convert ECG voltage (0-1) to musical frequency (100-500 Hz)
  voltageToFrequency(voltage) {
    return 100 + (voltage * 400);
  }

  // Play a single sample
  play(voltage) {
    const freq = this.voltageToFrequency(voltage);
    this.synth.triggerAttackRelease(freq, '32n');
  }
}
```

### 3. Oscilloscope (Canvas)
- Draw ECG waveform scrolling left-to-right
- Green line on dark background
- Red vertical line shows current playback position

### 4. Playback Loop
```javascript
// In App.jsx
const [isPlaying, setIsPlaying] = useState(false);
const [currentIndex, setCurrentIndex] = useState(0);

useEffect(() => {
  if (!isPlaying) return;
  
  const interval = setInterval(() => {
    const voltage = ecgData.samples[currentIndex];
    sonifier.play(voltage);
    setCurrentIndex(i => (i + 1) % ecgData.samples.length);
  }, 1000 / ecgData.sampleRate); // 10ms for 100Hz
  
  return () => clearInterval(interval);
}, [isPlaying, currentIndex]);
```

## Components

### App.jsx
- Loads selected ECG JSON file
- Manages play/pause state
- Coordinates oscilloscope and audio

### RhythmSelector.jsx
- Dropdown with 5 options:
  - Normal Sinus Rhythm
  - Atrial Fibrillation
  - Sinus Bradycardia
  - Sinus Tachycardia
  - Atrial Flutter

### Controls.jsx
- Play button
- Pause button
- Stop button
- Volume slider

### Oscilloscope.jsx
- Canvas element
- Draws waveform in real-time
- Shows current position

## UI Layout
```
┌─────────────────────────────────────────┐
│           BIO-RHYTHMS                   │
│   Hear the rhythm of the human heart   │
├─────────────────────────────────────────┤
│  [Dropdown: Select Heart Rhythm ▼]      │
├─────────────────────────────────────────┤
│                                         │
│   ┌─────────────────────────────────┐   │
│   │     OSCILLOSCOPE CANVAS         │   │
│   │     (green waveform on black)   │   │
│   └─────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│   [▶ Play]  [⏸ Pause]  [⏹ Stop]        │
│   Volume: ═══════●═══                   │
├─────────────────────────────────────────┤
│   Current: Normal Sinus Rhythm          │
│   Heart Rate: 72 BPM                    │
│   Status: Playing                       │
└─────────────────────────────────────────┘
```

## Build Steps

1. Create Vite React project
2. Install dependencies: `npm install tone tailwindcss`
3. Add the 5 JSON data files to public/data/
4. Build components one by one
5. Deploy to Vercel/Netlify

## That's It
No backend. No database. No user uploads. Just 5 pre-loaded heart rhythms that play as sound.
