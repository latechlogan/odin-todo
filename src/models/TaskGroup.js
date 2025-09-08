class TaskGroup {
  constructor(groupName, id = crypto.randomUUID()) {
    this.groupName = groupName;
    this.id = id;
    this.tasks = [];
  }

  static fromObject(obj) {
    const group = new TaskGroup(obj.groupName, obj.id);

    group.tasks = obj.tasks;

    return group;
  }

  getTasksFromArray(array) {
    const tasks = array.filter((task) => task.groupId === this.id);
    return tasks;
  }
}

export default TaskGroup;
