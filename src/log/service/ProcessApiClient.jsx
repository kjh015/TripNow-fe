import { authFetch } from "../../AuthFetch";

class ProcessApiClient {
    static SERVER_URL = `${process.env.REACT_APP_API_BASE_URL}/api/process/admin`;
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