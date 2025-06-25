export const jwtDecoder = (token: string) => {
  function parseJwt(token: string) {
    const payload = token.split(".")[1]; // header.payload.signature の payload 部分
    const decoded = atob(payload); // Base64 decode
    return JSON.parse(decoded); // JSONに変換
  }
  return parseJwt(token);
};
