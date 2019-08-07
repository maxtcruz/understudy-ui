const getTrackDisplayName = (track) => {
  let displayName = `${track.artist} - ${track.trackName}`;
  if (track.explicit) {
    displayName += " (explicit)";
  }
  return displayName;
};

export {
  getTrackDisplayName
}