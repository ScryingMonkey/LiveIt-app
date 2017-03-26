export class UserAuth {
    public email:string
    public emailKey: string
    public userHasPicture:any
    public photoURL:string
    public photoURLKey:string
    public providerId:string
    public providerIdKey:string
    public uid: string
    public uidKey: string
    public displayNameKey: string

    constructor(){
        this.email = '';
        this.emailKey = '';
        this.userHasPicture = false;
        this.photoURL = '';
        this.photoURLKey = '';
        this.providerId = '';
        this.providerIdKey = '';
        this.uid = '';
        this.uidKey = '';
        this.displayNameKey = '';
    }
    setValues(email, emailKey, userHasPicture, photoURL, photoURLKey, providerId, providerIdKey, uid, uidKey, displayNameKey) {
        this.email = email;
        this.emailKey = emailKey;
        this.userHasPicture = userHasPicture;
        this.photoURL = photoURL;
        this.photoURLKey = photoURLKey;
        this.providerId = providerId;
        this.providerIdKey = providerIdKey;
        this.uid = uid;
        this.uidKey = uidKey;
        this.displayNameKey = displayNameKey;
    }
}