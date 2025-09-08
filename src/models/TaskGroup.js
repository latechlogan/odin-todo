class TaskGroup {
  constructor(groupName, id = crypto.randomUUID()) {
    this.groupName = groupName;
    this.id = id;
    this.tasks = [];
  }

  getTasksFromArray(array) {
    const tasks = array.filter((task) => task.groupId === this.id);
    return tasks;
  }
}

export default TaskGroup;
