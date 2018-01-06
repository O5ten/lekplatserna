import fetch from 'isomorphic-fetch';

class AuthService {
    static validateSession(session){
        return fetch("/api/auth", {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(session)
              }
            ).then(function(result){
                if(result.status < 202){
                    return result.json();
                }else{
                    return Promise.reject(new Error('Unable to validate auth session with backend.'));
                }
            }.bind(this));
    }
}

export default AuthService;