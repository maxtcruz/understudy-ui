const getClockFormat = (ms) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const seconds = totalSeconds % 60;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${hours}:${formattedMinutes}:${formattedSeconds}`;
};

export {
  getClockFormat
}