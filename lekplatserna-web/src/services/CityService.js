import fetch from 'isomorphic-fetch';

class CityService {
    static fetchCitiesByKeyword(keyword){
        return fetch(`/api/city/${keyword}`)
            .then((response) => {
                return response.json();
            })
    }
}

export default CityService;