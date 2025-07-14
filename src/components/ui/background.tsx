import React, { useEffect, useState } from 'react';

interface Box {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  moveX: number;
  moveY: number;
  color: string;
}

const AnimatedBackground: React.FC = () => {
  const colors = ['#007bff', '#99caff', '#e9f2fb'];
  const minBoxes = 40;
  const maxBoxes = 100;
  const minDistance = 100;

  const [boxes, setBoxes] = useState<Box[]>([]);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    generateBoxes();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const generateBoxes = () => {
    const boxCount = Math.floor(Math.random() * (maxBoxes - minBoxes + 1)) + minBoxes;
    const newBoxes: Box[] = [];

    for (let i = 0; i < boxCount; i++) {
      let attempts = 0;
      let validPosition = false;
      let x = 0, y = 0;

      while (!validPosition && attempts < 100) {
        x = Math.random() * (dimensions.width - 150);
        y = Math.random() * (dimensions.height - 150);
        validPosition = true;

        for (const box of newBoxes) {
          const dx = box.x - x;
          const dy = box.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < minDistance) {
            validPosition = false;
            break;
          }
        }
        attempts++;
      }

      if (validPosition) {
        const size = Math.random() * 100 + 50;
        const duration = Math.random() * 5 + 4;
        const delay = Math.random() * 5;
        const moveX = (Math.random() - 0.5) * 100;
        const moveY = (Math.random() - 0.5) * 100;
        const color = colors[Math.floor(Math.random() * colors.length)];

        newBoxes.push({
          id: i,
          x,
          y,
          size,
          duration,
          delay,
          moveX,
          moveY,
          color,
        });
      }
    }

    setBoxes(newBoxes);
  };

  const getBoxStyle = (box: Box): React.CSSProperties => ({
    position: 'absolute',
    left: `${box.x}px`,
    top: `${box.y}px`,
    width: `${box.size}px`,
    height: `${box.size}px`,
    backgroundColor: box.color,
    borderRadius: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    opacity: 0.5,
    animation: `resize ${box.duration}s ease-in-out ${box.delay}s infinite alternate`,
    transform: 'translate(0, 0) scale(1)',
    willChange: 'transform',
    transition: `transform ${box.duration}s ease-in-out infinite alternate`,
  });

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        zIndex: -1,
        backgroundColor: 'var(--color-bg)',
      }}
    >
      <style>{`
        @keyframes resize {
          0% { transform: scale(1); }
          100% { transform: scale(0.1); }
        }
      `}</style>

      {boxes.map((box) => (
        <div
          key={box.id}
          id={`box-${box.id}`}
          style={getBoxStyle(box)}
          onAnimationIteration={() => {
            const transform = `translate(${box.moveX}px, ${box.moveY}px) scale(0.1)`;
            const el = document.getElementById(`box-${box.id}`);
            if (el) {
              el.style.transform = transform;
              setTimeout(() => {
                el.style.transform = 'translate(0, 0) scale(1)';
              }, box.duration * 500);
            }
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
