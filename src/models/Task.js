class Task {
  constructor(title, dueDate, description = "", importance = 1) {
    // User-provided
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.importance = importance;
    this.title = title;

    // Auto-generated
    this.completed = false;
    this.createdAt = new Date();
    this.id = crypto.randomUUID();
  }

  static fromObject(obj) {
    const task = new Task(
      obj.title,
      obj.dueDate,
      obj.description,
      obj.importance
    );

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
