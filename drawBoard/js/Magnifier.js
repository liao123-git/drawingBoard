class Magnifier {
    constructor(){
        this.data = {};
        this.drawData = {};
        this.show = false;
        this.state = false;
        this.dom = $("#mSelect");
    }
    draw(startX,startY,x,y){
        let top = startY<=y?startY:y;
        let left = startX<=x?startX:x;
        let width = this.drawData.w<0?startX-x:this.drawData.w;
        let height = this.drawData.h<0?startY-y:this.drawData.h;
        this.dom.css({
            top,
            left,
            display:"block",
            width,
            height,
        })
    }
    changeCanvas(){
        this.dom.hide();
        let x = this.data.w>=0 ? this.data.x : this.data.x + this.data.w;
        let y = this.data.h>=0 ? this.data.y : this.data.y + this.data.h;
        let ctx = data.canvas[0].getContext("2d");
        ctx.drawImage(data.canvas[0],x,y,Math.abs(this.data.w),Math.abs(this.data.h),0,0,ctx.canvas.width,ctx.canvas.height);
    }
    changeXY(startX,startY,x,y){
        this.drawData = {x:startX,y:startY,w:x-startX,h:y-startY};
        this.draw(startX,startY,x,y);
    }
    changState(){
        this.state = true;
        this.data = this.drawData;
    }
}