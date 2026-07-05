class RealtimePopularApiClient {
    static SERVER_URL = "http://14.63.178.161:8000/realtime-popular";
    static GET_SSE = "/sse";

    static dd() {
        return fetch(RealtimePopularApiClient.SERVER_URL + RealtimePopularApiClient.GET_SSE);
    }
}

export default RealtimePopularApiClient;