export const sortTasksByName = (tasks) => {
  return tasks.slice().sort((a, b) => a.name.localeCompare(b.name));
};

export const sortTasksByCategory = (tasks) => {
  return tasks.slice().sort((a, b) => a.category.localeCompare(b.category));
};

export const sortTasksByDuration = (tasks) => {
  const convertToMinutes = (duration) => {
    const regex = /(\d+)\s*(minute|min|hour|day|minutes|hours|days)/i;
    const match = duration.match(regex);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();
      if (unit === "minute" || unit === "min" || unit === "minutes") {
        return value;
      } else if (unit === "hour" || unit === "hours") {
        return value * 60; // Convert hours to minutes
      } else if (unit === "day" || unit === "days") {
        return value * 24 * 60; // Convert days to minutes
      }
    }
    return 0; // Default value for invalid durations
  };

  return tasks.slice().sort((a, b) => {
    const durationA = convertToMinutes(a.duration);
    const durationB = convertToMinutes(b.duration);
    return durationA - durationB;
  });
};

export const sortTasksByTags = (tasks) => {
  // Function to check if a task has a specific tag
  const hasTag = (task, tag) => task.tags.includes(tag);

  // Sort tasks with "important" tag first, then by name
  return tasks.slice().sort((a, b) => {
    const hasImportantTagA = hasTag(a, "important");
    const hasImportantTagB = hasTag(b, "important");

    if (hasImportantTagA && !hasImportantTagB) {
      return -1; // Place task A before task B
    } else if (!hasImportantTagA && hasImportantTagB) {
      return 1; // Place task B before task A
    } else {
      // If both tasks have the "important" tag or neither has it, sort by name
      return a.name.localeCompare(b.name);
    }
  });
};
