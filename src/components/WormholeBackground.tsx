import { useEffect, useRef } from 'react';

export function WormholeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
    }> = [];

    const colors = ['#00ff88', '#00ccff', '#0088ff', '#00ffcc'];

    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let rotation = 0;

    function animate() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      rotation += 0.002;

      particles.forEach((particle) => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const dx = particle.x - centerX;
        const dy = particle.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const angle = Math.atan2(dy, dx) + rotation;
        const newDistance = distance + Math.sin(particle.z * 0.01) * 2;

        particle.x = centerX + Math.cos(angle) * newDistance;
        particle.y = centerY + Math.sin(angle) * newDistance;

        particle.z -= 2;
        if (particle.z < 0) {
          particle.z = 1000;
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
        }

        const scale = 1000 / (1000 + particle.z);
        const size = particle.size * scale;
        const opacity = scale;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = opacity * 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;

        if (Math.random() < 0.01) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.globalAlpha = 0.3;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{ background: '#0a0a0a' }}
    />
  );
}
