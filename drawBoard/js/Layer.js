class Layer {
    constructor(mes) {
        this.num = layers.getNum();
        this.ctx = data.canvas[0].getContext('2d');
        this.dom = $(`<li class="layer hover"><div class="watch"><div class="check active"></div></div><div><div class="show-layer"><img alt=""></div><span class="layer-name">Layer ${this.num}</span></div></li>`);
        this.show = true;
        this.startX = mes.startX;
        this.startY = mes.startY;
        this.x = mes.x ? mes.x : mes.startX;
        this.y = mes.y ? mes.y : mes.startY;
        this.color = mes.color;
        this.stroke = mes.stroke;
        this.category = mes.category;
        this.graphical = null;
        this.layer = document.createElement('canvas');
        this.layer.width = data.w;
        this.layer.height = data.h;
        this.eraser = false;
        this.layerInit = false;
        this.init();
    }

    init() {
        layers.addLayers(this, this.num);
        this.changeDomStyle();
        this.addHtml();
        this.setEvent();
        this.createGraphical();
    }

    addHtml() {
        data.layers.prepend(this.dom);
        layers.activeLayer(this.num);
    }

    setEvent() {
        let that = this;
        this.dom.find('>div:last-child').click(() => {
            layers.activeLayer(this.num);
        });
        this.dom.find('.watch').click(function () {
            that.show = !that.show;
            if (that.show)
                $(this).find('.check').addClass('active');
            else
                $(this).find('.check').removeClass('active');
        });
    }

    createGraphical() {
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
        }
    }

    draw() {
        let layer_ctx = this.layer.getContext('2d');
        if(!this.layerInit){
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
                    this.graphical.draw(layer_ctx, this.startX, this.startY, Math.abs(w) > Math.abs(h) ? Math.abs(w) : Math.abs(h), this.stroke);
                    break;
            }
            this.layerInit = true;
        }else{
            if(this.eraser){
                let v = this.eraser;
                v.w = data.mouseWidth;
                layer_ctx.save();
                layer_ctx.beginPath();
                if(data.eraser) layer_ctx.arc(v.x,v.y,v.w/2,0,Math.PI*2,false);
                else layer_ctx.rect(v.x-v.w/2,v.y-v.w/2,v.w,v.w);
                layer_ctx.clip();
                layer_ctx.clearRect(0,0,data.w,data.h);
                layer_ctx.closePath();
                layer_ctx.restore();
                this.eraser = false;
            }
        }
        this.ctx.drawImage(this.layer,0,0);
    }

    changeXY(x, y) {
        this.x = x;
        this.y = y;
        this.layerInit = false;
    }

    saveImage() {
        this.layer.toBlob((blob) => {
            let url = URL.createObjectURL(blob);
            this.dom.find('.show-layer>img').attr('src', url);
        },'image/png',1);
    }

    changeDomStyle(){
        let w = data.h>data.w?30/data.h*data.w:30;
        let h = data.w>data.h?30/data.w*data.h:30;
        this.dom.find('.show-layer').css({
            width: w,
            height: h,
        });
    }

    addEraser(x,y) {
        this.eraser = {x, y};
    }
}
