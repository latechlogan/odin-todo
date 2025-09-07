class TaskGroup {
  constructor(groupName, id = crypto.randomUUID()) {
    this.groupName = groupName;
    this.id = id;
    this.tasks = [];
  }

  static getTasksFromArray(array) {
    array.filter((task) => task.groupId === this.id);
  }
}

export default TaskGroup;
