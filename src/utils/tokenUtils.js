export const decodeToken = (token) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.error("토큰 디코딩 실패:", e);
    return null;
  }
};

export const getLoginIdFromToken = (token) => {
  const resolved = token ?? localStorage.getItem("accessToken");
  const payload = decodeToken(resolved);
  return payload?.sub ?? payload?.loginId ?? null;
};

export const isAdmin = (token) => {
  const resolved = token ?? localStorage.getItem("accessToken");
  const payload = decodeToken(resolved);
  return payload?.roles?.includes("ROLE_ADMIN") ?? false;
};
