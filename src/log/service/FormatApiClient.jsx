import { authFetch } from "../../AuthFetch";

class FormatApiClient {
    static SERVER_URL = "http://14.63.178.161:8000/api/format/admin";
    static GET_LIST = "/list"
    static GET_VIEW = "/view"
    static POST_ADD = "/add";
    static POST_UPDATE = "/update"
    static POST_REMOVE = "/remove"

    static getFormatList(processId) {
        return authFetch(FormatApiClient.SERVER_URL + FormatApiClient.GET_LIST + "?processId=" + processId);
    }
    static viewFormat(formatId) {
        return authFetch(FormatApiClient.SERVER_URL + FormatApiClient.GET_VIEW + "?formatId=" + formatId);
    }

    static addFormat(processId, name, active, formatJson, defaultJson) {
        return authFetch(FormatApiClient.SERVER_URL + FormatApiClient.POST_ADD + "?processId=" + processId + "&name=" + name + "&active=" + active, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                formatInfo: JSON.parse(formatJson),
                defaultInfo: JSON.parse(defaultJson)
            })
        });
    }
    static updateFormat(formatId, name, active, formatJson, defaultJson) {
        return authFetch(FormatApiClient.SERVER_URL + FormatApiClient.POST_UPDATE + "?formatId=" + formatId + "&name=" + name + "&active=" + active, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                formatInfo: JSON.parse(formatJson),
                defaultInfo: JSON.parse(defaultJson)
            })
        });
    }
    static removeFormat(formatId) {
        return authFetch(FormatApiClient.SERVER_URL + FormatApiClient.POST_REMOVE + "?formatId=" + formatId, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }


}
export default FormatApiClient;