import { authFetch } from "../../AuthFetch";

class ProcessApiClient {
    static SERVER_URL = "http://14.63.178.161:8000/api/process/admin";
    static GET_LIST = "/list"
    static POST_ADD = "/add"
    static POST_UPDATE = "/update"
    static POST_REMOVE = "/remove"

    static getProcessList() {
        return authFetch(ProcessApiClient.SERVER_URL + ProcessApiClient.GET_LIST);
    }
    static addProcess(name) {
        return authFetch(ProcessApiClient.SERVER_URL + ProcessApiClient.POST_ADD + "?name=" + name, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    static updateProcess(processId, name) {
        return authFetch(ProcessApiClient.SERVER_URL + ProcessApiClient.POST_UPDATE + "?processId=" + processId + "&name=" + name, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    static removeProcess(processId) {
        return authFetch(ProcessApiClient.SERVER_URL + ProcessApiClient.POST_REMOVE + "?processId=" + processId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }


}
export default ProcessApiClient;