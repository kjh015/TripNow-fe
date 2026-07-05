import { authFetch } from "../../AuthFetch";

class MonitoringApiClient {
    static SERVER_URL = "http://14.63.178.161:8000/api/monitoring/admin";
    static POST_TOP = "/top";
    static POST_VISIT = "/visit";

    static getDashboardData({data}){
        return authFetch(MonitoringApiClient.SERVER_URL + MonitoringApiClient.POST_TOP + `?data=${data}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    static getVisit({period}){
        return authFetch(MonitoringApiClient.SERVER_URL + MonitoringApiClient.POST_VISIT + `?period=${period}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    
}

export default MonitoringApiClient;