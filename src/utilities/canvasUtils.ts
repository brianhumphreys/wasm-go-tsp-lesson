import { Pos } from "../types";

export const clearCanvas = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "#FFFDD0";
  ctx.fillRect(0, 0, width, height);
};

export const findPos = (obj: HTMLElement): Pos | undefined => {
  var curleft = 0,
    curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
      // @ts-ignore
    } while ((obj = obj.offsetParent));
    return { x: curleft, y: curtop };
  }
  return undefined;
};

export const drawPoint = (
  ctx: CanvasRenderingContext2D,
  xCenter: number,
  yCenter: number
) => {
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(xCenter, yCenter, 5, 0, 2 * Math.PI);
  ctx.fill();
};
