import { UserAuth, UserProfile } from './index';

export class User {
    public auth?: UserAuth
    public profile?: UserProfile
    public key?: string

    constructor() { 
        let newauth = new UserAuth();
        let newprofile = new UserProfile();
        this.setValues(newauth,newprofile);
        this.key = this.convertKey(newauth.email);        
    }
    newUser(auth:UserAuth):User {
        return <User> {
            auth: auth,
            profile: new UserProfile().newUser(auth.displayName),
            key: this.convertKey(auth.email)
        }
    }
    setValues(auth:UserAuth, profile:UserProfile) {
        this.auth = auth;
        this.profile = profile;
        this.key = this.convertKey(auth.email);                
    }
    setKey(key:string){ this.key = key; }
    convertKey(email:string){ return email.replace('@','at').replace('.','dot'); }
    setAuth(auth:UserAuth) { 
        this.auth = auth; 
    }
    setProfile(profile:UserProfile) { this.profile = profile; }
}




