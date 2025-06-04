import { useState } from 'react';

interface RatingProps {
  contentId: string;
  contentType?: 'article' | 'evidence';
  initialRating?: number;
}

export default function RatingComponent({ contentId, contentType = 'article', initialRating = 0 }: RatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [submitted, setSubmitted] = useState(false);
  
  const handleRate = async (value: number) => {
    try {
      setRating(value);
      const response = await fetch('http://localhost:3001/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId,
          contentType,
          value
        }),
      });
      
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (error) {
      console.error('Rating failed:', error);
    }
  };
  
  return (
    <div className="rating-container">
      <div className="stars">
        {[1, 2, 3, 4, 5].map(star => (
          <button 
            key={star}
            className={star <= rating ? 'star active' : 'star'}
            onClick={() => handleRate(star)}
          >
            ★
          </button>
        ))}
      </div>
      {submitted && <div className="feedback">Thanks for rating!</div>}
    </div>
  );
}