class Line {
    constructor(){
    }
    draw(ctx,startX,startY,x,y){
        ctx.beginPath();
        ctx.moveTo(startX,startY);
        ctx.lineTo(x,y);
        ctx.stroke();
        ctx.closePath();
    }
}