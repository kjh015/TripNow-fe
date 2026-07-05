import { authFetch } from "../../AuthFetch";

class LogDBApiClient {
    static SERVER_URL = "http://14.63.178.161:8000/api/log-db/admin";
    static GET_SUCCESS = "/success";
    static GET_FAIL = "/fail";
    static GET_PROCESS = "-process";
    static GET_FILTER = "-filter";
    static GET_DDP = "-deduplication";

    static getSuccessList() {
        return authFetch(LogDBApiClient.SERVER_URL + LogDBApiClient.GET_SUCCESS);
    }

    static getFailListByFilter() {
        return authFetch(LogDBApiClient.SERVER_URL + LogDBApiClient.GET_FAIL + LogDBApiClient.GET_FILTER);
    }

    static getFailListByDeduplication() {
        return authFetch(LogDBApiClient.SERVER_URL + LogDBApiClient.GET_FAIL + LogDBApiClient.GET_DDP);
    }

    // static getSuccessListByProcess(processId) {
    //     return fetch(LogDBApiClient.SERVER_URL + LogDBApiClient.GET_SUCCESS + LogDBApiClient.GET_PROCESS + "?processId=" + processId);
    // }
    // static getFailListByProcess(processId) {
    //     return fetch(LogDBApiClient.SERVER_URL + LogDBApiClient.GET_FAIL + LogDBApiClient.GET_PROCESS + "?processId=" + processId);
    // }

}

export default LogDBApiClient;