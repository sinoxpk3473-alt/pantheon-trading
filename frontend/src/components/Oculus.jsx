import React, { useEffect, useRef } from 'react';

const Oculus = ({ isThinking, status = 'idle' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const goldenRatio = 1.618033988749;
    
    let rotation = 0;
    let animationId;

    const drawIcosahedron = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Golden ratio calculations for icosahedron vertices
      const phi = goldenRatio;
      const scale = 60;
      
      // 12 vertices of icosahedron
      const vertices = [
        [0, 1, phi], [0, 1, -phi], [0, -1, phi], [0, -1, -phi],
        [1, phi, 0], [1, -phi, 0], [-1, phi, 0], [-1, -phi, 0],
        [phi, 0, 1], [phi, 0, -1], [-phi, 0, 1], [-phi, 0, -1]
      ].map(v => v.map(coord => coord * scale));

      // Edges (30 edges in icosahedron)
      const edges = [
        [0, 2], [0, 4], [0, 6], [0, 8], [0, 10],
        [1, 3], [1, 4], [1, 6], [1, 9], [1, 11],
        [2, 5], [2, 7], [2, 8], [2, 10], [3, 5],
        [3, 7], [3, 9], [3, 11], [4, 6], [4, 8],
        [4, 9], [5, 7], [5, 8], [5, 9], [6, 10],
        [6, 11], [7, 10], [7, 11], [8, 9], [10, 11]
      ];

      // Rotation matrices
      const rotateY = (point, angle) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return [
          point[0] * cos - point[2] * sin,
          point[1],
          point[0] * sin + point[2] * cos
        ];
      };

      const rotateX = (point, angle) => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return [
          point[0],
          point[1] * cos - point[2] * sin,
          point[1] * sin + point[2] * cos
        ];
      };

      // Project 3D to 2D
      const project = (point) => {
        const distance = 400;
        const z = point[2] + distance;
        return [
          centerX + (point[0] * distance) / z,
          centerY + (point[1] * distance) / z
        ];
      };

      // Rotate and project all vertices
      const rotatedVertices = vertices.map(v => {
        let rotated = rotateY(v, rotation);
        rotated = rotateX(rotated, rotation * 0.7);
        return project(rotated);
      });

      // Draw edges
      ctx.strokeStyle = isThinking ? '#D4AF37' : 'rgba(212, 175, 55, 0.3)';
      ctx.lineWidth = isThinking ? 2 : 1;
      ctx.lineCap = 'round';

      edges.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(rotatedVertices[i][0], rotatedVertices[i][1]);
        ctx.lineTo(rotatedVertices[j][0], rotatedVertices[j][1]);
        ctx.stroke();
      });

      // Draw vertices
      ctx.fillStyle = isThinking ? '#E8C547' : 'rgba(212, 175, 55, 0.5)';
      rotatedVertices.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, isThinking ? 3 : 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Rotation speed
      if (isThinking) {
        rotation += 0.02; // Faster when thinking
      } else {
        rotation += 0.001; // Very slow ambient rotation
      }

      animationId = requestAnimationFrame(drawIcosahedron);
    };

    drawIcosahedron();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isThinking]);

  return (
    <div className="oculus-container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.618rem'
    }}>
      {/* Sacred Geometry Canvas */}
      <div style={{
        position: 'relative',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.05) 0%, transparent 70%)'
      }}>
        <canvas 
          ref={canvasRef} 
          width={200} 
          height={200}
          style={{
            display: 'block',
            filter: isThinking ? 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.4))' : 'none'
          }}
        />
        
        {/* Center indicator */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '8px',
          height: '8px',
          background: isThinking ? '#D4AF37' : 'rgba(212, 175, 55, 0.3)',
          borderRadius: '50%',
          boxShadow: isThinking ? '0 0 12px rgba(212, 175, 55, 0.8)' : 'none'
        }} />
      </div>

      {/* Status Text */}
      <div style={{
        fontFamily: 'Cinzel, serif',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: isThinking ? '#D4AF37' : '#F0F0F0',
        textAlign: 'center'
      }}>
        {isThinking ? (
          <>
            <div style={{ marginBottom: '0.382rem' }}>CONSILIUM COGITAT</div>
            <div style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.625rem',
              color: '#C0C0C0',
              fontWeight: 400,
              letterSpacing: '0.05em'
            }}>
              The Council deliberates...
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '0.382rem' }}>{status.toUpperCase()}</div>
            <div style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.625rem',
              color: '#C0C0C0',
              fontWeight: 400,
              letterSpacing: '0.05em'
            }}>
              Awaiting market signal
            </div>
          </>
        )}
      </div>

      {/* Divider */}
      <div style={{
        width: '120px',
        height: '1px',
        background: 'linear-gradient(to right, transparent, #D4AF37, transparent)',
        opacity: isThinking ? 1 : 0.3
      }} />
    </div>
  );
};

export default Oculus;