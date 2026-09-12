import React, { useState } from 'react';
import amilcoLogoSrc from '../assets/images/amilco_logo_1789177375461.jpg';

interface AmilcoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const AmilcoLogo: React.FC<AmilcoLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'h-8 max-w-[150px]',
    md: 'h-10 max-w-[190px]',
    lg: 'h-14 max-w-[260px]',
    xl: 'h-20 max-w-[340px]',
  };

  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <div className={`relative overflow-hidden rounded-md flex items-center justify-center ${sizeClasses[size]}`}>
        {!imageError ? (
          <img
            src={amilcoLogoSrc}
            alt="AMILCO Home Center"
            className="w-full h-full object-contain object-left drop-shadow-xs"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          /* High-precision SVG Vector recreation of the AMILCO Home Center logo */
          <svg
            viewBox="0 0 700 240"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left triangle */}
            <path d="M 0 240 L 210 0 L 350 240 Z" fill="#E20613" />
            {/* Right main red block */}
            <path d="M 225 0 L 700 0 L 700 240 L 365 240 Z" fill="#E20613" />
            {/* AMILCO Main Text */}
            <text
              x="360"
              y="160"
              textAnchor="middle"
              fontFamily="Impact, 'Arial Black', sans-serif"
              fontWeight="900"
              fontStyle="italic"
              fontSize="145"
              fill="#1F2421"
              stroke="#FFFFFF"
              strokeWidth="20"
              paintOrder="stroke fill"
              letterSpacing="2"
            >
              AMILCO
            </text>
            {/* HOME CENTER Subtitle */}
            <text
              x="530"
              y="222"
              textAnchor="middle"
              fontFamily="'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
              fontWeight="900"
              fontSize="48"
              fill="#FFFFFF"
              letterSpacing="3"
            >
              HOME CENTER
            </text>
          </svg>
        )}
      </div>

      {showSubtitle && (
        <span className="text-[10px] font-bold tracking-wider text-rose-700 uppercase mt-0.5">
          Home Center &bull; T.I
        </span>
      )}
    </div>
  );
};
