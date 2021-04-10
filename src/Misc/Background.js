export default class Background {
    constructor(color, isEmpty) {

        if (color !== null) {
            this.color = color;
            this.type = "Color";
        }
        if (isEmpty) {
            this.color = "#FFFFFFFF";
            this.type = "Empty";
        }
    }

    static FromColor(color) {
        return new Background(color)
    }

    static FromEmpty() {
        return new Background(null, true)
    }


    set Color(color) {
        this.color = color
    }

    get Color() {
        return this.color
    }
}