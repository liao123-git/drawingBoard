class Pen {
    constructor(ctx,startX,startY,color){
        this.points = [];
        this.ctx = ctx;
        this.startX = startX;
        this.startY = startY;
        this.color = color;
        this.state = true;
        this.init = true;
        this.point = false;
        main.pen = true;
    }
    update(x,y){
        this.points[0] = {x:this.startX,y:this.startY};
        this.points[1] = {x:this.startX,y};
        this.points[2] = {x,y:this.startY};
        this.points[3] = {x,y};
    }
    draw(x = false, y = false){
        if(this.init) this.update(x,y);
        this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.points[0].x,this.points[0].y);
        this.ctx.bezierCurveTo(this.points[1].x,this.points[1].y,this.points[2].x,this.points[2].y,this.points[3].x,this.points[3].y);
        this.ctx.stroke();
        if(!this.state) return;
        this.points.forEach((v)=>{
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(v.x,v.y,5,0,Math.PI*2,true);
            this.ctx.fill();
            this.ctx.stroke();
        });
    }
    setEvent(){
        this.init = false;
        data.canvas[0].onmousedown = ()=>{
            console.log(123);
            let click = false;
            this.points.forEach((v,k)=>{
                this.ctx.beginPath();
                this.ctx.arc(v.x,v.y,5,0,Math.PI*2,true);

                if(this.ctx.isPointInPath(event.layerX,event.layerY)){
                    layers.saveLayers();
                    v.x = event.layerX;
                    v.y = event.layerY;
                    this.point = k;
                    click = true;
                    main.pen = true;
                }
            });
            if(!click){
                this.state = false;
                this.draw();
                layers.drawLayers();
            }
        };
        data.canvas[0].onmousemove = ()=>{
            if(this.point===false) return;
            this.points[this.point].x = event.layerX;
            this.points[this.point].y = event.layerY;
            main.pen = true;
            this.draw();
            layers.drawLayers();
        };
        data.canvas[0].onmouseup = ()=>{
            this.point = false;
        };
    }
    changeState(){
    }
}