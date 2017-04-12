export class UserAuth {
    public displayName:string
    public email:string
    public userHasPicture:any
    public photoURL?:string
    public providerId:string
    public uid: string 

    constructor(){
        this.displayName = 'Dummy User';
        this.email = 'dummy@dummyprovider.com';
        this.userHasPicture = false;
        this.photoURL = 'http://png.clipart.me/graphics/thumbs/103/crash-test-dummy_103003187.jpg';
        this.providerId = 'dummyProvider';
        this.uid = 'dummy@dummyProvider'; 
    }
    setValues(displayName, email, photoURL, providerId, uid) {
        this.displayName = displayName;
        this.email = email;
        this.photoURL = photoURL;
        this.providerId = providerId;
        this.uid = uid;
        this.userHasPicture = photoURL != null;
    }
    createKey(){ return this.email.replace('@','AT').replace('.','DOT'); }
}