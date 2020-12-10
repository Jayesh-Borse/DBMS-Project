class middleware{
    constructor(logStat, username, id){
        this.logStat = logStat;
        this.username = username;
        this.id = id;
    }
    setValue(logStat){
        this.logStat = logStat;
    }
    getValue(){
        return this.logStat;
    }
    setUser(username){
        this.username = username;
    }
    getUser(){
        return this.username;
    }
    setId(id){
        this.id = id;
    }
    getId(){
        return this.id;
    }
};
let isLoggedIn = new middleware(0, "", 0);

module.exports = isLoggedIn;
