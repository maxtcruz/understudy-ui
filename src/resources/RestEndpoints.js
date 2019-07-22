const UNDERSTUDY_SERVICE_BASE_URL = "http://localhost:8080";
const SPOTIFY_WEB_API_BASE_URL = "https://api.spotify.com/v1";

const getSpotifyAuthCodeEndpoint = () => {
  return `${UNDERSTUDY_SERVICE_BASE_URL}/spotify/auth/getAuthCode`;
};

const getSpotifyAccessTokenEndpoint = (authorizationCode) => {
  return `/spotify/auth/getAccessToken?authorizationCode=${authorizationCode}`;
};

const getSpotifySearchEndpoint = (query, type) => {
  return `${SPOTIFY_WEB_API_BASE_URL}/search?q=${query}&type=${type}`;
};

const getSpotifyPlayEndpoint = (deviceId) => {
  return `${SPOTIFY_WEB_API_BASE_URL}/me/player/play/?device_id=${deviceId}`;
};

export {
  UNDERSTUDY_SERVICE_BASE_URL,
  getSpotifyAuthCodeEndpoint,
  getSpotifyAccessTokenEndpoint,
  getSpotifySearchEndpoint,
  getSpotifyPlayEndpoint
}