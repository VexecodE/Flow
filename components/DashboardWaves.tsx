"use client";

import React, { useEffect, useRef } from 'react';

export function DashboardWaves() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', resize);

        let time = 0;
        let animationFrameId: number;

        const draw = () => {
            time += 0.003; // Smooth, elegant speed
            ctx.clearRect(0, 0, width, height);

            // Clean white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);

            // Helper function to draw a set of warped lines
            const drawWaveSet = (numLines: number, offsetTime: number, color: string, stretch: number) => {
                for (let i = 0; i < numLines; i++) {
                    ctx.beginPath();
                    const normI = i / (numLines - 1);

                    for (let x = -50; x <= width + 50; x += 20) {
                        const nx = x / width;
                        let y = height * 0.5;

                        // Primary swooping curves
                        y += Math.sin(nx * stretch + offsetTime) * (height * 0.3);
                        y += Math.cos(nx * 2 - offsetTime * 0.8) * (height * 0.2);

                        // Ribbon twist spread (this makes them cross over each other to form the mesh)
                        const twist = Math.sin(nx * 3 + offsetTime * 0.5);
                        const spread = 350 * twist;

                        y += (normI - 0.5) * spread;

                        // Secondary ripple detail
                        y += Math.sin(nx * 6 + offsetTime * 1.5) * 30;
                        y += Math.cos(normI * Math.PI * 2) * 20; // Internal curl

                        if (x === -50) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            };

            // Draw two sets intersecting each other to create the mesh effect from the image
            drawWaveSet(20, time, 'rgba(160, 160, 160, 0.45)', 2.5);
            drawWaveSet(20, -time * 0.7 + 5, 'rgba(140, 140, 140, 0.35)', 3.2);

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
        />
    );
}
