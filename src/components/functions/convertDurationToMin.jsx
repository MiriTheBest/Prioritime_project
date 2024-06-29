export const convertDurationToMin = (input) => {
  const regex = /(\d+)\s*(minute|min|hour|day|minutes|hours|days)/gi;//all options for user to enter duration not including typos
  let match;
  let totalMinutes = 0;

  while ((match = regex.exec(input)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 'minute':
      case 'min':
      case 'minutes':
        totalMinutes += value;
        break;
      case 'hour':
      case 'hours':
        totalMinutes += value * 60;
        break;
      case 'day':
      case 'days':
        totalMinutes += value * 1440; // 24 hours * 60 minutes
        break;
      default:
        throw new Error("Unsupported time unit");
    }
  }

  if (totalMinutes === 0 && input.trim() !== '') {
    throw new Error("Invalid input format");
  }

  return totalMinutes;
};
