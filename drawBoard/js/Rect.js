class Rect {
    constructor(){
    }
    draw(ctx,x,y,w,h,stroke = false){
        if(stroke) ctx.strokeRect(x,y,w,h);
        else ctx.fillRect(x,y,w,h);
    }
}