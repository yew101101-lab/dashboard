import React, { useRef, useState } from 'react';
import './GlassCard.css';

export default function GlassCard({ children, className = '', onClick, ...props }) {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStyle({
      '--mouse-x': `${x}px`,
      '--mouse-y': `${y}px`
    });
  };

  return (
    <div
      ref={cardRef}
      className={`glass-card ${className}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      style={{ ...style, ...props.style }}
      {...props}
    >
      <div className="glass-card-content">
        {children}
      </div>
    </div>
  );
}
