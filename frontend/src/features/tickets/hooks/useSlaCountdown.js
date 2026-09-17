import { useEffect, useState } from 'react';

// En tu useSlaCountdown.js
export const useSlaCountdown = (slaDueAt) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [difference, setDifference] = useState(0); // <-- Añadido

  useEffect(() => {
    const calculateTime = () => {
      const targetDate = new Date(slaDueAt).getTime();
      const now = new Date().getTime();
      const diff = targetDate - now; // <-- Guardamos el valor real con signo

      setDifference(diff); // <-- Lo guardamos en el estado
      const expired = diff < 0;
      setIsExpired(expired);

      const absDifference = Math.abs(diff);
      const days = Math.floor(absDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((absDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((absDifference % (1000 * 60 * 60)) / (1000 * 60));

      let timeString = '';
      if (days > 0) timeString += `${days}d `;
      if (hours > 0) timeString += `${hours}h `;
      timeString += `${minutes}m`;

      setTimeLeft(expired ? `-${timeString}` : timeString);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000);
    return () => clearInterval(timer);
  }, [slaDueAt]);

  return { timeLeft, isExpired, difference }; // <-- Lo retornamos aquí
};