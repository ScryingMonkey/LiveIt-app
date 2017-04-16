export class UserProfile {
    public needInfo: boolean
    public displayName: string
    public userType: string // member or coach
    public userLevel: number
    public isCoach: boolean
    public students: Array<string> = [];
    public stats:Array<any>
    
    public statsTitles = ['Strength', 'Consistancy', 'Grit', 'Fun'];
    
    
    constructor(){
        this.needInfo = true;
        this.displayName = 'Dummy User';
        this.userType = 'dummy';
        this.userLevel = 0;
        this.isCoach = false;
        this.students = [];
        // this.stats = this.getZeroStats();
        this.stats = this.getRandomStats(5);        
    }
    newUserProfile(name:string):UserProfile {
        let nprofile = new UserProfile();
        nprofile.setValues(true,name,'new',0,false,[]);
        this.stats = this.getRandomStats(5);
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
    getZeroStats(){
        let stats = [];
        for (var i = 0; i < this.statsTitles.length; i++) {
            let newStat = {k:'',v:0};
            newStat.k = this.statsTitles[i];
            newStat.v = 0;
            stats.push(newStat);
        }
        return stats;
    }
    getRandomStats(n:number){
        let stats = [];
        for (var i = 0; i < this.statsTitles.length; i++) {
            let newStat = {k:'',v:0};
            newStat.k = this.statsTitles[i];
            newStat.v = (Math.floor(Math.random()*n)+1);
            stats.push(newStat);
        }
        return stats;
    }
}