import * as Tone from 'tone';

export class Sonifier {
    constructor() {
        this.synth = new Tone.Synth({
            oscillator: {
                type: "sine"
            },
            envelope: {
                attack: 0.1,
                decay: 0.2,
                sustain: 1.0,
                release: 0.5
            }
        }).toDestination();

        // Add some effects for immersion
        this.reverb = new Tone.Reverb({
            decay: 2,
            wet: 0.2
        }).toDestination();

        this.synth.connect(this.reverb);

        this.isPlaying = false;
    }

    async initialize() {
        await Tone.start();
    }

    // Convert ECG voltage (approx -0.5 to 1.5) to musical frequency
    // Standard ECG range varies, but we map it to audible range
    voltageToFrequency(voltage) {
        // Clamp voltage reasonably to avoid extreme frequencies
        const clampedVoltage = Math.max(-1, Math.min(2, voltage));

        // Baseline 100Hz, scale up. 
        // Higher voltage (R-peak) should produce higher pitch?
        // Or maybe lower pitch for thud?
        // Let's try mapping to 100-400Hz range
        return Math.max(50, 100 + (clampedVoltage * 200));
    }

    play(voltage) {
        if (!this.synth) return;

        const freq = this.voltageToFrequency(voltage);

        // Continuous visualization = continuous sound
        // If not playing, trigger attack. 
        // If playing, ramp frequency.
        // We will manage 'isPlaying' state in the class or rely on the caller?
        // Let's rely on the synth's state somewhat, or just ramp.

        // Error fix: "Start time must be strictly greater..." happens when re-triggering fast.
        // Solution: Don't re-trigger. Just set frequency.

        // We need to know if we just started.
        // But App.jsx manages the interval. 
        // We can just use rampTo which is safe.
        // However, we need to ensure the envelope is OPEN.

        // We will assume 'play' means 'update parameters'. 
        // We need a separate 'start' method or handle it here.
        this.synth.frequency.rampTo(freq, 0.01); // 10ms ramp
    }

    start() {
        if (this.synth) {
            this.synth.triggerAttack(this.voltageToFrequency(0));
        }
    }

    setVolume(db) {
        this.synth.volume.value = db; // -60 to 0
    }

    stop() {
        if (this.synth) {
            this.synth.triggerRelease();
        }
    }
}
