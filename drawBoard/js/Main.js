class Main {
    constructor() {
        this.position = false;
        this.category = false;
        this.stroke = false;
        this.grid = new Grid(10);
        this.gridState = false;
        this.intersection = "source-over";
        this.pen = false;
        this.revoke = true;
        this.stateList = [];
        this.magnifier = null;
        this.init();
    }

    init() {
        this.createStateList();
        //表单提交创建画布
        let that = this;
        $("#createContent").submit(function (e) {

            //获取提交的值
            e.preventDefault();
            $(this).serializeArray().forEach((v) => {
                if (v.name === 'width') data.w = parseInt(v.value);
                else if (v.name === 'height') data.h = parseInt(v.value);
            });

            //改变画布容器的宽高
            that.updateCanvas();
            $('.createContent').hide();

            that.magnifier = new Magnifier();

            //创建一个原始图层
            let layer = new Layer({
                startX: 0,
                startY: 0,
                x: data.w,
                y: data.h,
                color: 'white',
                stroke: false,
                category: 'rect',
            });
            layers.drawLayers();
            layer.saveImage();//显示缩略图

            //调用其他函数
            that.update();//更新、监听元素
            that.setEvent();//点击事件
            that.mouseEvent();//鼠标事件
        });
    }

    createStateList(){
        //方便之后切换工具
        let stroke = $(".stroke");
        let intersection = $(".intersection");
        this.stateList = [
            {
                category:"line",
                hover:"crosshair",
                dom:[],
            },
            {
                category:"pen",
                hover:"crosshair",
                dom:[],
            },
            {
                category:"magnifier",
                hover:"crosshair",
                dom:[$("#restore")],
                callback: ()=>{
                    let ctx = data.restore.getContext("2d");
                    ctx.clearRect(0,0,data.restore.width,data.restore.height);
                    ctx.drawImage(data.canvas[0],0,0);
                }
            },
            {
                category:"circular",
                hover:"crosshair",
                dom:[stroke,intersection],
            },
            {
                category:"rect",
                hover:"crosshair",
                dom:[stroke,intersection],
            },
            {
                category:"polygon",
                hover:"crosshair",
                dom:[stroke,$(".side"),intersection],
            },
            {
                category:"text",
                hover:"text",
                dom:[$(".font_size"),$(".text_content")],
            },
            {
                category:"eraser",
                hover:false,
                dom:[$(".circular_eraser"),$(".mouse")],
            }
        ]
    }

    updateCanvas() {

        //主画板
        data.canvas[0].width = data.w;
        data.canvas[0].height = data.h;

        //缩略图的canvas
        data.image[0].width = data.w;
        data.image[0].height = data.h;

        //备份的canvas
        data.restore.width = data.w;
        data.restore.height = data.h;

        //实现画板外面有一圈深色
        data.dom.css({
            width: `${data.w}px`,
            height: `${data.h}px`,
        });
        data.domBg.css({
            width: `${data.w + 400}px`,
            height: `${data.h + 400}px`,
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
        //放大镜还原
        $("#restore").click(()=>{
            let ctx = data.canvas[0].getContext("2d");
            ctx.drawImage(data.restore,0,0);
            this.magnifier.state = false;
        });
        //交集
        $("#intersection").change(function(){
            that.intersection = $(this).val();
        });
        //导出
        $(".export").click(()=>{
            layers.export();
        });
        //各个工具
        $(".tools li:nth-last-child(n+2)").click(function () {
            that.activeTool($(this));
            if($(this)[0].id==="eraser") data.eraser = true;
            else data.eraser = false;
            layers.changePenState();
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
        $(window).keydown((e) => {
            console.log(e.keyCode);
            switch (e.keyCode) {
                case 17:
                    data.ctrl = true;
                    break;
                case 90://ctrl+z 撤回
                    if (data.ctrl && this.revoke) {
                        layers.revoke();

                        //解决长按的问题，松开后再次点击才生效
                        this.revoke = false;
                    }
                    break;
                case 186://ctrl+; 网格工具
                    if (data.ctrl) {
                        this.changeGridState();
                    }
                    break;
                case 76://l 直线工具
                    this.activeTool($("#line"));
                    break;
                case 82: //r 矩形工具
                    this.activeTool($("#rect"));
                    break;
                case 67://c 圆形工具
                    this.activeTool($("#circular"));
                    break;
                case 80://p 钢笔工具
                    this.activeTool($("#pen"));
                    break;
                case 85: //r 矩形工具
                    this.activeTool($("#polygon"));
                    break;
                case 77: //m 橡皮擦工具
                    this.activeTool($("#magnifier"));
                    break;
            }
        });
        $(window).keyup((e) => {
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

        //鼠标点击
        data.canvas.mousedown(() => {

            //必须要选择一个工具
            if (!this.category) return;

            //如果当前是钢笔的编辑状态就改变钢笔的状态，并结束
            if (this.pen) return this.pen = false;

            //获取当前鼠标位置
            this.position = {x: event.layerX, y: event.layerY};

            //复用的回调，用的工具有：直线工具，矩形工具，圆形工具，文字工具，多边形工具
            let callback = () => {
                layer = new Layer({
                    startX: this.position.x,
                    startY: this.position.y,
                    color: data.color,
                    stroke: this.stroke,
                    category: this.category,
                });
                layers.saveLayers();
            };

            //工具的筛选
            tools.switchState(this.category , callback, () => {
                //橡皮擦工具，必须有选中的图层
                if (!layers.getNow()) return;

                //添加清空的区域
                layers.addEraser(this.position.x, this.position.y);

                //保存清空区域前的画布信息
                layers.saveLayers();
            },()=>{
                this.magnifier.changeXY(this.position.x,this.position.y,event.layerX,event.layerY);
            });
        });

        //鼠标移动
        data.canvas.mousemove(() => {
            let x = event.layerX;
            let y = event.layerY;

            //更新鼠标的坐标
            this.followMouse(x, y);

            if (this.category&&this.position) {
                tools.switchState(this.category, () => {

                    //实现橡皮筋效果
                    layer.changeXY(x, y);
                }, () => {
                    if (!layers.getNow()) return;
                    layers.addEraser(x, y);
                },()=>{
                    this.magnifier.changeXY(this.position.x,this.position.y,event.layerX,event.layerY);
                });
            }
        });

        //鼠标松开
        data.canvas.mouseup(() => {
            if (!this.category||!this.position) return;
            let x = event.layerX;
            let y = event.layerY;
            tools.switchState(this.category, () => {
                if (this.category === "pen" || this.category === "polygon") {
                    //钢笔工具和多边形工具有自己的事件
                    layer.graphical.setEvent();
                    return;
                }
                if (x === this.position.x && y === this.position.y && this.category !== 'text') {
                    //如果只是点击了一下就把之前new出来的图层删除
                    layers.deleteLayers();
                    layers.deleteNum();
                }
                if(this.intersection!=="source-over"&&this.position) layers.intersection();
            },false,()=>{
                this.magnifier.changState();
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

    monitorWindow() {
        let board = $(".board");
        if (data.w + 400 > board.width() && data.h + 400 > board.height()) {
            data.domBg.removeClass('case2').removeClass('case3').addClass('case1');
        } else if (data.h + 400 > board.height()) {
            data.domBg.removeClass('case1').removeClass('case2').addClass('case3');
        } else {
            data.domBg.removeClass('case1').removeClass('case3').addClass('case2');
        }
    }

    update() {
        window.setInterval(() => {
            this.monitorWindow();//监听窗口变化
        }, 33);
    }

    changeGridState() {
        let dom = $(".grid");
        this.gridState = !this.gridState;
        if (this.gridState) {
            dom.find('.check').addClass('active');
        } else {
            dom.find('.check').removeClass('active');
        }
        layers.drawLayers();
    }

    activeTool(dom) {
        if (this.category === dom[0].id) {
            dom.removeClass('active').siblings().removeClass('active');
            return this.category = false;
        }
        this.category = dom[0].id;
        dom.addClass('active').siblings().removeClass('active');

        //切换工具，并改变相对应的html
        for (let i=0;i<this.stateList.length;i++){
            let item = this.stateList[i];

            //改变光标
            if(this.category===item.category){
                data.canvas.removeClass();
                if(item.hover){
                    data.canvas.addClass(item.hover);
                }
                if(item.callback){
                    item.callback();
                }
            }

            //改变状态栏
            for (let j=0;j<item.dom.length;j++){
                item.dom[j].hide();
            }
        }

        for (let i=0;i<this.stateList.length;i++){
            let item = this.stateList[i];
            for (let j=0;j<item.dom.length;j++){
                if(this.category===item.category) item.dom[j].show();
            }
        }
    }
}

$(() => {
    window.main = new Main();
    window.layers = new Layers();
});