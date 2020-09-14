class Polygon {
    constructor(side,centerX,centerY){
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.centerX = centerX;
        this.centerY = centerY;
        this.side = side;
        this.ctx = false;
        this.state = false;
        this.angle = false;
        this.points = [];
    }
    draw(ctx,x,y,w){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.w = w;
        this.points = this.getPoints(Math.abs(w));
        this.ctx = ctx;
        ctx.beginPath();
        for (let i = 0;i<this.points.length;i++){
            let point = this.points[i];
            if(!i) ctx.moveTo(point[0],point[1]);
            ctx.lineTo(point[0],point[1]);
        }
        ctx.closePath();
        if(main.stroke) ctx.stroke();
        else ctx.fill();
    }
    getPoints(r){
        let angle = Math.PI,
            points = [];
        angle -= this.angle?this.angle:0;
        for (let i=0;i<this.side;i++){
            points.push([this.centerX+r*Math.sin(angle),this.centerY+r*Math.cos(angle)]);
            angle += 2*Math.PI/this.side;
        }
        return points;
    }
    setEvent() {
        main.pen = true;
        data.canvas[0].onmousedown = ()=>{
            this.points = this.getPoints(Math.abs(this.w));
            this.ctx.beginPath();
            for (let i = 0;i<this.points.length;i++){
                let point = this.points[i];
                if(!i) this.ctx.moveTo(point[0],point[1]);
                this.ctx.lineTo(point[0],point[1]);
            }
            if(this.ctx.isPointInPath(event.layerX,event.layerY)){
                this.ctx.save();
                this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
                this.drawDegreeOuterDial();
                this.ctx.fillStyle = 'rgba(100, 140, 230, .3)';
                this.ctx.fill();
                this.drawDegreeAnnotations();
                this.drawDegreeDialTicks();
                this.draw(this.ctx,this.x,this.y,this.w);
                this.state = true;
                main.pen = true;
                layers.drawLayers();
                this.ctx.restore();
            }else{
                main.pen = false;
                data.canvas.removeClass().addClass('crosshair');
                this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
                this.draw(this.ctx,this.x,this.y,this.w);
                layers.drawLayers();
            }
        };
        data.canvas[0].onmousemove = ()=>{
            if(!main.pen) return;
            data.canvas.removeClass();
            this.points = this.getPoints(Math.abs(this.w));
            this.ctx.beginPath();
            for (let i = 0;i<this.points.length;i++){
                let point = this.points[i];
                if(!i) this.ctx.moveTo(point[0],point[1]);
                this.ctx.lineTo(point[0],point[1]);
            }
            if(this.ctx.isPointInPath(event.layerX,event.layerY)) data.canvas.addClass('pointer');
            if(!this.state) return;
            this.angle = Math.atan((event.layerY - this.centerY) /
                (event.layerX - this.centerX));
            this.ctx.save();
            this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
            this.drawDegreeOuterDial();
            this.ctx.fillStyle = 'rgba(100, 140, 230, .3)';
            this.ctx.fill();
            this.drawDegreeAnnotations();
            this.drawDegreeDialTicks();
            this.draw(this.ctx,this.x,this.y,this.w);
            layers.drawLayers();
            this.ctx.restore();
        };
    }
    drawDegreeOuterDial() {
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.arc(this.centerX, this.centerY,
            this.w + 30,
            0, Math.PI*2, true);
    }

    drawDegreeAnnotations() {
        let radius = this.w + 15;
        this.ctx.beginPath();
        this.ctx.arc(this.centerX,this.centerY,radius+5,0,Math.PI*2);
        this.ctx.save();
        this.ctx.clip();
        this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);

        this.ctx.restore();
        this.ctx.save();
        this.ctx.fillStyle = "black";
        this.ctx.font = '10px Helvetica';

        for (let angle=0; angle < 2*Math.PI; angle += Math.PI/8) {
            this.ctx.beginPath();
            this.ctx.fillText((angle * 180 / Math.PI).toFixed(0),
                this.centerX + Math.cos(angle) * (radius - 20) - 7,
                this.centerY + Math.sin(angle) * (radius - 20) + 3);
        }
        this.ctx.restore();
    }
    drawDegreeDialTicks() {
        let radius = this.w + 20,
            ANGLE_MAX = 2*Math.PI,
            ANGLE_DELTA = Math.PI/64;

        this.ctx.save();

        for (let angle = 0, cnt = 0; angle < ANGLE_MAX; angle += ANGLE_DELTA, ++cnt) {
            this.ctx.beginPath();

            if (cnt % 4 === 0) {
                this.ctx.moveTo(this.centerX + Math.cos(angle) * (radius - 10),
                    this.centerY + Math.sin(angle) * (radius - 10));
                this.ctx.lineTo(this.centerX + Math.cos(angle) * (radius),
                    this.centerY + Math.sin(angle) * (radius));
                this.ctx.strokeStyle = "black";
                this.ctx.stroke();
            }
            else {
                this.ctx.moveTo(this.centerX + Math.cos(angle) * (radius - 10/2),
                    this.centerY + Math.sin(angle) * (radius - 10/2));
                this.ctx.lineTo(this.centerX + Math.cos(angle) * (radius),
                    this.centerY + Math.sin(angle) * (radius));
                this.ctx.strokeStyle = "black";
                this.ctx.stroke();
            }

            this.ctx.restore();
        }
    }
}