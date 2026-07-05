import { authFetch } from "../../AuthFetch";

class FavoriteApiClient {
    static SERVER_URL = "http://14.63.178.161:8000/api/favorite";
    static POST_TOGGLE = "/toggle";
    static POST_EXISTS = "/exists";


    static toggleFavorite(payload) {
        return authFetch(FavoriteApiClient.SERVER_URL + FavoriteApiClient.POST_TOGGLE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });
    }
    static existsFavorite(payload) {
        return fetch(FavoriteApiClient.SERVER_URL + FavoriteApiClient.POST_EXISTS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });
    }

}

export default FavoriteApiClient;