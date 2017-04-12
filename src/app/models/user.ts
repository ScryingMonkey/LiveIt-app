import { UserAuth, UserProfile } from './index';

export class User {
    public auth: UserAuth
    public profile: UserProfile
    public key?: string

    constructor() { 
        this.setValues(new UserAuth(), new UserProfile()); 
    }
    newUser():User {       
        let nuser = new User();
        nuser.setValues(new UserAuth(), new UserProfile());
        nuser.profile.userType = 'new';
        return nuser; 
    }
    setValues(auth:UserAuth, profile:UserProfile) {
        this.auth = auth;
        this.profile = profile;
        this.key = auth.createKey();           
    }
    setAuth(auth:UserAuth) { 
        this.auth = auth; 
        this.key = auth.createKey();
    }
    setProfile(profile:UserProfile) { 
        this.profile = profile; 
    }
}




