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
        //三次方贝塞尔曲线的四个点，我的钢笔的顺序是左上，左下，右上，右下
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

        //如果再编辑状态下需要画出四个操作点
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
        data.canvas.addClass("pointer");
        this.init = false;
        data.canvas[0].onmousedown = ()=>{
            if(!this.state) return;
            this.points.forEach((v,k)=>{
                this.ctx.beginPath();
                this.ctx.arc(v.x,v.y,5,0,Math.PI*2,true);

                if(this.ctx.isPointInPath(event.layerX,event.layerY)){
                    layers.saveLayers();
                    v.x = event.layerX;
                    v.y = event.layerY;
                    this.point = k;
                    main.pen = true;
                }
            });
            if(!main.pen){
                data.canvas.removeClass();
                this.state = false;
                this.draw();
                layers.drawLayers();
            }
        };
        data.canvas[0].onmousemove = ()=>{
            if(this.point===false||!this.state) return;
            this.points[this.point].x = event.layerX;
            this.points[this.point].y = event.layerY;
            main.pen = true;
            this.draw();
            layers.drawLayers();
        };
        data.canvas[0].onmouseup = ()=>{
            if(this.state) this.point = false;
        };
    }
}