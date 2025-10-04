
import React, { useMemo } from 'react';

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div
    className="absolute top-0 left-0 w-2 h-4"
    style={style}
  ></div>
);

const Confetti: React.FC = () => {
  const colors = ['#FF00EE', '#F0B3FF', '#00FFFF', '#A6FFD9'];
  const numPieces = 50;

  const pieces = useMemo(() => {
    return Array.from({ length: numPieces }).map((_, index) => {
      const color = colors[index % colors.length];
      const animationDuration = `${Math.random() * 2 + 2}s`;
      const animationDelay = `${Math.random() * 1}s`;
      const transform = `rotate(${Math.random() * 360}deg)`;
      const left = `${Math.random() * 100}%`;
      const top = `${-20 + Math.random() * -80}%`; // Start off-screen
      
      const keyframes = `
        @keyframes fall-${index} {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(${Math.random() * 200 - 100}px, 150vh) rotate(720deg); opacity: 0; }
        }
      `;

      return {
        id: index,
        style: {
          backgroundColor: color,
          left,
          top,
          transform,
          animation: `fall-${index} ${animationDuration} ${animationDelay} linear forwards`,
        },
        keyframes,
      };
    });
  }, []);

  return (
    <>
      <style>{pieces.map(p => p.keyframes).join('\n')}</style>
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
        {pieces.map(piece => (
          <ConfettiPiece key={piece.id} style={piece.style} />
        ))}
      </div>
    </>
  );
};

export default Confetti;
