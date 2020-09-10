class Main {
    constructor() {
        this.position = false;
        this.state = false;
        this.stroke = false;
        this.grid = new Grid(10);
        this.gridState = false;
        this.pen = false;
        this.revoke = true;
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
            that.updateCanvas();
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
        //删除图层
        $("#delete").click(() => {
            layers.deleteLayers();
            layers.drawLayers();
        });
        //颜色拾取
        $("#color").change(function () {
            data.color = $(this).val();
        });
        //光标大小
        $("#followMouse").change(function () {
            data.mouseWidth = parseInt($(this).val());
        });
        //文字内容
        $("#text_content").change(function () {
            data.text = $(this).val();
        });
        //文字大小
        $("#font_size").change(function () {
            data.fontSize = parseInt($(this).val());
        });
        //多边形边数
        $("#side").change(function () {
            data.side = parseInt($(this).val());
        });
        //网格工具
        $(".grid").click(function () {
            that.changeGridState();
        });
        //各个工具
        $(".tools li:nth-last-child(n+2)").click(function () {
            that.activeTool($(this));
        });
        //是否描边
        $(".stroke").click(function () {
            that.stroke = !that.stroke;
            if (that.stroke) {
                $(this).find('.check').addClass('active');
            } else {
                $(this).find('.check').removeClass('active');
            }
        });
        //画笔圆角
        $(".circular_eraser").click(function () {
            data.mouseCircule = !data.mouseCircule;
            if (data.mouseCircule) {
                $(this).find('.check').addClass('active');
            } else {
                $(this).find('.check').removeClass('active');
            }
        });
        //快捷键
        $(window).keydown((e)=>{
            console.log(e.keyCode);
            switch (e.keyCode) {
                case 17:
                    data.ctrl = true;
                    break;
                case 90:
                    if(data.ctrl&&this.revoke){
                        layers.revoke();
                        this.revoke = false;
                    }
                    break;
                case 186:
                    if(data.ctrl){
                        this.changeGridState();
                    }
                    break;
                case 76:
                    this.activeTool($("#line"));
                    break;
                case 85:
                    this.activeTool($("#rect"));
                    break;
                case 67:
                    this.activeTool($("#circular"));
                    break;
                case 80:
                    this.activeTool($("#pen"));
                    break;
            }
        });
        $(window).keyup((e)=>{
            switch (e.keyCode) {
                case 17:
                    data.ctrl = false;
                    break;
                case 90:
                    this.revoke = true;
                    break;
            }
        });
    }

    mouseEvent() {
        let layer = false;
        let graphical = false;
        data.canvas.mousedown(() => {
            if (!this.state) return;
            if(this.pen) return this.pen = false;
            this.position = {x: event.layerX, y: event.layerY};
            this.switchState(this.state, () => {
                layer = new Layer({
                    startX: this.position.x,
                    startY: this.position.y,
                    color: data.color,
                    stroke: this.stroke,
                    category: this.state,
                });
                layers.saveLayers();
            }, () => {
                if (!layers.getNow()) return;
                layers.addEraser(this.position.x, this.position.y);
                layers.saveLayers();
            },()=>{
                data.size += 10;
                data.h *= data.size/100;
                data.w *= data.size/100;
                this.updateCanvas();
                layers.drawLayers();
            });
            layers.drawLayers();
        });
        data.canvas.mousemove(() => {
            let x = event.layerX;
            let y = event.layerY;
            if (!this.state || !this.position) {
                this.followMouse(x, y, false);
            } else {
                this.switchState(this.state, () => {
                    layer.changeXY(x, y);
                }, () => {
                    if (!layers.getNow()) return;
                    layers.addEraser(x, y);
                });
                this.followMouse(x, y);
            }
        });
        data.canvas.mouseup(() => {
            if(!this.position) return;
            let x = event.layerX;
            let y = event.layerY;
            this.switchState(this.state, () => {
                if(this.state === "pen"||this.state === "polygon"){
                    layer.graphical.setEvent();
                    return;
                }
                if (x === this.position.x && y === this.position.y && this.state !== 'text') {
                    layers.deleteLayers();
                    layers.deleteNum();
                }
            });
            layers.showImage();
            this.position = false;
            layer = null;
            graphical = null;
        });
    }

    followMouse(x, y) {
        $("#x").html(x);
        $("#y").html(y);
        data.mousePos.x = x;
        data.mousePos.y = y;
        layers.drawLayers();
    }

    switchState(state, case1, case2, case3) {
        switch (state) {
            case "rect":
                if(case1) case1();
                break;
            case "line":
                if(case1) case1();
                break;
            case "circular":
                if(case1) case1();
                break;
            case "eraser":
                if(case2) case2();
                break;
            case "text":
                if(case1) case1();
                break;
            case "pen":
                if(case1) case1();
                break;
            case "magnifier":
                if(case3) case3();
                break;
            case "polygon":
                if(case1) case1();
                break;
        }
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
        let side = $(".side");
        $(".layers").css('max-height', `${$(window).height() - 45}px`);
        this.switchState(this.state,()=>{
            stroke.show();
            if(this.state==="text"){
                data.canvas.removeClass('crosshair');
                this.textHtml();
                stroke.hide();
                return;
            }
            this.textHtml(false);
            data.canvas.addClass('crosshair');
            if(this.state!=="pen"){
                layers.changePenState();
            }else{
                if(this.pen) data.canvas.removeClass('crosshair');
                stroke.hide();
            }
            side.hide();
            if(this.state==="polygon") side.show();
            data.canvas.removeClass('zoom-in');
            this.openEraser(false);
        },()=>{
            side.hide();
            stroke.hide();
            data.canvas.removeClass('crosshair');
            data.canvas.removeClass('zoom-in');
            this.textHtml(false);
            this.openEraser();
            layers.changePenState();
        },()=>{
            side.hide();
            data.eraser = false;
            this.openEraser(false);
            data.canvas.addClass('zoom-in');
        });
    }

    textHtml(show = true){
        if(show){
            $("#board_c").addClass('text');
            $(".font_size").show();
            $(".text_content").show();
        }else{
            $("#board_c").removeClass('text');
            $(".font_size").hide();
            $(".text_content").hide();
        }
    }

    updateCanvas(){
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
    }

    openEraser(open = true){
        let mouse = $(".mouse");
        let circular = $(".circular_eraser");
        if(open){
            data.eraser = true;
            mouse.show();
            circular.show();
        }else{
            data.eraser = false;
            mouse.hide();
            circular.hide();
        }
    }

    changeGridState(){
        let dom = $(".grid");
        this.gridState = !this.gridState;
        if (this.gridState) {
            dom.find('.check').addClass('active');
        } else {
            dom.find('.check').removeClass('active');
        }
        layers.drawLayers();
    }

    activeTool(dom){
        if (this.state === dom[0].id) {
            dom.removeClass('active').siblings().removeClass('active');
            return this.state = false;
        }
        this.state = dom[0].id;
        dom.addClass('active').siblings().removeClass('active');
    }
}

$(() => {
    window.main = new Main();
    window.layers = new Layers();
});