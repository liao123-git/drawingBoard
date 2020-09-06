class Main {
    constructor() {
        this.position = false;
        this.state = false;
        this.stroke = false;
        this.grid = new Grid(10);
        this.gridState = false;
        this.init();
    }

    init() {
        let that = this;
        $("#createContent").submit(function (e) {
            e.preventDefault();
            $(this).serializeArray().forEach((v) => {
                if (v.name === 'width') data.w = parseInt(v.value);
                else if (v.name === 'height') data.h = parseInt(v.value);
            });
            data.canvas[0].width = data.w;
            data.canvas[0].height = data.h;
            data.image[0].width = data.w;
            data.image[0].height = data.h;
            data.dom.css({
                width: `${data.w}px`,
                height: `${data.h}px`,
            });
            data.domBg.css({
                width: `${data.w + 400}px`,
                height: `${data.h + 400}px`,
            });
            $('.createContent').hide();
            let layer = new Layer({
                startX: 0,
                startY: 0,
                x: data.w,
                y: data.h,
                color: 'white',
                stroke: false,
                category: 'rect',
            });
            that.update();
            that.setEvent();
            that.mouseEvent();
            layers.drawLayers();
            layer.saveImage();
        });
    }

    setEvent() {
        let that = this;
        /*$("#new").click(() => {
            new Layer();
        });*/
        $("#delete").click(() => {
            layers.deleteLayers();
        });
        $("#color").change(function () {
            data.color = $(this).val();
        });
        $("#followMouse").change(function () {
            data.mouseWidth = parseInt($(this).val());
        });
        $(".grid").click(function () {
            that.gridState = !that.gridState;
            if (that.gridState) {
                $(this).find('.check').addClass('active');
            } else {
                $(this).find('.check').removeClass('active');
            }
        });
        $(".tools li:nth-last-child(n+2)").click(function () {
            if(that.state===$(this)[0].id){
                $(this).removeClass('active').siblings().removeClass('active');
                return that.state = false;
            }
            that.state = $(this)[0].id;
            $(this).addClass('active').siblings().removeClass('active');
        });
        $(".stroke").click(function () {
            that.stroke = !that.stroke;
            if (that.stroke) {
                $(this).find('.check').addClass('active');
            } else {
                $(this).find('.check').removeClass('active');
            }
        });
        $(".circular_eraser").click(function () {
            data.eraser = !data.eraser;
            if (data.eraser) {
                $(this).find('.check').addClass('active');
            } else {
                $(this).find('.check').removeClass('active');
            }
        });
    }

    mouseEvent() {
        let layer = false;
        let graphical = false;
        data.canvas.mousedown(() => {
            if (!this.state) return;
            this.position = {x: event.layerX, y: event.layerY};
            if(this.state==='rect'||this.state==='line'||this.state==='circular'){
                layer = new Layer({
                    startX: this.position.x,
                    startY: this.position.y,
                    color: data.color,
                    stroke: this.stroke,
                    category: this.state,
                });
            }if(this.state==='eraser') layers.addEraser(this.position.x,this.position.y);
        });
        data.canvas.mousemove(() => {
            let x = event.layerX;
            let y = event.layerY;
            if (!this.state||!this.position){
                this.followMouse(x,y,false);
            }else{
                if(this.state==='eraser') layers.addEraser(x,y);
                if(this.state==='rect'||this.state==='line'||this.state==='circular') layer.changeXY(x, y);
                this.followMouse(x,y);
            }
        });
        data.canvas.mouseup(() => {
            let x = event.layerX;
            let y = event.layerY;
            if (x === this.position.x && y === this.position.y) {
                if(this.state==='rect'||this.state==='line'||this.state==='circular') layers.deleteLayers();
                layers.deleteNum();
            }
            this.position = false;
            layer = null;
            graphical = null;
            layers.showImage();
        });
    }

    followMouse(x,y){
        $("#x").html(x);
        $("#y").html(y);
        data.mousePos.x = x;
        data.mousePos.y = y;
        layers.drawLayers();
    }

    monitorWindow() {
        let board = $(".board");
        if (data.w + 400 > board.width() && data.h + 400 > board.height())
            data.domBg.removeClass('case2').removeClass('case3').addClass('case1');
        else if (data.h + 400 > board.height())
            data.domBg.removeClass('case1').removeClass('case2').addClass('case3');
        else
            data.domBg.removeClass('case1').removeClass('case3').addClass('case2');
    }

    update() {
        window.setInterval(() => {
            this.monitorWindow();
            this.updateHtml();
        }, 33);
    }

    updateHtml() {
        let stroke = $(".stroke");
        if (this.state==='rect'||this.state==='line'||this.state==='circular') stroke.show();
        else stroke.hide();
    }
}

$(() => {
    window.main = new Main();
    window.layers = new Layers();
});