import { useEffect, useState } from "react";

/**
 * @description 창 드래그 이동 / 리사이즈 상태를 관리하는 커스텀 훅.
 * JSX 없이 로직·상태만 다루므로 컴포넌트가 아닌 hook(`src/hooks/`)으로 둡니다.
 * (구 components/Layout/WindowControl.tsx 를 훅으로 변환)
 *
 * @example
 * const { position, windowSize, onMouseDown, onMouseMove, onMouseUp } = useWindowControl();
 */
export function useWindowControl() {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseDown = (e: { clientX: number; clientY: number }) => {
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    setIsDragging(true);
  };

  const onMouseMove = (e: { clientX: number; clientY: number }) => {
    if (isDragging) {
      const x = e.clientX - offset.x;
      const y = e.clientY - offset.y;
      setPosition({ x, y });
    }
  };

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { isDragging, position, windowSize, onMouseDown, onMouseMove, onMouseUp };
}

export default useWindowControl;
