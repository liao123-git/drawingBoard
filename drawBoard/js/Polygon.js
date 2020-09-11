class Polygon {
    constructor(side,centerX,centerY){
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.centerX = centerX;
        this.centerY = centerY;
        this.side = side;
        this.state = false;
        this.points = [];
    }
    draw(ctx,x,y,w){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.w = w;
        this.points = this.getPoints(Math.abs(w));
        ctx.beginPath();
        for (let i = 0;i<this.points.length;i++){
            let point = this.points[i];
            if(!i) ctx.moveTo(point[0],point[1]);
            ctx.lineTo(point[0],point[1]);
        }
        ctx.closePath();
        ctx.fill();
    }
    getPoints(r){
        let angle = Math.PI,
            points = [];
        for (let i=0;i<this.side;i++){
            points.push([this.centerX+r*Math.sin(angle),this.centerY+r*Math.cos(angle)]);
            angle += 2*Math.PI/this.side;
        }
        return points;
    }
    setEvent(){
        /*main.pen = true;
        data.canvas[0].onmousedown = ()=>{
            this.ctx.beginPath();
            this.points.forEach((point,k)=>{
                if(!k) this.ctx.moveTo(point[0],point[1]);
                this.ctx.lineTo(point[0],point[1]);
            });
            if(this.ctx.isPointInPath(event.layerX,event.layerY)){
                main.pen = true;
            }
        };*/
    }
}