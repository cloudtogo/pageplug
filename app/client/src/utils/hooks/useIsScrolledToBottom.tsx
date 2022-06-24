import { useEffect, useState } from "react";

/**
 * Hook to get if the containerRef is scrolled to the bottom
 */
const useIsScrolledToBottom = (
  ref: React.RefObject<HTMLDivElement | null>,
  deps: any[] = [],
) => {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  useEffect(() => {
    const target = ref?.current;
    const calculateIsScrolledToBottom = (e: any) => {
      if (!e.target) return;
      const { offsetHeight, scrollHeight, scrollTop } = e.target;
      setIsScrolledToBottom(scrollHeight - (offsetHeight + scrollTop) < 10);
    };

    target?.addEventListener("scroll", calculateIsScrolledToBottom);
    calculateIsScrolledToBottom({ target });

    return () => {
      target?.removeEventListener("scroll", calculateIsScrolledToBottom);
    };
  }, [ref?.current, ...deps]);

  return isScrolledToBottom;
};

export default useIsScrolledToBottom;
