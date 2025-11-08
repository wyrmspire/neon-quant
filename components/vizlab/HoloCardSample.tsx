import React, { useRef, useEffect } from 'react';
import { SamplePageLayout } from '../ui/SamplePageLayout';

export const HoloCardSample: React.FC = () => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = e.clientX - left - width / 2;
            const y = e.clientY - top - height / 2;

            const rotateX = (y / height) * -30;
            const rotateY = (x / width) * 30;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        };

        const handleMouseLeave = () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <SamplePageLayout
            title="Holographic Card"
            description="A 3D tilt effect that reacts to mouse movement, creating a holographic illusion."
        >
            <div
                ref={cardRef}
                className="w-80 h-48 p-8 rounded-xl border-2 border-cyan-400/30 shadow-2xl shadow-cyan-500/10 relative transition-transform duration-100 ease-out flex flex-col justify-between"
                style={{ transformStyle: 'preserve-3d' }}
            >
                <div className="holo-glare"></div>
                <h3 className="text-2xl font-bold text-white" style={{ transform: 'translateZ(20px)' }}>NEON QUANT</h3>
                <p className="text-cyan-200" style={{ transform: 'translateZ(40px)' }}>ACCESS CARD</p>
            </div>
            <style>{`
                .holo-glare {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(110deg, transparent 30%, rgba(0, 255, 255, 0.2), transparent 70%);
                    opacity: 0.7;
                    mix-blend-mode: screen;
                    pointer-events: none;
                }
            `}</style>
        </SamplePageLayout>
    );
};