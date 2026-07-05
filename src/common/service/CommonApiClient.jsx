import { authFetch } from "../../AuthFetch";

class CommonApiClient {
    static SERVER_URL = "http://14.63.178.161:8000/api/common";
    static POST_FAVORITE = "/my-favorite";
    static POST_COMMENT = "/my-comment";
    static POST_BOARD = "/my-board";

    static getMyFavorite(nickname) {
        return authFetch(CommonApiClient.SERVER_URL + CommonApiClient.POST_FAVORITE + "?nickname=" + nickname, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nickname),
        });
    }
    static getMyComment(nickname) {
        return authFetch(CommonApiClient.SERVER_URL + CommonApiClient.POST_COMMENT + "?nickname=" + nickname, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nickname),
        });
    }
    static getMyBoard(nickname) {
        return authFetch(CommonApiClient.SERVER_URL + CommonApiClient.POST_BOARD + "?nickname=" + nickname, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nickname),
        });
    }
}

export default CommonApiClient;