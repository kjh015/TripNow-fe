import { authFetch } from "../../AuthFetch";

class MonitoringApiClient {
    static SERVER_URL = `${process.env.REACT_APP_API_BASE_URL}/api/monitoring/admin`;
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