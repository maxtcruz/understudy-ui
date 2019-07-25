const loadPlayer = () => {
  return new Promise((resolve) => {
    if (window.Spotify) {
      resolve(window.Spotify);
    } else {
      window.onSpotifyWebPlaybackSDKReady = () => {
        resolve(window.Spotify);
      };
    }
  });
};

export {
  loadPlayer
}
