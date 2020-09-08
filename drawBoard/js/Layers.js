class Layers {
    constructor(){
        this.num = 0;
        this.length = 0;
        this.layers = new Map();
        this.nowLayers = new Map();
        this.backup = [];
    }
    addLayers(layer, num) {
        if (!this.layers.has(num)) this.layers.set(num, layer);
    }
    getNum() {
        return ++this.num;
    }
    deleteNum() {
        return --this.num;
    }
    deleteLayers(){
        if([...this.layers].length<=1) return;
        this.nowLayers.forEach((v,k)=>{
            this.layers.delete(k);
            v.dom.remove();
        });
        this.nowLayers = new Map();
    }
    activeLayer(num,checkbox = false){
        let layer = this.layers.get(num);
        if(this.nowLayers.has(num)){
            this.inactiveLayer(num);
        }else{
            if(!checkbox){
                this.nowLayers.forEach((v,k)=>{
                    this.inactiveLayer(k);
                });
            }
            this.nowLayers.set(num,layer);
            layer.dom.find('>div:last-child').addClass('active').siblings().removeClass('active');
        }
    }
    inactiveLayer(num){
        let layer = this.layers.get(num);
        this.nowLayers.delete(num);
        layer.dom.find('>div:last-child').removeClass('active');
    }
    drawLayers(){
        let ctx = data.canvas[0].getContext('2d');
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
        this.layers.forEach((v,k)=>{
            if(v.show){
                v.draw();
            }
        });
        if(main.gridState) main.grid.draw();
        this.drawMouse();
    }
    addEraser(x,y){
        this.nowLayers.forEach((v,k)=>{
            let layer = this.layers.get(k);
            layer.addEraser(x,y);
        });
    }
    drawMouse(){
        let x = data.mousePos.x;
        let y = data.mousePos.y;
        let w = data.mouseWidth;
        let ctx = data.canvas[0].getContext('2d');
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        if(data.eraser) ctx.arc(x,y,w/2,0,Math.PI*2,false);
        else ctx.rect(x-w/2,y-w/2,w,w);
        ctx.stroke();
        ctx.closePath();
    }
    showImage(){
        this.layers.forEach((v)=>{
            v.saveImage();
        });
    }
    getNow(){
        let num = false;
        this.nowLayers.forEach((v,k)=>{
            num = k;
        });
        return num;
    }
    saveLayers(){
        let nowNum = this.getNow();
        if(this.backup.length>=30) this.backup.unshift();
        this.backup.push(nowNum);
        this.layers.get(nowNum).saveLayer();
    }
    revoke(){
        if(!this.backup.length) return;
        let k = this.backup.pop();
        if(!this.layers.has(k)) return this.revoke();
        this.layers.get(k).revoke();
        this.activeLayer(this.backup.length-1>=0?this.backup[this.backup.length-1]:1);
        this.drawLayers(true);
        this.layers.get(k).saveImage();
        if(!this.layers.get(k).backup.length&&k!==1){
            this.layers.get(k).dom.remove();
            this.layers.delete(k);
        }
    }
    changePenState(){
        this.layers.forEach((v,k)=>{
            if(v.category==="pen"&&v.graphical.state) v.graphical.state = false;
        });
    }
}
