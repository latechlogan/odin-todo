class Task {
  constructor(title, dueDate, importance = 1, groupId = "inbox") {
    // User-provided
    this.title = title;
    this.dueDate = new Date(dueDate);
    this.importance = importance;
    this.groupId = groupId;

    // Auto-generated
    this.completed = false;
    this.createdAt = new Date();
    this.id = crypto.randomUUID();
  }

  static fromObject(obj) {
    const task = new Task(obj.title, obj.dueDate, obj.importance, obj.groupId);

    task.id = obj.id;
    task.completed = obj.completed;
    task.createdAt = new Date(obj.createdAt);

    return task;
  }

  isOverdue() {
    const now = new Date();
    now > this.dueDate ? true : false;
  }

  toggleComplete() {
    this.completed = !this.completed;
  }
}

export default Task;
