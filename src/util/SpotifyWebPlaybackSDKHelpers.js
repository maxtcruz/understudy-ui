const loadPlayer = () => {
  return new Promise((resolve) => {
    if (window.Spotify) {
      resolve(window.Spotify);
    } else {
      const checkPlayerLoaded = setInterval(() => {
        if (window.Spotify) {
          clearInterval(checkPlayerLoaded);
          resolve(window.Spotify);
        }
      }, 100);
    }
  });
};

export {
  loadPlayer
}
