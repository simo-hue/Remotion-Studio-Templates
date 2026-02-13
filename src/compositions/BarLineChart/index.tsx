import React from 'react';
import {
    interpolate,
    spring,
    useCurrentFrame,
    useVideoConfig,
} from 'remotion';
import { evolvePath, getLength, getPointAtLength } from '@remotion/paths';

const DATA = [
    { month: 'Jan', revenue: 8000, conversion: 2.1 },
    { month: 'Feb', revenue: 12000, conversion: 2.8 },
    { month: 'Mar', revenue: 15000, conversion: 3.2 },
    { month: 'Apr', revenue: 11000, conversion: 2.9 },
    { month: 'May', revenue: 18000, conversion: 3.8 },
    { month: 'Jun', revenue: 22000, conversion: 4.2 },
];

const MAX_REVENUE = 25000;
const MAX_CONVERSION = 5;

const CHART_WIDTH = 1400;
const CHART_HEIGHT = 600;

const COLORS = {
    background: '#1A1A2E',
    backgroundDeep: '#0F0F1A',
    bar: '#4E4E63',
    line: '#0B84F3',
    axis: 'rgba(255, 255, 255, 0.2)',
    text: '#FFFFFF',
};

export const BarLineChart: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Cinematic Camera Animation
    const cameraZoom = interpolate(frame, [0, 120], [1, 1.05], {
        extrapolateRight: 'clamp',
    });
    const cameraRotate = interpolate(frame, [0, 120], [0, 0.5], {
        extrapolateRight: 'clamp',
    });

    // Calculate points for the line chart
    const points = DATA.map((d, i) => {
        const x = (i / (DATA.length - 1)) * CHART_WIDTH;
        const y = CHART_HEIGHT - (d.conversion / MAX_CONVERSION) * CHART_HEIGHT;
        return { x, y };
    });

    const path = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

    const lineProgress = spring({
        frame,
        fps,
        config: {
            damping: 200,
        },
        durationInFrames: 90,
    });

    const { strokeDasharray, strokeDashoffset } = evolvePath(lineProgress, path);

    const pathLength = getLength(path);
    const currentPoint = getPointAtLength(path, lineProgress * pathLength);

    return (
        <div
            style={{
                flex: 1,
                background: `radial-gradient(circle at center, ${COLORS.background} 0%, ${COLORS.backgroundDeep} 100%)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: COLORS.text,
                fontFamily: 'Outfit, Inter, sans-serif',
                perspective: '1000px',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {/* Vignette Overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
                    pointerEvents: 'none',
                    zIndex: 10,
                }}
            />

            {/* Subtle Background Particles/Glow */}
            <div
                style={{
                    position: 'absolute',
                    width: 800,
                    height: 800,
                    background: `radial-gradient(circle at center, rgba(11, 132, 243, 0.05) 0%, transparent 70%)`,
                    top: '20%',
                    left: '10%',
                    filter: 'blur(60px)',
                    transform: `translate(${Math.sin(frame * 0.02) * 50}px, ${Math.cos(frame * 0.02) * 50}px)`,
                }}
            />

            <div
                style={{
                    transform: `scale(${cameraZoom}) rotateX(${cameraRotate}deg) rotateY(${cameraRotate * 0.5}deg)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 5,
                }}
            >
                <h1
                    style={{
                        fontSize: 80,
                        fontWeight: 700,
                        marginBottom: 60,
                        letterSpacing: '-2px',
                        textShadow: '0 0 20px rgba(255,255,255,0.2)',
                        opacity: interpolate(frame, [0, 20], [0, 1]),
                    }}
                >
                    felicità del simo dopo un iterazione con llm
                </h1>

                <div
                    style={{
                        width: CHART_WIDTH,
                        height: CHART_HEIGHT,
                        position: 'relative',
                    }}
                >
                    {/* Grid and Axes */}
                    <svg
                        width={CHART_WIDTH + 100}
                        height={CHART_HEIGHT + 100}
                        style={{
                            position: 'absolute',
                            overflow: 'visible',
                        }}
                    >
                        {/* Y-Axis Grid Lines (Revenue) */}
                        {[0, 5000, 10000, 15000, 20000, 25000].map((val) => {
                            const y = CHART_HEIGHT - (val / MAX_REVENUE) * CHART_HEIGHT;
                            return (
                                <g key={val}>
                                    <line
                                        x1={0}
                                        y1={y}
                                        x2={CHART_WIDTH}
                                        y2={y}
                                        stroke={COLORS.axis}
                                        strokeWidth={1}
                                    />
                                    <text
                                        x={-20}
                                        y={y + 5}
                                        fill="rgba(255,255,255,0.5)"
                                        textAnchor="end"
                                        fontSize={20}
                                        fontWeight={500}
                                    >
                                        ${val / 1000}K
                                    </text>
                                </g>
                            );
                        })}

                        {/* X-Axis Labels */}
                        {DATA.map((d, i) => {
                            const x = (i / (DATA.length - 1)) * CHART_WIDTH;
                            return (
                                <text
                                    key={i}
                                    x={x}
                                    y={CHART_HEIGHT + 50}
                                    fill="rgba(255,255,255,0.7)"
                                    textAnchor="middle"
                                    fontSize={24}
                                    fontWeight={600}
                                >
                                    {d.month}
                                </text>
                            );
                        })}

                        {/* Right Y-Axis (Conversion) */}
                        {[0, 1, 2, 3, 4, 5].map((val) => {
                            const y = CHART_HEIGHT - (val / MAX_CONVERSION) * CHART_HEIGHT;
                            return (
                                <g key={val}>
                                    <text
                                        x={CHART_WIDTH + 20}
                                        y={y + 5}
                                        fill={COLORS.line}
                                        textAnchor="start"
                                        fontSize={20}
                                        fontWeight={600}
                                        style={{ opacity: 0.8 }}
                                    >
                                        {val}%
                                    </text>
                                </g>
                            );
                        })}
                    </svg>

                    {/* Bars */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: CHART_WIDTH,
                            height: CHART_HEIGHT,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            padding: `0 ${CHART_WIDTH / (DATA.length * 4)}px`,
                        }}
                    >
                        {DATA.map((d, i) => {
                            const barHeight = (d.revenue / MAX_REVENUE) * CHART_HEIGHT;
                            const progress = spring({
                                frame,
                                fps,
                                delay: i * 5,
                                config: {
                                    damping: 20,
                                    stiffness: 100,
                                },
                            });

                            return (
                                <div
                                    key={i}
                                    style={{
                                        width: 120,
                                        height: progress * barHeight,
                                        background: `linear-gradient(to top, #4E4E63, #6E6E85)`,
                                        borderRadius: '12px 12px 0 0',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                    }}
                                />
                            );
                        })}
                    </div>

                    {/* Line Chart */}
                    <svg
                        width={CHART_WIDTH}
                        height={CHART_HEIGHT}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            overflow: 'visible',
                        }}
                    >
                        <defs>
                            <filter id="extraGlow" x="-100%" y="-100%" width="300%" height="300%">
                                <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <path
                            d={path}
                            fill="none"
                            stroke={COLORS.line}
                            strokeWidth={8}
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            filter="url(#extraGlow)"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Pulsing Dot */}
                        {lineProgress > 0 && (
                            <g style={{ filter: 'url(#extraGlow)' }}>
                                <circle
                                    cx={currentPoint.x}
                                    cy={currentPoint.y}
                                    r={12 + 6 * Math.sin(frame * 0.2)}
                                    fill={COLORS.line}
                                />
                                <circle
                                    cx={currentPoint.x}
                                    cy={currentPoint.y}
                                    r={20 + 10 * Math.sin(frame * 0.2)}
                                    fill="none"
                                    stroke={COLORS.line}
                                    strokeWidth={2}
                                    style={{ opacity: interpolate(Math.sin(frame * 0.2), [-1, 1], [0.8, 0]) }}
                                />
                            </g>
                        )}
                    </svg>
                </div>

                <div
                    style={{
                        marginTop: 100,
                        display: 'flex',
                        gap: 60,
                        padding: '20px 40px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        opacity: interpolate(frame, [40, 60], [0, 1]),
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                        <div
                            style={{
                                width: 24,
                                height: 24,
                                background: 'linear-gradient(to top, #4E4E63, #6E6E85)',
                                borderRadius: 6,
                            }}
                        />
                        <span style={{ fontSize: 28, fontWeight: 500 }}>Revenue</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                        <div
                            style={{
                                width: 30,
                                height: 4,
                                backgroundColor: COLORS.line,
                                boxShadow: `0 0 15px ${COLORS.line}`,
                                borderRadius: 2,
                            }}
                        />
                        <span style={{ fontSize: 28, fontWeight: 500 }}>Conversion Rate</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
