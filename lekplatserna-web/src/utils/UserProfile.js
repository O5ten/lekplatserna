class UserProfile {

    static getCurrentSession(){
        return JSON.parse(localStorage.getItem('LekplatsernaUserProfile'));
    }

    static setCurrentSession(session){
        localStorage.setItem('LekplatsernaUserProfile', JSON.stringify(session));
    }

    static destroyCurrentSession(){
        localStorage.removeItem('LekplatsernaUserProfile');
    }

    static isAdmin(){
        let session = this.getCurrentSession()
        return session ? session.role === "admin" : false;
    }

    static isUser(){
      let session = this.getCurrentSession()
      return session ? session.role === "user" : false;
    }
}

export default UserProfile;