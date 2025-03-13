import { Task, Member } from "../api/api";
import { updateTask, markTaskAsDone, removeTask } from "../api/api";
import { getMemberNameById } from "../utils/utils";

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

  todoList.innerHTML = ""; // Clear the list before adding tasks
  inProgressList.innerHTML = ""; // Clear the in-progress list before adding tasks
  doneList.innerHTML = ""; // Clear the done list before adding tasks

  let filteredTasks = tasks;

  if (selectedCategory && selectedCategory !== "all") {
    filteredTasks = filteredTasks.filter(
      (task) => task.category === selectedCategory
    );
  }

  if (selectedMember && selectedMember !== "all") {
    filteredTasks = filteredTasks.filter(
      (task) => task.assigned === selectedMember
    );
  }

  if (timestampSortOrder) {
    filteredTasks = filteredTasks.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return timestampSortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }

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

  // Debugging: Log task category and member roles
  console.log(`Task Category: ${task.category}`);
  members.forEach((member) => {
    console.log(`Member: ${member.name}, Roles: ${member.roles.join(", ")}`);
  });

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

  // Debugging: Log filtered members
  console.log(`Filtered Members for ${task.category}:`, filteredMembers);

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
