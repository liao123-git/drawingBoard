class Data {
    constructor() {
        this.w = 0;
        this.h = 0;
        this.dom = $("#board");
        this.domBg = $(".contentBg");
        this.layers = $(".scroll ul");
        this.canvas = $(`#board_c`);
        this.restore = document.createElement("canvas");
        this.image = $(`#image`);
        this.color = "black";
        this.eraser = false;
        this.mouseCircule = false;
        this.mouseWidth = 20;
        this.text = "Lorem Ipsum";
        this.fontSize = 16;
        this.mousePos = {x: 0, y: 0};
        this.side = 3;
        this.ctrl = false;
    }
}
$(() => {
    window.data = new Data();
});