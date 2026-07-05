import { authFetch } from "../../AuthFetch";

class DeduplicationApiClient {
    static SERVER_URL = "http://14.63.178.161:8000/api/deduplication/admin";
    static GET_LIST = "/list";
    static GET_VIEW = "/view";
    static POST_ADD = "/add";
    static POST_UPDATE = "/update";
    static POST_REMOVE = "/remove";
    static GET_KEYS = "/keys";

    static getDeduplicationList(processId) {
        return authFetch(DeduplicationApiClient.SERVER_URL + DeduplicationApiClient.GET_LIST + "?processId=" + processId);
    }
    static viewDeduplication(deduplicationId) {
        return authFetch(DeduplicationApiClient.SERVER_URL + DeduplicationApiClient.GET_VIEW + "?deduplicationId=" + deduplicationId);
    }
    static addDeduplication({ processId, name, active, rows }) {
        return authFetch(DeduplicationApiClient.SERVER_URL + DeduplicationApiClient.POST_ADD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                processId: processId,
                name: name,
                active: active,
                rows: rows
            }),
        });
    }
    static updateDeduplication({ id, name, active, rows }) {
        return authFetch(DeduplicationApiClient.SERVER_URL + DeduplicationApiClient.POST_UPDATE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                name: name,
                active: active,
                rows: rows
            }),
        });
    }
    static removeDeduplication(deduplicationId) {
        return authFetch(DeduplicationApiClient.SERVER_URL + DeduplicationApiClient.POST_REMOVE + "?deduplicationId=" + deduplicationId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    static getFormatKeys(processId) {
        return authFetch(DeduplicationApiClient.SERVER_URL + DeduplicationApiClient.GET_KEYS + "?processId=" + processId);
    }


}
export default DeduplicationApiClient;