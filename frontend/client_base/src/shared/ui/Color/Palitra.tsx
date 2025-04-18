import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Palitra.scss'

const ColorWheel = ({onChange, color, sat}:{onChange?:(color: string, set: string)=>void, color: string, sat: string}) => {
  const [isDragging, setIsDragging] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const setColor = useCallback(() => {
    if (!wheelRef.current || !selectorRef.current) return;
    const rect = wheelRef.current.getBoundingClientRect();
    const radius = rect.width / 2;
    const distance = (parseInt(sat) / 100) * radius

    const deg = (parseInt(color) - 360) * (Math.PI / 180);

    const x = distance * Math.cos(deg)
    const y = distance * Math.sin(deg)

    const pozX = x + radius
    const pozY = y + radius

    selectorRef.current.style.top = `${pozY}px`
    selectorRef.current.style.left = `${pozX}px`

  },[color, sat])

  const updateColor = useCallback((clientX: number, clientY: number) => {
    if (!wheelRef.current || !selectorRef.current) return;


    const rect = wheelRef.current.getBoundingClientRect();

    const radius = rect.width / 2;
    const xrow = clientX - rect.x
    const yrow = clientY - rect.y
    const x = xrow - radius
    const y = yrow - radius


    const distance = Math.sqrt(x * x + y * y);
    // const distance = Math.sqrt(x * x + y * y);

    if (distance > radius) return;
    
    // Position selector
    const angle = Math.atan2(y, x);  // угол в радианах

    selectorRef.current.style.top = `${yrow}px`;
    selectorRef.current.style.left = `${xrow}px`;
    
    // Calculate hue (0-360)
    const hue = (angle * 180 / Math.PI + 360) % 360;

    // Calculate saturation (100-0%) based on distance from center
    const saturation = Math.min(100, (distance / radius) * 100);
    
    const newColor = `hsl(${hue}, ${saturation}%, 50%)`;
    selectorRef.current.style.backgroundColor = newColor;
    onChange?.(hue.toFixed(0).toString(), saturation.toFixed(0).toString())
  },[])

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updateColor(e.clientX, e.clientY);
  };

  const handleClick = (e: React.MouseEvent) => {
    updateColor(e.clientX, e.clientY);
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(()=>{
    setColor()
  },[setColor])

  return (
      <div 
        ref={wheelRef}
        className="color-wheel"
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <div ref={selectorRef} className="selector" />
      </div>
  );
};

export default ColorWheel;