import React, { useRef, useEffect } from 'react';
import { SamplePageLayout } from '../ui/SamplePageLayout';
import { GamepadIcon, AgentIcon, VizLabIcon } from '../Icons';

export const ParallaxHoverSample: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { left, top, width, height } = container.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;

            const layers = container.querySelectorAll<HTMLElement>('.parallax-layer');
            layers.forEach(layer => {
                const speed = parseFloat(layer.dataset.speed || '0');
                const xPos = (x - 0.5) * speed;
                const yPos = (y - 0.5) * speed;
                layer.style.transform = `translateX(${xPos}px) translateY(${yPos}px)`;
            });
        };

        container.addEventListener('mousemove', handleMouseMove);
        return () => container.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <SamplePageLayout
            title="Parallax Hover"
            description="An effect where layered elements move at different speeds on hover to create depth."
        >
            <div ref={containerRef} className="w-96 h-60 bg-gray-800/50 rounded-lg border border-gray-700 relative flex items-center justify-center overflow-hidden">
                <div className="parallax-layer text-cyan-200" data-speed="20">
                    <GamepadIcon size={20} />
                </div>
                <div className="parallax-layer text-purple-400" data-speed="-40">
                    <AgentIcon size={12} />
                </div>
                 <div className="parallax-layer text-gray-500" data-speed="60">
                    <VizLabIcon size={24} />
                </div>
                 <p className="parallax-layer font-bold text-3xl text-white" data-speed="-10">Parallax</p>
            </div>
        </SamplePageLayout>
    );
};