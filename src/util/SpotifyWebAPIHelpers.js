const getFormattedTrackName = (track) => {
  let displayName = `${getFormattedArtists(track)} - ${track.trackName}`;
  if (track.explicit) {
    displayName += " (explicit)";
  }
  return displayName;
};

const getFormattedArtists = (track) => {
  const {
    artists,
    trackName
  } = track;
  let formattedArtists = artists[0].name;
  let artistsIndex = 1;
  while (artists[artistsIndex]) {
    const artistName = artists[artistsIndex].name;
    if (!trackName.toLowerCase().includes(artistName.toLowerCase())) {
      formattedArtists += `, ${artistName}`;
    }
    artistsIndex++;
  };
  return formattedArtists;
};

export {
  getFormattedTrackName,
  getFormattedArtists
}