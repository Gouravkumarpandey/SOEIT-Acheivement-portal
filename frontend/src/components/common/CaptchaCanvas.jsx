import { useEffect, useRef } from 'react';

/**
 * CaptchaCanvas — Green bold digits, spaced out,
 * small purple/blue scattered dots, white background.
 * Matches the "2 4 0 3" style pattern.
 */
const CaptchaCanvas = ({ captcha }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !captcha) return;
        const ctx = canvas.getContext('2d');

        const W = canvas.width;
        const H = canvas.height;

        // ── Clear / White background ─────────────────────────────────
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, W, H);

        // ── Small scattered dots (enhanced noise) ───────────────────
        const noiseColors = ['#5b4fcf', '#3b58c4', '#7c3aed', '#2563eb', '#6d28d9', '#1d4ed8'];
        for (let i = 0; i < 150; i++) {
            ctx.beginPath();
            ctx.arc(
                Math.random() * W,
                Math.random() * H,
                Math.random() * 1.5 + 0.5,
                0,
                2 * Math.PI
            );
            ctx.fillStyle = noiseColors[Math.floor(Math.random() * noiseColors.length)];
            ctx.globalAlpha = 0.3 + Math.random() * 0.4;
            ctx.fill();
        }

        // ── Interference Lines (Anti-Bot) ────────────────────────────
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * W, Math.random() * H);
            ctx.lineTo(Math.random() * W, Math.random() * H);
            ctx.strokeStyle = noiseColors[Math.floor(Math.random() * noiseColors.length)];
            ctx.lineWidth = Math.random() * 1 + 0.5;
            ctx.globalAlpha = 0.4;
            ctx.stroke();
        }
        ctx.globalAlpha = 1;

        // ── Characters — Anti-OCR adjustments ────────────────────────
        const chars = captcha.split('');
        const cellW = W / chars.length;

        chars.forEach((ch, i) => {
            const x = cellW * i + cellW / 2;
            const y = H / 2 + (Math.random() * 8 - 4);       // ±4px vertical jitter
            
            ctx.save();
            ctx.translate(x, y);
            
            // Randomize font weight slightly for each char
            const weights = ['800', '900'];
            const weight = weights[Math.floor(Math.random() * weights.length)];
            
            ctx.font = `${weight} 26px Arial Black, Arial, sans-serif`;
            ctx.fillStyle = '#1e8a1e';   
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Subtle horizontal shift
            const xOffset = (Math.random() - 0.5) * 4;
            ctx.fillText(ch, xOffset, 0);

            ctx.restore();
        });
    }, [captcha]);

    return (
        <canvas
            ref={canvasRef}
            width={120}
            height={42}
            style={{
                display: 'block',
                flexShrink: 0,
                cursor: 'default',
                userSelect: 'none',
            }}
            aria-label="Captcha image"
        />
    );
};

export default CaptchaCanvas;
