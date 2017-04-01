export class UserAuth {
    public displayName:string
    public email:string
    public userHasPicture:any
    public photoURL?:string
    public providerId:string
    public uid: string 
    // public displayNameKey: string    
    // public emailKey: string
    // public photoURLKey:string
    // public providerIdKey:string
    // public uidKey: string
    

    constructor(){
        this.displayName = 'Dummy User';
        this.email = 'dummy@dummyprovider.com';
        this.userHasPicture = false;
        this.photoURL = 'http://png.clipart.me/graphics/thumbs/103/crash-test-dummy_103003187.jpg';
        this.providerId = 'dummyProvider';
        this.uid = 'dummy@dummyProvider';
        // this.emailKey = '';
        // this.photoURLKey = '';        
        // this.providerIdKey = '';
        // this.uidKey = '';
        // this.displayNameKey = '';
 
    }
    setValues(displayName, email, userHasPicture, photoURL, providerId, uid) {
        this.displayName = displayName;
        this.email = email;
        this.userHasPicture = userHasPicture;
        this.photoURL = photoURL;
        this.providerId = providerId;
        this.uid = uid;
        // this.emailKey = emailKey;
        // this.photoURLKey = photoURLKey;        
        // this.providerIdKey = providerIdKey;        
        // this.uidKey = uidKey;
        // this.displayNameKey = displayNameKey;
    }
}