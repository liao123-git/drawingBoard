class Layers {
    constructor(){
        this.num = 0;//图层的序号
        this.layers = new Map();//所有图层
        this.nowLayers = new Map();//选中的图层
        this.backup = [];//撤回的数组
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
        //必须要有图层
        if([...this.layers].length<1) return;
        //循环删除选中的图层
        this.nowLayers.forEach((v,k)=>{
            this.layers.delete(k);
            v.dom.remove();
        });
        this.nowLayers = new Map();
    }
    activeLayer(num,checkbox = false){
        let layer = this.layers.get(num);
        if(this.nowLayers.has(num)){//判断当前图层是否选中
            //取消选中
            this.inactiveLayer(num);
        }else{
            if(!checkbox){//当前是否为多选的情况
                //取消选中所有图层
                this.nowLayers.forEach((v,k)=>{
                    this.inactiveLayer(k);
                });
            }

            //选中图层
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
        if(main.magnifier&&main.magnifier.state)  main.magnifier.changeCanvas();
        if(main.gridState) main.grid.draw();
        if(data.eraser) this.drawMouse();
    }
    addEraser(x,y){
        //选中两个或以上的图层时，无法使用橡皮擦
        if([...this.nowLayers].length>1) return;

        //调用当前选中的图层的橡皮擦方法
        this.nowLayers.forEach((v,k)=>{
            let layer = this.layers.get(k);
            layer.addEraser(x,y);
        });
    }
    drawMouse(){
        //橡皮擦工具的笔刷
        let x = data.mousePos.x;
        let y = data.mousePos.y;
        let w = data.mouseWidth;
        let ctx = data.canvas[0].getContext('2d');
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        if(data.mouseCircule) ctx.arc(x,y,w/2,0,Math.PI*2,false);
        else ctx.rect(x-w/2,y-w/2,w,w);
        ctx.stroke();
        ctx.closePath();
    }
    showImage(){
        //更新缩略图
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
        //获取当前选中的图层
        let nowNum = this.getNow();

        //最大只能保存30步
        if(this.backup.length>=30) this.backup.unshift();

        //保存图层信息和对应的键名
        this.backup.push(nowNum);
        this.layers.get(nowNum).saveLayer();
    }
    revoke(){
        //之前必须要有操作步骤
        if(!this.backup.length) return;
        let k = this.backup.pop();

        //没有这个键值可能是被删除了，就直接越过这个
        if(!this.layers.has(k)) return this.revoke();
        this.layers.get(k).revoke();

        //切换选中的图层
        let num = this.backup.length-1>=0?this.backup[this.backup.length-1]:1;
        if(this.getNow()!==num) this.activeLayer(num);

        this.drawLayers();
        this.layers.get(k).saveImage();

        //如果图层没有备份的信息了，就删除图层
        if(!this.layers.get(k).backup.length&&k!==1){
            this.layers.get(k).dom.remove();
            this.layers.delete(k);
            main.pen = false;
        }
    }
    changePenState(){
        main.pen = false;
        this.layers.forEach((v)=>{
            if(v.category==="pen"&&v.graphical.state===true) v.pen();
        });
        layers.drawLayers();
    }
    intersection(){
        if([...this.nowLayers].length>=2){
            let show = new Map();
            if(main.intersection!=="source-in"){
                this.layers.forEach((v,k)=>{
                    show.set(k,v.show);
                    v.show = false;
                });
            }
            this.nowLayers.forEach((v,k)=>{
                v.intersection = true;
                v.show = true;
                this.layers.delete(k);
                this.layers.set(k,v);
            });
            this.drawLayers();
            let layer = document.createElement('canvas');
            layer.width = data.w;
            layer.height = data.h;
            layer.getContext("2d").drawImage(data.canvas[0],0,0);
            this.nowLayers.forEach((v,k)=>{
                if(layer){
                    v.layer.getContext("2d").clearRect(0,0,v.layer.width,v.layer.height);
                    v.layer.getContext("2d").drawImage(layer,0,0);
                    layer = false;
                    v.intersection = false;
                }else{
                    this.layers.delete(k);
                    this.nowLayers.delete(k);
                }
            });
            if(main.intersection!=="source-in") {
                this.layers.forEach((v, k) => {
                    v.show = show.get(k);
                });
            }
            this.drawLayers();
        }
    }
    export(){
        let mState = main.magnifier.state;
        let gState = main.gridState;
        let eState = data.eraser;
        main.magnifier.state = false;
        main.gridState = false;
        data.eraser = false;
        this.changePenState();
        this.drawLayers();
        main.magnifier.state = mState;
        main.gridState = gState;
        data.eraser = eState;
        data.canvas[0].toBlob((blob) => {
            let url = URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.download = "Image";
            a.href = url;
            a.click();
            URL.revokeObjectURL(a.href);
            this.drawLayers();
        },'image/png',1);
    }
}
