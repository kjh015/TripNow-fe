class ItemApiClient {
    static SERVER_URL = `${process.env.REACT_APP_API_BASE_URL}/sse`;
    static POST_ITEM = "/item";

    static sendItem(item){
        return fetch(ItemApiClient.SERVER_URL + ItemApiClient.POST_ITEM, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item)
        });
    }
}

export default ItemApiClient;