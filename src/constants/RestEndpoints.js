const UNDERSTUDY_SERVICE_BASE_URL = "http://localhost:8080";

const getSpotifyAuthCodeEndpoint = () => {
  return `${UNDERSTUDY_SERVICE_BASE_URL}/spotify/auth/getAuthCode`;
};

const getSpotifyAccessTokenEndpoint = (authorizationCode) => {
  return `/spotify/auth/getAccessToken?authorizationCode=${authorizationCode}`;
};

export {
  UNDERSTUDY_SERVICE_BASE_URL,
  getSpotifyAuthCodeEndpoint,
  getSpotifyAccessTokenEndpoint
}