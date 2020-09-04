class Data {
    constructor(){
        this.w = 0;
        this.h = 0;
        this.dom = $("#board");
        this.domBg = $(".contentBg");
        this.layers = $(".scroll ul");
        this.canvas = $(`#board_c`);
        this.image = $(`#image`);
        this.color = "black";
    }
}
$(()=>{
    window.data = new Data();
});