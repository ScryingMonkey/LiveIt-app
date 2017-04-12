export class UserProfile {
    public needInfo: boolean
    public displayName: string
    public userType: string // member or coach
    public userLevel: number
    public isCoach: boolean
    public students: Array<string>
    
    constructor(){
        this.needInfo = true;
        this.displayName = 'Dummy User';
        this.userType = 'dummy';
        this.userLevel = 0;
        this.isCoach = false;
        this.students = [];
    }
    newUserProfile(name:string):UserProfile {
        let nprofile = new UserProfile();
        nprofile.setValues(true,name,'new',0,false,[]);
        return nprofile;
    }
    setValues(needInfo, displayName, userType, userLevel, isCoach, students) {
        displayName = displayName;
        userType = userType;
        userLevel = userLevel;
        needInfo = needInfo;
        isCoach = isCoach;
        students = students; 
    }
}