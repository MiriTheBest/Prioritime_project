export const convertMinToDuration = (minutes) => {
    if (typeof minutes !== 'number' || minutes < 0) {
      throw new Error("Invalid input: minutes should be a non-negative number");
    }
  
    if (minutes === 0) {
      return '0 minutes';
    }
  
    let durationString = '';
    const days = Math.floor(minutes / 1440);
    minutes %= 1440;
    const hours = Math.floor(minutes / 60);
    minutes %= 60;
  
    if (days > 0) {
      durationString += `${days} ${days === 1 ? 'day' : 'days'}`;
    }
  
    if (hours > 0) {
      if (durationString) durationString += ', ';
      durationString += `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }
  
    if (minutes > 0) {
      if (durationString) durationString += ', ';
      durationString += `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }
  
    return durationString;
  };
  