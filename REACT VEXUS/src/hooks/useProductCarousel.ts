import { useState, useRef, useCallback, useEffect } from 'react';

export const useProductCarousel = (itemWidth = 320) => {
  const scrollRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollButtons = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -itemWidth : itemWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      setTimeout(() => {
        updateScrollButtons();
      }, 300);
    }
  }, [itemWidth, updateScrollButtons]);

  // Auto-update scroll buttons on resize
  useEffect(() => {
    const handleResize = () => updateScrollButtons();
    window.addEventListener('resize', handleResize);
    
    // Initial check
    setTimeout(updateScrollButtons, 100);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [updateScrollButtons]);

  return {
    scrollRef,
    canScrollLeft,
    canScrollRight,
    scroll,
    updateScrollButtons
  };
}; 