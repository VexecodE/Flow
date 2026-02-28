"use client";

import React, { useEffect, useRef } from 'react';

const vertexShaderSource = `
    attribute vec2 position;
    varying vec2 vUv;
    void main() {
        vUv = position * 0.5 + 0.5;
        vUv.y = 1.0 - vUv.y;
        gl_Position = vec4(position, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `
    precision highp float;
    uniform sampler2D uImage;
    uniform vec2 uResolution;
    uniform vec2 uImageResolution;
    uniform vec2 uMouse;
    uniform float uRadius;
    uniform float uAngle;
    uniform float uActive;

    varying vec2 vUv;

    void main() {
        vec2 coord = vUv * uResolution;
        vec2 mouse = uMouse;
        
        vec2 dir = coord - mouse;
        float dist = length(dir);
        
        vec2 uv = vUv;
        
        // Liquid Swirl effect algorithm
        if (dist < uRadius && uActive > 0.0) {
            float percent = (uRadius - dist) / uRadius;
            float theta = percent * percent * uAngle * uActive; // Exponential curve for smoother twist
            float s = sin(theta);
            float c = cos(theta);
            
            vec2 rotated = vec2(
                dir.x * c - dir.y * s,
                dir.x * s + dir.y * c
            );
            
            coord = rotated + mouse;
            uv = coord / uResolution;
        }
        
        // CSS object-fit: cover mapping
        float screenRatio = uResolution.x / uResolution.y;
        float imageRatio = uImageResolution.x / uImageResolution.y;
        
        vec2 scaledUv = uv;
        if (screenRatio > imageRatio) {
            // Screen is wider, crop top/bottom
            float h = uResolution.x / imageRatio;
            float offset = (h - uResolution.y) / 2.0;
            scaledUv.y = (uv.y * uResolution.y + offset) / h;
        } else {
            // Screen is taller, crop sides
            float w = uResolution.y * imageRatio;
            float offset = (w - uResolution.x) / 2.0;
            scaledUv.x = (uv.x * uResolution.x + offset) / w;
        }
        
        // Clamp to prevent edge artifacts
        gl_FragColor = texture2D(uImage, clamp(scaledUv, 0.0, 1.0));
    }
`;

export const BackgroundWaves = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false }) ||
            canvas.getContext('experimental-webgl', { alpha: true, antialias: false, premultipliedAlpha: false }) as WebGLRenderingContext;
        if (!gl) return;

        function createShader(type: number, source: string) {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader parsing error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking error:', gl.getProgramInfoLog(program));
            return;
        }

        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positions = new Float32Array([
            -1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const uResolution = gl.getUniformLocation(program, "uResolution");
        const uImageResolution = gl.getUniformLocation(program, "uImageResolution");
        const uMouse = gl.getUniformLocation(program, "uMouse");
        const uRadius = gl.getUniformLocation(program, "uRadius");
        const uAngle = gl.getUniformLocation(program, "uAngle");
        const uImage = gl.getUniformLocation(program, "uImage");
        const uActive = gl.getUniformLocation(program, "uActive");

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Load the background image
        const image = new Image();
        let imageLoaded = false;

        const loadTexture = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            imageLoaded = true;
        };

        image.onload = loadTexture;
        image.src = '/login_bg.jpg';

        if (image.complete) {
            loadTexture();
        }

        let mouseX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
        let mouseY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;
        let targetX = mouseX;
        let targetY = mouseY;
        let active = 0;
        let targetActive = 0; // Starts inactive until mouse hover

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };

        window.addEventListener('resize', resize);
        resize();

        const onMouseMove = (e: MouseEvent) => {
            targetX = e.clientX;
            targetY = e.clientY;
            targetActive = 1;
        };

        const onMouseLeave = () => {
            targetActive = 0; // Fade out the swirl when mouse leaves
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseout', onMouseLeave);

        let animationFrameId: number;

        const render = () => {
            // Easing for smooth following and intensity
            mouseX += (targetX - mouseX) * 0.15;
            mouseY += (targetY - mouseY) * 0.15;
            active += (targetActive - active) * 0.08;

            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            if (imageLoaded) {
                gl.useProgram(program);
                gl.uniform2f(uResolution, canvas.width, canvas.height);
                gl.uniform2f(uImageResolution, image.width, image.height);
                gl.uniform2f(uMouse, mouseX, mouseY);
                gl.uniform1f(uRadius, 450.0); // Radius of swirl effect in pixels
                gl.uniform1f(uAngle, 2.5); // Max rotation angle
                gl.uniform1f(uActive, active);
                gl.uniform1i(uImage, 0);

                gl.drawArrays(gl.TRIANGLES, 0, 6);
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseout', onMouseLeave);
            cancelAnimationFrame(animationFrameId);
            if (gl) {
                gl.deleteProgram(program);
                if (vertexShader) gl.deleteShader(vertexShader);
                if (fragmentShader) gl.deleteShader(fragmentShader);
                gl.deleteTexture(texture);
                gl.deleteBuffer(positionBuffer);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 w-full h-full block pointer-events-none"
        />
    );
};
