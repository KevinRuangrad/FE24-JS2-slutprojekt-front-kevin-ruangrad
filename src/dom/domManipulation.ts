import { Task, Member } from "../api/api";
import { updateTask, markTaskAsDone, removeTask } from "../api/api";
import { getMemberNameById } from "../utils/utils";

// Display tasks on the DOM
export function displayTasks(
  tasks: Task[],
  members: Member[],
  selectedCategory?: string,
  selectedMember?: string,
  timestampSortOrder?: string,
  titleSortOrder?: string
) {
  const todoList = document.getElementById("todo-list") as HTMLElement;
  const inProgressList = document.getElementById(
    "inprogress-list"
  ) as HTMLElement;
  const doneList = document.getElementById("done-list") as HTMLElement;

  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  doneList.innerHTML = "";

  let filteredTasks = tasks;

  // Filter tasks by category
  if (selectedCategory && selectedCategory !== "all") {
    filteredTasks = filteredTasks.filter(
      (task) => task.category === selectedCategory
    );
  }

  // Filter tasks by assigned member
  if (selectedMember && selectedMember !== "all") {
    filteredTasks = filteredTasks.filter(
      (task) => task.assigned === selectedMember
    );
  }

  // Sort tasks by timestamp
  if (timestampSortOrder) {
    filteredTasks = filteredTasks.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return timestampSortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }

  // Sort tasks by title
  if (titleSortOrder) {
    filteredTasks = filteredTasks.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleSortOrder === "ascending") {
        return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
      } else {
        return titleA > titleB ? -1 : titleA < titleB ? 1 : 0;
      }
    });
  }

  // Display tasks in the appropriate lists
  filteredTasks.forEach((task) => {
    const taskElement = createTaskElement(task, members, tasks);
    if (task.status === "to do") {
      todoList.appendChild(taskElement);
    } else if (task.status === "in progress") {
      inProgressList.appendChild(taskElement);
    } else if (task.status === "done") {
      doneList.appendChild(taskElement);
    }
  });
}

// Create a task element for the DOM
export function createTaskElement(
  task: Task,
  members: Member[],
  tasks: Task[]
): HTMLElement {
  const taskElement = document.createElement("div");
  taskElement.className = "task";
  const assignedName = task.assigned
    ? getMemberNameById(members, task.assigned)
    : "Unassigned";

  // Filter members based on the task's category
  const filteredMembers = members.filter((member) => {
    if (task.category === "dev frontend") {
      return member.roles.includes("dev frontend");
    } else if (task.category === "dev backend") {
      return member.roles.includes("dev backend");
    } else if (task.category === "ux") {
      return member.roles.includes("ux");
    }
    return false;
  });
  const memberOptions = filteredMembers
    .map(
      (member) =>
        `<option value="${member.id}" ${
          task.assigned === member.id ? "selected" : ""
        }>${member.name}</option>`
    )
    .join("");

  taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p><strong>Category:</strong> ${task.category}</p>
        <p><strong>Assigned to:</strong> 
          ${
            task.status === "in progress" || task.status === "done"
              ? assignedName
              : `<select class="assign-member-dropdown">
                  <option value="">Unassigned</option>
                  ${memberOptions}
                </select>`
          }
        </p>
        <p><strong>Timestamp:</strong> ${task.timestamp}</p>
        ${
          task.status === "in progress"
            ? `<button class="mark-done-button">Mark as Done</button>`
            : task.status === "done"
            ? `<button class="remove-task-button">Remove</button>`
            : ""
        }
      `;

  // Add event listener for assigning a member to a task
  if (task.status !== "in progress" && task.status !== "done") {
    const dropdown = taskElement.querySelector(
      ".assign-member-dropdown"
    ) as HTMLSelectElement;

    dropdown.addEventListener("change", async (event) => {
      const selectedMemberId = (event.target as HTMLSelectElement).value;
      task.assigned = selectedMemberId || undefined;
      task.status = selectedMemberId ? "in progress" : "to do";

      // Update the task in the backend
      try {
        await updateTask(task, selectedMemberId);
      } catch (error) {
        console.error("Error updating task:", error);
      }

      // Re-display tasks to reflect the changes
      displayTasks(tasks, members);
    });
  } else if (task.status === "in progress") {
    // Add event listener for marking a task as done
    const markDoneButton = taskElement.querySelector(
      ".mark-done-button"
    ) as HTMLButtonElement;

    markDoneButton.addEventListener("click", async () => {
      // Update the task in the backend
      try {
        await markTaskAsDone(task.id);
        task.status = "done";
      } catch (error) {
        console.error("Error marking task as done:", error);
      }

      // Re-display tasks to reflect the changes
      displayTasks(tasks, members);
    });
  } else if (task.status === "done") {
    // Add event listener for removing a task
    const removeTaskButton = taskElement.querySelector(
      ".remove-task-button"
    ) as HTMLButtonElement;

    removeTaskButton.addEventListener("click", async () => {
      // Remove the task in the backend
      try {
        await removeTask(task.id);
        // Remove the task from the tasks array
        const taskIndex = tasks.findIndex((t) => t.id === task.id);
        if (taskIndex > -1) {
          tasks.splice(taskIndex, 1);
        }
      } catch (error) {
        console.error("Error removing task:", error);
      }

      // Re-display tasks to reflect the changes
      displayTasks(tasks, members);
    });
  }

  return taskElement;
}
