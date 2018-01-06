class UserProfile {

  getCurrentSession(){
    return JSON.parse(localStorage.getItem('LekplatsernaUserProfile'));
  }

  setCurrentSession(session){
    localStorage.setItem('LekplatsernaUserProfile', JSON.stringify(session));
  }

  destroyCurrentSession(){
    localStorage.removeItem('LekplatsernaUserProfile');
  }
}

export default UserProfile;