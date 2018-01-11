import fetch from 'isomorphic-fetch';

class CityService {
    static fetchCitiesByKeyword(keyword){
        return fetch(`/api/city/${keyword}`).then(response => response.json())
    }

    static fetchCityByName(keyword){
        return fetch(`/api/city/${keyword}`).then(response => response.json())
    }
}

export default CityService;