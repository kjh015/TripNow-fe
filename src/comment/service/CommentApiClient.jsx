import { authFetch } from "../../AuthFetch";

class CommentApiClient {
    static SERVER_URL = `${process.env.REACT_APP_API_BASE_URL}/api/comment`;
    static GET_LIST = "/list"
    static POST_ADD = "/add"
    static POST_REMOVE = "/remove"

    static getCommentList(no) {
        return fetch(CommentApiClient.SERVER_URL + CommentApiClient.GET_LIST + "?no=" + no);
    }
    static addComment(payload) {
        return authFetch(CommentApiClient.SERVER_URL + CommentApiClient.POST_ADD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });
    }
    static removeComment(commentId) {
        return authFetch(CommentApiClient.SERVER_URL + CommentApiClient.POST_REMOVE + "?commentId=" + commentId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

}

export default CommentApiClient;