import { useRef, useEffect } from "react";

const useCanvas = (draw: Function) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) {
      return;
    }
    const context = canvas.getContext("2d");
    if (context == null) {
      return;
    }

    draw(context, canvas.width, canvas.height);
  }, [draw]);

  return canvasRef;
};

export default useCanvas;
