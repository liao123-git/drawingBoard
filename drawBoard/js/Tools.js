class Tools {
    constructor(){
    }
    switchState(category, case1, case2, case3) {
        switch (category) {
            case "rect":
                if (case1) case1();
                break;
            case "line":
                if (case1) case1();
                break;
            case "circular":
                if (case1) case1();
                break;
            case "eraser":
                if (case2) case2();
                break;
            case "text":
                if (case1) case1();
                break;
            case "pen":
                if (case1) case1();
                break;
            case "magnifier":
                if (case3) case3();
                break;
            case "polygon":
                if (case1) case1();
                break;
        }
    }
}
window.tools = new Tools();