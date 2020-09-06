class Grid {
    constructor(w){
        this.w = w;
    }
    draw(){
        let ctx = data.canvas[0].getContext('2d');
        let length = data.h>data.w?data.h:data.w;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 0.5;
        for (let i=1;i<length/this.w;i++){
            this.drawHorizontalLine(ctx,i*this.w);
            this.drawVerticalLine(ctx,i*this.w);
        }
    }
    drawHorizontalLine(ctx,y){
        ctx.beginPath();
        ctx.moveTo(0,y+.5);
        ctx.lineTo(ctx.canvas.width,y+.5);
        ctx.stroke();
    }

    drawVerticalLine(ctx,x){
        ctx.beginPath();
        ctx.moveTo(x+.5,0);
        ctx.lineTo(x+.5,ctx.canvas.height);
        ctx.stroke();
    }
}