import { UserAuth, UserProfile } from './index';

export class User {
    public auth?: UserAuth
    public profile?: UserProfile

    constructor() {
        this.setDummyValues();
    }
    setValues(auth:UserAuth, profile:UserProfile) {
        this.auth = auth;
        this.profile = profile;
    }
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
        // console.log('...dummy auth:');
        // console.dir(newauth);

        let newprofile = new UserProfile();
        newprofile.setValues(false, 'Dummy User', 'Dummy', 0);
        // console.log('...dummy newprofile:');
        // console.dir(newprofile);

        this.setValues(newauth,newprofile);
        // console.log('...dummy user:');
        // console.dir(this);
    }
}




