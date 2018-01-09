import fetch from 'isomorphic-fetch';
import UserProfile from '../utils/UserProfile';

class PlaygroundService {

    static fetchPlaygroundsByLocation(centerLocation, range, unitOfMeasurement){
        if(!centerLocation || !centerLocation.lat || !centerLocation.lon){
            return Promise.reject(new Error('centerLocation, first argument is invalid. Expected lat and lon to be truthy.'));
        }
        range = range || 1;
        unitOfMeasurement = unitOfMeasurement || 'km';
        return fetch(`/api/playground/at/${centerLocation.lat}/${centerLocation.lon}/within/${range}/${unitOfMeasurement}`)
            .then((response) => {
                return response.json();
            });
    }

    static fetchPlaygroundById(id){
        if(!id){
            return Promise.reject(new Error('id must be provided to fetch playground'));
        }
        return fetch(`/api/playground/${id}`)
            .then((response) => {
                return response.json();
            });
    }

    static fetchModifications(){
        return fetch(`/api/playground/modification/`, UserProfile.authOptions()).then((response) => {
                return response.json();
            });
    }

    static fetchModificationById(id){
        if(!id){
            return Promise.reject(new Error('id must be provided to fetch suggested modification to playground'));
        }
        return fetch(`/api/playground/modification/${id}`, UserProfile.authOptions()).then((response) => {
            return response.json();
        });
    }

    static fetchSuggestions(){
        return fetch(`/api/playground/suggestion/`, UserProfile.authOptions()).then((response) => {
            return response.json();
        });
    }


    static fetchPlaygroundsCount(){
        return fetch(`/api/playground/`, UserProfile.authOptions()).then((response) => {
            return response.json();
        });
    }

    static fetchSuggestionById(id){
        if(!id){
            return Promise.reject(new Error('id must be provided to fetch playground'));
        }
        return fetch(`/api/playground/suggestion/${id}`, UserProfile.authOptions()).then((response) => {
                return response.json();
            });
    }

    static fetchTags(){
        return fetch(`/api/tag`)
            .then((response) => {
                return response.json();
            });
    }

    static persistPlayground(playground){
        return fetch('/api/playground' + (playground.id === 'ny' ? '' : `/${playground.id}`),
        UserProfile.authOptions(playground.id === 'ny' ? 'POST' : 'PUT', playground)).then(function(res){
            return res.json();
        });
    }

    static removePlaygroundById(id){
        return fetch(`/api/playground/${id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'OAuth ' + UserProfile.getCurrentSession().session
          }
        }).then(function(){
            window.location = `/admin`;
        });
    }
}

export default PlaygroundService;