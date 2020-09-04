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
        this.init();
    }

    init() {
        layers.addLayers(this, this.num);
        this.addHtml();
        this.setEvent();
        this.createGraphical();
        layers.showImage();
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
        this.dom.find('.check').click(function () {
            that.show = !that.show;
            console.log(123);
            if (that.show)
                $(this).addClass('active');
            else
                $(this).removeClass('active');
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

    draw(ctx = false) {
        ctx = ctx ? ctx : this.ctx;
        let w = this.x - this.startX;
        let h = this.y - this.startY;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        switch (this.category) {
            case 'rect':
                this.graphical.draw(ctx, this.startX, this.startY, w, h, this.stroke);
                break;
            case 'line':
                this.graphical.draw(ctx, this.startX, this.startY, this.x, this.y);
                break;
            case 'circular':
                this.graphical.draw(ctx, this.startX, this.startY, Math.abs(w) > Math.abs(h) ? Math.abs(w) : Math.abs(h), this.stroke);
                break;
        }
    }

    changeXY(x, y) {
        this.x = x;
        this.y = y;
    }

    saveImage(canvas) {
        canvas.toBlob((blob) => {
            let url = URL.createObjectURL(blob);
            this.dom.find('.show-layer>img').attr('src', url);
        });
    }
}