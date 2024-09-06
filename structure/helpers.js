// Format time in minutes and seconds
export function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs < 10 ? '0' : ''}${secs}s`;
  }
  