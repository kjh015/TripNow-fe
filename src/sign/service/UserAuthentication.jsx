class UserAuthentication {
    static getLoginIdFromToken() {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub || payload.loginId;
        } catch (e) {
            console.error("토큰 디코딩 실패:", e);
            return null;
        }
    }

    static isAdmin() {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            return false;
        }
        try {
            
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.roles?.includes("ROLE_ADMIN");
        } catch (e) {
            console.error("토큰 디코딩 실패:", e);
            return false;
        }
    }

}

export default UserAuthentication;