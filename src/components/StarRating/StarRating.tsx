import { useState } from 'react';
import Star from './Star/Star.tsx';

/* 
placing it outside is a good practice as it does not change.
If we place it inside the component function, then everytime the component re-renders, it generates the object.  
*/
const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const starContainerStyle = {
  display: 'flex',
  gap: '4px',
};

export type StarRatingProps = {
  maxRating?: number;
  color?: string;
  size?: number;
  className?: string;
  messages?: string[];
  defaultRating?: number;
  onSetRating?: (rating: number) => void;
};

const StarRating = ({
  maxRating = 5,
  color = '#fcc419',
  size = 48,
  className = '',
  messages = [],
  defaultRating = 0,
  onSetRating,
}: StarRatingProps) => {
  const textStyle = {
    lineHeight: '1',
    margin: '0',
    color,
    fontSize: `${size / 1.5}px`,
  };
  const [rating, setRating] = useState<number>(defaultRating);

  const [tempRating, setTempRating] = useState<number>(0);

  const handleRating = (rating: number) => {
    setRating(rating);
    if (onSetRating) {
      onSetRating(rating); // Ensure onSetRating exists before calling
    }
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            fullStar={
              tempRating ? tempRating >= i + 1 : i + 1 <= rating ? true : false
            }
            color={color}
            size={size}
            onRate={() => handleRating(i + 1)}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
          />
        ))}
      </div>
      <p style={textStyle}>
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1] !== undefined
            ? `(${tempRating || rating || ''}) ${
                messages[tempRating ? tempRating - 1 : rating - 1]
              } `
            : ''
          : tempRating || rating || ''}
      </p>
    </div>
  );
};

export default StarRating;
