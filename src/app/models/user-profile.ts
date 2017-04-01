export class UserProfile {
    public needInfo: boolean
    public displayName: string
    public userType: string // member or coach
    public userLevel: number
    public isCoach: boolean
    public students?: Array<string>
    
    constructor(){
        this.needInfo = true;
        this.displayName = 'Dummy User';
        this.userType = 'new';
        this.userLevel = 0;
        this.isCoach = false;
        this.students = [];
    }
    newUser(name):UserProfile {
        return <UserProfile> {
            needInfo: true,
            displayName: name,
            userType: 'new',
            userLevel: 0,
            isCoach: false,
            students: []
        }
        // this.needInfo = true;
        // this.displayName = name;
        // this.userType = 'new';
        // this.userLevel = 0;
        // this.isCoach = false;
        // this.students = [];
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