import { IPoint } from "../../model/point"

export const connectLine = (ctx: CanvasRenderingContext2D, point1: IPoint, point2: IPoint, text: string = "") => {
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.moveTo(point1.x, point1.y)
    let delta = (point1.x - point2.x) / Math.abs(point1.x - point2.x)
    let deltaY =  point2.y - point1.y
    let y12 = (deltaY > 80)?point2.y - 40:Math.abs((point1.y + point2.y)/2)
    ctx.quadraticCurveTo(point1.x, y12 - 5, point1.x, y12 - 5)
    ctx.quadraticCurveTo(point1.x, y12, point1.x - delta * 5 , y12)
    ctx.quadraticCurveTo(point2.x, y12, point2.x + delta * 5, y12)
    ctx.font = "14px serif";
    ctx.fillText(text, ((point1.x - delta * 5) + (point2.x + delta * 5))/2, y12 - 5);
    ctx.quadraticCurveTo(point2.x, y12, point2.x , y12 + 5)
    ctx.quadraticCurveTo(point2.x, point2.y, point2.x, point2.y)
    ctx.stroke()
}