export class UserProfile {
    public needInfo: boolean
    public displayName: string
    public userType: string // member or coach
    public userLevel: number
    
    constructor(){
        this.needInfo = false;
        this.displayName = '';
        this.userType = '';
        this.userLevel = 0;
    }
    setValues(needInfo, displayName, userType, userLevel) {
        displayName = displayName;
        userType = userType;
        userLevel = userLevel;
        needInfo = needInfo;
    }
}