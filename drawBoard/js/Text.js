class Text {
    constructor(){
    }
    draw(ctx,x,y,size,text,color){
        ctx.font = `${size}px century`;
        ctx.fillStyle = color;
        ctx.fillText(text,x,y);
    }
}