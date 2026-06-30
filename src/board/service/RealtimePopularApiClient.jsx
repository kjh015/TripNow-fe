class RealtimePopularApiClient {
    static SERVER_URL = `${process.env.REACT_APP_API_BASE_URL}/realtime-popular`;
    static GET_SSE = "/sse";

    static dd() {
        return fetch(RealtimePopularApiClient.SERVER_URL + RealtimePopularApiClient.GET_SSE);
    }
}

export default RealtimePopularApiClient;