import { getLoginIdFromToken, isAdmin } from "../../utils/tokenUtils";

class UserAuthentication {
    static getLoginIdFromToken() {
        return getLoginIdFromToken();
    }

    static isAdmin() {
        return isAdmin();
    }
}

export default UserAuthentication;