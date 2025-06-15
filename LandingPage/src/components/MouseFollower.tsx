
import { useEffect, useState } from 'react';

const MouseFollower = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor glow - Enhanced visibility */}
      <div
        className="fixed pointer-events-none z-40 mix-blend-screen"
        style={{
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(147, 51, 234, 0.2) 30%, rgba(239, 68, 68, 0.15) 60%, transparent 80%)',
          borderRadius: '50%',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          filter: 'blur(60px)',
        }}
      />
      
      {/* Secondary smaller glow - Enhanced visibility */}
      <div
        className="fixed pointer-events-none z-39 mix-blend-screen"
        style={{
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.25) 50%, transparent 70%)',
          borderRadius: '50%',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          filter: 'blur(30px)',
        }}
      />
      
      {/* Additional bright center glow */}
      <div
        className="fixed pointer-events-none z-41 mix-blend-screen"
        style={{
          left: mousePosition.x - 50,
          top: mousePosition.y - 50,
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.3) 40%, transparent 60%)',
          borderRadius: '50%',
          transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          filter: 'blur(20px)',
        }}
      />
    </>
  );
};

export default MouseFollower;
