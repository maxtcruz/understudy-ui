const getTrackDisplayName = (trackInfo) => {
  let displayName = `${trackInfo.artist} - ${trackInfo.trackName}`;
  if (trackInfo.explicit) {
    displayName += " (explicit)";
  }
  return displayName;
};

export {
  getTrackDisplayName
}