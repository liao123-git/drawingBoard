class Layer {
    constructor(mes) {
        this.num = layers.getNum();//num会从1开始一直加
        this.ctx = data.canvas[0].getContext('2d');
        this.dom = $(`<li class="layer hover"><div class="watch"><div class="check active"></div></div><div><div class="show-layer"><img alt=""></div><span class="layer-name">Layer ${this.num}</span></div></li>`);//右侧图层列表的dom
        this.show = true;
        this.startX = mes.startX;
        this.startY = mes.startY;
        this.x = mes.x ? mes.x : mes.startX;
        this.y = mes.y ? mes.y : mes.startY;
        this.color = mes.color;
        this.stroke = mes.stroke;
        this.category = mes.category;
        this.graphical = null;//不同类型对应不同的图形
        this.layer = document.createElement('canvas');//这个图层的canvas
        this.layer.width = data.w;
        this.layer.height = data.h;
        this.eraser = false;
        this.layerInit = false;
        this.backup = [];
        this.init();
    }

    init(){
        layers.addLayers(this, this.num);
        this.changeDomStyle();//让缩略图的宽高比和主画板一致
        this.addHtml();
        this.setEvent();
        this.createGraphical();
    };

    changeDomStyle(){
        let w = data.h>data.w?30/data.h*data.w:30;
        let h = data.w>data.h?30/data.w*data.h:30;
        this.dom.find('.show-layer').css({
            width: w,
            height: h,
        });
    };

    addHtml(){
        data.layers.prepend(this.dom);
        layers.activeLayer(this.num);//选中图层
    };

    setEvent(){
        let that = this;

        //选中、取消选中图层
        this.dom.find('>div:last-child').click(() => {
            layers.activeLayer(this.num,data.ctrl);
        });

        //显示、隐藏图层
        this.dom.find('.watch').click(function () {
            that.show = !that.show;
            if (that.show)
                $(this).find('.check').addClass('active');
            else
                $(this).find('.check').removeClass('active');
            layers.drawLayers();
        });
    };

    createGraphical(){
        switch (this.category) {
            case 'rect':
                this.graphical = new Rect();
                break;
            case 'line':
                this.graphical = new Line();
                break;
            case 'circular':
                this.graphical = new Circular();
                break;
            case 'text':
                this.text = data.text;
                this.fontSize = data.fontSize;
                this.graphical = new Text();
                break;
            case 'pen':
                this.graphical = new Pen(this.layer.getContext('2d'),this.startX,this.startY,this.color);
                break;
            case 'polygon':
                this.graphical = new Polygon(data.side,this.startX,this.startY);
                break;
        }
    };

    draw(){
        let layer_ctx = this.layer.getContext('2d');
        if(!this.layerInit){//判断是否还在橡皮筋状态中
            //更新图形
            layer_ctx.clearRect(0,0,data.w,data.h);
            let w = this.x - this.startX;
            let h = this.y - this.startY;
            layer_ctx.fillStyle = this.color;
            layer_ctx.strokeStyle = this.color;
            switch (this.category) {
                case 'rect':
                    this.graphical.draw(layer_ctx, this.startX, this.startY, w, h, this.stroke);
                    break;
                case 'line':
                    this.graphical.draw(layer_ctx, this.startX, this.startY, this.x, this.y);
                    break;
                case 'circular':
                    this.graphical.draw(layer_ctx, this.startX, this.startY   , h===0 ? Math.abs(w) : Math.sqrt(Math.pow(h, 2) + Math.pow(w, 2)), this.stroke);
                    break;
                case 'text':
                    this.graphical.draw(layer_ctx, this.startX, this.startY, this.fontSize, this.text, this.color);
                    break;
                case 'pen':
                    this.graphical.draw(this.x, this.y);
                    break;
                case 'polygon':
                    this.graphical.draw(layer_ctx,this.x, this.y,w);
                    break;
            }
            this.layerInit = true;
        }else{
            if(this.eraser){
                //清空上次保存的区域
                let v = this.eraser;
                v.w = data.mouseWidth;
                layer_ctx.save();//保存状态
                layer_ctx.beginPath();
                if(data.mouseCircule) layer_ctx.arc(v.x,v.y,v.w/2,0,Math.PI*2,false);
                else layer_ctx.rect(v.x-v.w/2,v.y-v.w/2,v.w,v.w);
                layer_ctx.clip();//把编辑区域设为路径里
                layer_ctx.clearRect(0,0,data.w,data.h);
                layer_ctx.closePath();
                layer_ctx.restore();//还原状态，用了clip就要用这个，否则只能编辑设置的编辑区域
                this.eraser = false;
            }
        }
        if(this.show) this.ctx.drawImage(this.layer,0,0);
    };

    changeXY(x,y){
        this.x = x;
        this.y = y;
        this.layerInit = false;
    };

    saveImage(){
        this.layer.toBlob((blob) => {
            let url = URL.createObjectURL(blob);//base64
            this.dom.find('.show-layer>img').attr('src', url);
        },'image/png',1);
    };

    saveLayer(){
        //新建一个空的canvas来储存当前的画布信息
        let layer = document.createElement('canvas');
        layer.width = data.w;
        layer.height = data.h;
        let ctx = layer.getContext('2d');
        ctx.drawImage(this.layer,0,0);
        this.backup.push(layer);
    }

    revoke(){
        //把画布画成之前储存的canvas
        this.layer = document.createElement('canvas');
        this.layer.width = data.w;
        this.layer.height = data.h;
        let ctx = this.layer.getContext('2d');
        ctx.clearRect(0,0,this.layer.width,this.layer.height);
        ctx.drawImage(this.backup.pop(),0,0);
    }

    addEraser(x,y){
        //下次渲染画布的时候把这个区域清空
        this.eraser = {x, y};
    }
}
