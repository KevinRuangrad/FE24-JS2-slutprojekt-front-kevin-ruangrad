import {
  fetchTasks,
  fetchMembers,
  addTask,
  Task,
  Member,
  Category,
  Status,
} from "./api/api";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded event fired");

  const tasks = await fetchTasks();
  console.log("Fetched tasks:", tasks);

  const members = await fetchMembers();
  console.log("Fetched members:", members);

  if (tasks) {
    displayTasks(tasks);
  }

  if (members) {
    populateMemberFilter(members);
  }

  const taskForm = document.getElementById("task-form") as HTMLFormElement;

  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Form submitted");

    const formData = new FormData(taskForm);
    const newTask: Omit<Task, "id" | "timestamp" | "status"> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as Category,
      assigned: (formData.get("assigned") as string) || undefined,
    };

    try {
      const addedTask = await addTask({
        ...newTask,
        status: "to do" as Status, // Use the correct status value
        timestamp: new Date().toISOString(),
      });
      console.log("Added task:", addedTask);
      if (addedTask) {
        addTaskToDOM(addedTask);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  });
});

function displayTasks(tasks: Task[]) {
  const todoList = document.getElementById("todo-list") as HTMLElement;
  todoList.innerHTML = ""; // Clear the list before adding tasks
  tasks.forEach((task) => {
    if (task.status === "to do") {
      const taskElement = createTaskElement(task);
      todoList.appendChild(taskElement);
    }
  });
}

function createTaskElement(task: Task): HTMLElement {
  const taskElement = document.createElement("div");
  taskElement.className = "task";
  taskElement.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <p><strong>Category:</strong> ${task.category}</p>
    <p><strong>Assigned to:</strong> ${task.assigned || "Unassigned"}</p>
    <p><strong>Timestamp:</strong> ${task.timestamp}</p>
  `;
  return taskElement;
}

function populateMemberFilter(members: Member[]) {
  const memberFilter = document.getElementById(
    "member-filter"
  ) as HTMLSelectElement;
  memberFilter.innerHTML = '<option value="all">All</option>'; // Clear the filter before adding members
  members.forEach((member) => {
    const option = document.createElement("option");
    option.value = member.id;
    option.textContent = member.name;
    memberFilter.appendChild(option);
  });
}

function addTaskToDOM(task: Task) {
  const todoList = document.getElementById("todo-list") as HTMLElement;
  const taskElement = createTaskElement(task);
  todoList.appendChild(taskElement);
}
