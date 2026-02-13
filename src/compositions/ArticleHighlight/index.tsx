import React, { useRef, useEffect } from 'react';
import {
    AbsoluteFill,
    interpolate,
    useCurrentFrame,
    useVideoConfig,
    staticFile,
    Img,
} from 'remotion';
import rough from 'roughjs';

const ARTICLE_IMAGE = staticFile('articolo.png');

// OCR Data (relative to image pixels)
// bbox 27 146 618 207
// bbox 27 238 490 261
const highlights = [
    {
        text: "L'autovelox",
        bbox: [27, 146, 618, 207],
        startFrame: 30,
        endFrame: 75,
    },
    {
        text: "Alla ricerca di Mattioli Simone",
        bbox: [27, 238, 490, 261],
        startFrame: 75,
        endFrame: 120,
    },
];

export const ArticleHighlight: React.FC = () => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Blur effect (0-1s)
    const blurValue = interpolate(frame, [0, 30], [20, 0], {
        extrapolateRight: 'clamp',
    });

    // Zoom effect (0-5s)
    const scale = interpolate(frame, [0, durationInFrames], [1.0, 1.1]);

    // 3D Rotation (0-5s)
    // Around 15deg for each axis, left to right
    const rotateX = interpolate(frame, [0, durationInFrames], [-7.5, 7.5]);
    const rotateY = interpolate(frame, [0, durationInFrames], [-7.5, 7.5]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const rc = rough.canvas(canvas);

        highlights.forEach((h) => {
            const progress = interpolate(frame, [h.startFrame, h.endFrame], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
            });

            if (progress > 0) {
                const [x1, y1, x2, y2] = h.bbox;
                const w = x2 - x1;
                const h_rect = y2 - y1;

                // Draw rough highlighter
                rc.rectangle(x1, y1, w * progress, h_rect, {
                    fill: 'rgba(255, 235, 59, 0.5)',
                    fillStyle: 'solid',
                    stroke: 'none',
                    roughness: 1.5,
                });
            }
        });
    }, [frame]);

    const articleStyle: React.CSSProperties = {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
        filter: `blur(${blurValue}px)`,
        backgroundColor: 'white',
        padding: '80px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    return (
        <AbsoluteFill
            style={{
                backgroundColor: 'white',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div style={articleStyle}>
                <div style={{ position: 'relative' }}>
                    {/* Highlighter Layer (Behind Text) */}
                    <canvas
                        ref={canvasRef}
                        width={650} // Adjust based on image width
                        height={400} // Adjust based on image height
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 0,
                        }}
                    />
                    <Img
                        src={ARTICLE_IMAGE}
                        style={{
                            position: 'relative',
                            zIndex: 1,
                            mixBlendMode: 'multiply', // This makes the white background of the image transparent
                        }}
                    />
                </div>
            </div>
        </AbsoluteFill>
    );
};
