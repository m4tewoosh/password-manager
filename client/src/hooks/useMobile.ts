import { useState, useEffect } from 'react';
import { debounce } from 'utils/debounce';

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      console.log('checkIfMobile');
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();

    const debouncedCheckIfMobile = debounce(checkIfMobile, 150);

    window.addEventListener('resize', debouncedCheckIfMobile);

    return () => {
      window.removeEventListener('resize', debouncedCheckIfMobile);
    };
  }, []);

  return isMobile;
};

export default useMobile;
