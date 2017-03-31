import { UserAuth, UserProfile } from './index';

export class User {
    public auth?: UserAuth
    public profile?: UserProfile
    public key?: string

    constructor() { 
        this.setDummyValues();
    }
    setValues(auth:UserAuth, profile:UserProfile) {
        this.auth = auth;
        this.profile = profile;
    }
    setKey(key:string){ this.key = key; }
    setAuth(auth:UserAuth) { this.auth = auth; }
    setProfile(profile:UserProfile) { this.profile = profile; }
    setDummyValues() {
        console.log('[ User.dummy() setting dummy values');
        let newauth = new UserAuth();
        newauth.setValues( 
                'dummy@dummyprovider.com',
                'email',
                true,
                "http://png.clipart.me/graphics/thumbs/103/crash-test-dummy_103003187.jpg",
                'photoURL',
                'dummyProvider',
                'providerId',
                'dummy@dummyProvider',
                'uid',
                'name'
            );
        let newprofile = new UserProfile();
        newprofile.setValues(true, 'Dummy User', 'Dummy', 0);
        this.setValues(newauth,newprofile);
        this.key = "";
    }
}




