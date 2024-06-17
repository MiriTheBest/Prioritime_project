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
  // Helper function to sort tasks within the same tag group
  const sortTasksWithinGroup = (group) => {
    return group.slice().sort((a, b) => a.name.localeCompare(b.name));
  };

  // Create a map to group tasks by their tags
  const tagGroups = {};
  tasks.forEach((task) => {
    task.tags.forEach((tag) => {
      if (!tagGroups[tag]) {
        tagGroups[tag] = [];
      }
      tagGroups[tag].push(task);
    });
  });

  // Create an array to store sorted tasks
  const sortedTasks = [];

  // Sort groups by the tag names and then sort tasks within each group
  Object.keys(tagGroups)
    .sort()
    .forEach((tag) => {
      const sortedGroup = sortTasksWithinGroup(tagGroups[tag]);
      sortedTasks.push(...sortedGroup);
    });

  // Remove duplicates and maintain the sorted order
  const uniqueTasks = [];
  const taskIds = new Set();
  sortedTasks.forEach((task) => {
    if (!taskIds.has(task.id)) {
      uniqueTasks.push(task);
      taskIds.add(task.id);
    }
  });

  return uniqueTasks;
};

