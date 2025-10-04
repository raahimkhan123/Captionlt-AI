
import { useState, useEffect } from 'react';

export const useTypewriter = <T,>(text: T, speed: number = 50): T => {
  const [displayText, setDisplayText] = useState<T>(('' as T));

  useEffect(() => {
    if (typeof text !== 'string') {
      setDisplayText(text);
      return;
    }

    setDisplayText('' as T);
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(prevText => (prevText + text.charAt(i)) as T);
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, speed]);

  return displayText;
};
