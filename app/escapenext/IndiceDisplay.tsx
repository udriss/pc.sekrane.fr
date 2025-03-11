import React, { useEffect, useState } from 'react';

interface IndiceDisplayProps {
  scoreS: number;
  scoreC: number;
  scoreR: number;
}

const IndiceDisplay: React.FC<IndiceDisplayProps> = ({ scoreS, scoreC, scoreR }) => {
  const [unlockedCount, setUnlockedCount] = useState(0);
  console.log('scoreS:', scoreS);
  console.log('scoreC:', scoreC);
  console.log('scoreR:', scoreR);
  useEffect(() => {
    let count = 0;
    if (scoreS > 1 && scoreC > 1 && scoreR > 1) count = 1;
    if (count >= 1 && scoreS > 2 && scoreC > 2 && scoreR > 2) count = 2;
    if (count >= 2 && scoreS > 5 && scoreC > 3 && scoreR > 3) count = 3;
    if (count >= 3 && scoreS > 5 && scoreC > 4 && scoreR > 3) count = 4;
    if (count >= 4 && scoreS > 7 && scoreC > 4 && scoreR > 3) count = 5;
    if (count >= 5 && scoreS > 9 && scoreC > 4 && scoreR > 3) count = 6;
    if (count >= 6 && scoreS > 9 && scoreC > 5 && scoreR > 4) count = 7;
    setUnlockedCount(count);
  }, [scoreS, scoreC, scoreR]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Indices Débloqués</h2>
      <div className="flex flex-wrap gap-4">
        {unlockedCount > 0 ? (
          Array.from({ length: unlockedCount }).map((_, index) => (
            <img
              key={index}
              src={`/api/indices?id=${index + 1}`}
              alt={`Indice ${index + 1}`}
              className="w-32 h-32 object-contain"
            />
          ))
        ) : (
          <p>Aucun indice débloqué pour l'instant.</p>
        )}
      </div>
    </div>
  );
};

export default IndiceDisplay;