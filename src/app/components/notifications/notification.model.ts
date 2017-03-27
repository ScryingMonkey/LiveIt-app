export class Notification {
    public visible: boolean
    public type: string    
    public title: string
    public message: string
    constructor(visible, type, title, message){
        this.visible = visible;
        this.type = type;
        this.title = title;
        this.message = message;
    }
}