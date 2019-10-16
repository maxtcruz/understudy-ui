const UNDERSTUDY_UI_URL = process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://www.understudy.maxtcruz.com";
const UNDERSTUDY_SERVICE_BASE_URL = process.env.NODE_ENV === "development"
    ? "https://localhost:8443"
    : "https://api.understudy.maxtcruz.com";
const SPOTIFY_WEB_API_BASE_URL = "https://api.spotify.com/v1";

const getSpotifyAuthCodeEndpoint = () => {
  return `${UNDERSTUDY_SERVICE_BASE_URL}/spotify/auth/getAuthCode`;
};

const getSpotifyAccessTokenEndpoint = (authorizationCode) => {
  return `${UNDERSTUDY_SERVICE_BASE_URL}/spotify/auth/getAccessToken?authorizationCode=${authorizationCode}`;
};

const getSpotifyRefreshAccessTokenEndpoint = (refreshToken) => {
  return `${UNDERSTUDY_SERVICE_BASE_URL}/spotify/auth/refreshAccessToken?refreshToken=${refreshToken}`;
};

const getSpotifyLoggedInUserInfoEndpoint = () => {
  return `${SPOTIFY_WEB_API_BASE_URL}/me`;
};

const getSpotifySearchEndpoint = (query, type, offset = 0, limit = 20) => {
  return `${SPOTIFY_WEB_API_BASE_URL}/search?q=${query}&type=${type}&offset=${offset}&limit=${limit}`;
};

const getSpotifyPlayEndpoint = (deviceId) => {
  return `${SPOTIFY_WEB_API_BASE_URL}/me/player/play/?device_id=${deviceId}`;
};

const getSpotifyCreatePlaylistEndpoint = (loggedInUserId) => {
  return `${SPOTIFY_WEB_API_BASE_URL}/users/${loggedInUserId}/playlists`;
};

const getSpotifyAddTracksToPlaylistEndpoint = (playlistId) => {
  return `${SPOTIFY_WEB_API_BASE_URL}/playlists/${playlistId}/tracks`;
};

export {
  UNDERSTUDY_UI_URL,
  UNDERSTUDY_SERVICE_BASE_URL,
  getSpotifyAuthCodeEndpoint,
  getSpotifyAccessTokenEndpoint,
  getSpotifyRefreshAccessTokenEndpoint,
  getSpotifyLoggedInUserInfoEndpoint,
  getSpotifySearchEndpoint,
  getSpotifyPlayEndpoint,
  getSpotifyCreatePlaylistEndpoint,
  getSpotifyAddTracksToPlaylistEndpoint
}