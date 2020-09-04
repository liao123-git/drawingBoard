class Main {
    constructor() {
        this.position = false;
        this.state = false;
        this.stroke = false;
        this.init();
    }

    init() {
        this.setEvent();
    }

    setEvent() {
        let that = this;
        $("#createContent").submit(function (e) {
            e.preventDefault();
            $(this).serializeArray().forEach((v) => {
                if (v.name === 'width') data.w = parseInt(v.value);
                else if (v.name === 'height') data.h = parseInt(v.value);
            });
            data.dom.css({
                width: `${data.w}px`,
                height: `${data.h}px`,
            });
            data.canvas[0].width = data.w;
            data.canvas[0].height = data.h;
            data.image[0].width = data.w;
            data.image[0].height = data.h;
            data.domBg.css({
                width: `${data.w + 400}px`,
                height: `${data.h + 400}px`,
            });
            $('.createContent').hide();
            new Layer({
                startX:0,
                startY:0,
                x:data.canvas[0].width,
                y:data.canvas[0].height,
                color:'white',
                stroke:false,
                category:'rect',
            });
            that.update();
            that.mouseEvent();
        });
        /*$("#new").click(() => {
            new Layer();
        });*/
        $("#delete").click(() => {
            layers.deleteLayers();
        });
        $("#color").change(function(){
            data.color = $(this).val();
        });
        $(".tools li:nth-last-child(n+2)").click(function(){
            that.state = $(this)[0].id;
            $(this).addClass('active').siblings().removeClass('active');
        });
        $(".stroke").click(function(){
            that.stroke = !that.stroke;
            if(that.stroke){
                $(this).find('.check').addClass('active');
            }
            else {
                $(this).find('.check').removeClass('active');
            }
        })
    }

    mouseEvent(){
        let layer = null;
        let graphical = null;
        data.canvas.mousedown(()=>{
            if(!this.state) return;
            this.position = {x:event.layerX,y:event.layerY};
            layer = new Layer({
                startX:this.position.x,
                startY:this.position.y,
                color:data.color,
                stroke:this.stroke,
                category:this.state,
            });
        });
        data.canvas.mousemove(()=>{
            if(!this.position||!this.state) return;
            let x = event.layerX;
            let y = event.layerY;
            layer.changeXY(x,y);
            layers.drawLayers();
        });
        data.canvas.mouseup(()=>{
            let x = event.layerX;
            let y = event.layerY;
            if(x===this.position.x&&y===this.position.y){
                layers.deleteLayers();
                layers.deleteNum();
            }
            else{
                layers.showImage();
            }
            this.position = false;
            layer = null;
            graphical = null;
        });
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
        if (this.state) stroke.show();
        else stroke.hide();
        layers.drawLayers();
    }
}

$(() => {
    window.main = new Main();
    window.layers = new Layers();
});