import { authFetch } from "../../AuthFetch";

class SignApiClient {
    static SERVER_URL = "http://14.63.178.161:8000/api/sign";
    static ADMIN = "/admin";
    static SIGN_UP = "/sign-up";
    static CHECK_DUP = "/check-duplicate"
    static SIGN_IN = "/sign-in";
    static SIGN_OUT = "/sign-out";
    static WITHDRAW = "/withdraw";
    static UPDATE = "/update";
    static UPDATE_PASSWORD = "/update-password";
    static POST_DETAIL = "/detail";
    static POST_LIST = "/list";
    static POST_DELEGATE = "/delegate";
    static GET_NICKNAME = "/nickname";


    static signUp(payload) {
        return fetch(SignApiClient.SERVER_URL + SignApiClient.SIGN_UP, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });
    }
    static checkDuplicate({type, value}){
        return fetch(SignApiClient.SERVER_URL + SignApiClient.CHECK_DUP + `?type=${type}&value=${value}`);
    }

    static signIn(payload) {
        return fetch(SignApiClient.SERVER_URL + SignApiClient.SIGN_IN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(payload),
        });
    }
    static signOut() {
        return authFetch(SignApiClient.SERVER_URL + SignApiClient.SIGN_OUT, {
            method: 'POST',
            credentials: 'include',
        });

    }
    static withdraw() {
        return authFetch(SignApiClient.SERVER_URL + SignApiClient.WITHDRAW, {
            method: 'POST',
            credentials: 'include',
        });

    }
    static getMemberDetail({ loginId }) {
        return authFetch(SignApiClient.SERVER_URL + SignApiClient.POST_DETAIL + `?loginId=${loginId}`, {
            method: 'POST',
            credentials: 'include',
        });

    }

    static getMemberList() {
        return authFetch(SignApiClient.SERVER_URL + SignApiClient.ADMIN + SignApiClient.POST_LIST, {
            method: 'POST',
            credentials: 'include',
        });

    }
    static delegateAdmin({ loginId }) {
        return authFetch(SignApiClient.SERVER_URL + SignApiClient.ADMIN + SignApiClient.POST_DELEGATE + `?loginId=${loginId}`, {
            method: 'POST',
            credentials: 'include',
        });

    }

    static updateMember(payload) {
        return authFetch(SignApiClient.SERVER_URL + SignApiClient.UPDATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });
    }
    static updatePassword(payload) {
        return authFetch(SignApiClient.SERVER_URL + SignApiClient.UPDATE_PASSWORD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });
    }


    static getNickname(loginId) {
        return authFetch(SignApiClient.SERVER_URL + SignApiClient.GET_NICKNAME, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ loginId: loginId })
        });
    }

    static test() {
        return authFetch(SignApiClient.SERVER_URL + "/test", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        });
    }
}

export default SignApiClient;