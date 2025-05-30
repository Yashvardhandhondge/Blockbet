
import React, { useEffect, useRef } from 'react';
import QRCodeLib from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  className?: string;
}

const QRCode: React.FC<QRCodeProps> = ({
  value,
  size = 200,
  bgColor = '#ffffff',
  fgColor = '#000000',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      // Convert "transparent" to null which QRCode lib will handle correctly
      const backgroundColor = bgColor === 'transparent' ? null : bgColor;
      
      QRCodeLib.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          margin: 0,
          color: {
            dark: fgColor,
            light: backgroundColor || '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('Error generating QR code:', error);
        }
      );
    }
  }, [value, size, bgColor, fgColor]);

  return (
    <div className={className}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default QRCode;
