class Circular {
    constructor(){
    }
    draw(ctx,x,y,r,stroke = false){
        ctx.beginPath();
        ctx.arc(x,y,r,0,Math.PI*2,true);
        if(stroke) ctx.stroke();
        else ctx.fill();
        ctx.closePath();
    }
}