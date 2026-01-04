import React, { useRef, useEffect } from 'react';

const Oscilloscope = ({ data, currentIndex }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !data) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.fillStyle = '#050505'; // Match monitor-bg
        ctx.fillRect(0, 0, width, height);

        // Draw Grid
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x < width; x += 50) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += 50) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }
        ctx.stroke();

        // Draw Waveform
        if (data.samples && data.samples.length > 0) {
            ctx.beginPath();
            ctx.strokeStyle = '#00ff41'; // monitor-line
            ctx.lineWidth = 2;

            const totalSamples = data.samples.length;
            // We want to fit all samples or a window? 
            // Design implies scrolling or full view. 
            // Let's fit all 1000 samples in the width for now.
            const step = width / totalSamples;

            // Center Y is height/2. 
            // Voltage range approx -0.5 to 1. 
            // Scale voltage to height.
            const scaleY = height / 3; // Arbitrary scale factor
            const centerY = height / 2;

            data.samples.forEach((sample, i) => {
                const x = i * step;
                const y = centerY - (sample * scaleY); // Invert Y because canvas Y goes down
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.stroke();

            // Draw Playhead
            if (currentIndex !== null && currentIndex >= 0) {
                const playheadX = currentIndex * step;
                ctx.strokeStyle = '#ff0000';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(playheadX, 0);
                ctx.lineTo(playheadX, height);
                ctx.stroke();
            }
        }

    }, [data, currentIndex]);

    return (
        <div className="w-full h-64 border border-monitor-ui rounded bg-monitor-bg relative overflow-hidden shadow-[0_0_10px_rgba(0,255,65,0.2)]">
            <canvas
                ref={canvasRef}
                width={800}
                height={256}
                className="w-full h-full"
            />
            <div className="absolute top-2 left-2 text-xs text-monitor-text opacity-70">
                LEAD II
            </div>
        </div>
    );
};

export default Oscilloscope;
