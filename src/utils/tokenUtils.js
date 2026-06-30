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

export const getOrCreateAnonymousId = () => {
  let id = localStorage.getItem("anonymousId");
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
            (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
          );
    localStorage.setItem("anonymousId", id);
  }
  return id;
};

export const getUserIdForMatomo = () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    const payload = decodeToken(token);
    if (payload) return payload.sub ?? payload.loginId ?? getOrCreateAnonymousId();
  }
  return getOrCreateAnonymousId();
};
