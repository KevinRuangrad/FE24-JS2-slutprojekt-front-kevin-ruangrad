import {
  fetchTasks,
  fetchMembers,
  addTask,
  addMember,
  updateTask,
  markTaskAsDone,
  removeTask,
  Task,
  Member,
} from "./api/api";

(async () => {
  let tasks: Task[] = [];
  let members: Member[] = [];

  try {
    const tasksResponse = await fetchTasks();
    tasks = tasksResponse;
    console.log("Fetched tasks:", tasks);
    console.log("Type of tasks:", typeof tasks);
    console.log("Is tasks an array?", Array.isArray(tasks));

    members = await fetchMembers();
    console.log("Fetched members:", members);

    console.log("Tasks before displaying:", tasks);
    console.log("Number of tasks:", tasks.length);

    if (Array.isArray(tasks) && tasks.length > 0) {
      console.log("Entering displayTasks if statement");
      displayTasks(tasks, members);
    } else {
      console.error("No tasks to display");
    }

    if (members.length > 0) {
      console.log("members exist");
      populateMemberFilter(members);
      populateMemberDropdown(members);
    } else {
      console.error("No members to display");
    }
  } catch (error) {
    console.error("Error fetching tasks or members:", error);
  }

  const taskForm = document.getElementById("task-form") as HTMLFormElement;

  taskForm.reset();
  taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Form submitted");

    const formData = new FormData(taskForm);
    const newTask = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category"),
      status: "to do", // Default status
    } as Partial<Task>;

    console.log("New task data:", newTask); // Log the new task data for debugging

    try {
      const addedTask = await addTask(newTask);
      console.log("Added task:", addedTask);
      if (addedTask) {
        tasks.push(addedTask); // Update the original tasks array
        displayTasks(tasks, members); // Re-display tasks with the new task included
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  });

  const addMemberForm = document.getElementById(
    "add-member-form"
  ) as HTMLFormElement;
  addMemberForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Add member form submitted");

    const formData = new FormData(addMemberForm);
    const newMemberName = formData.get("name") as string;
    const newMemberRoles = Array.from(formData.getAll("roles")) as string[];

    const newMember = {
      name: newMemberName,
      roles: newMemberRoles,
    };

    try {
      const addedMember = await addMember(newMember);
      console.log("Added member:", addedMember);
      populateMemberDropdown(members); // Update the dropdown with the new member
      populateMemberFilter(members); // Update the filter with the new member
    } catch (error) {
      console.error("Error adding member:", error);
    }
  });
})();

function displayTasks(tasks: Task[], members: Member[]) {
  console.log("Displaying tasks:", tasks); // Log tasks before displaying
  const todoList = document.getElementById("todo-list") as HTMLElement;
  const inProgressList = document.getElementById(
    "inprogress-list"
  ) as HTMLElement;
  const doneList = document.getElementById("done-list") as HTMLElement; // Get the done list element

  todoList.innerHTML = ""; // Clear the list before adding tasks
  inProgressList.innerHTML = ""; // Clear the in-progress list before adding tasks
  doneList.innerHTML = ""; // Clear the done list before adding tasks

  if (!Array.isArray(tasks)) {
    console.error("Tasks is not an array");
    return;
  }

  tasks.forEach((task) => {
    console.log("Processing task:", task); // Log each task
    const taskElement = createTaskElement(task, members, tasks);
    if (task.status === "to do") {
      todoList.appendChild(taskElement);
      console.log("Displayed task in to do:", task); // Log displayed tasks
    } else if (task.status === "in progress") {
      inProgressList.appendChild(taskElement);
      console.log("Displayed task in progress:", task); // Log displayed tasks
    } else if (task.status === "done") {
      doneList.appendChild(taskElement);
      console.log("Displayed task in done:", task); // Log displayed tasks
    } else {
      console.log("Task not displayed due to status:", task.status); // Log tasks not displayed
    }
  });
}

function createTaskElement(
  task: Task,
  members: Member[],
  tasks: Task[]
): HTMLElement {
  const taskElement = document.createElement("div");
  taskElement.className = "task";
  const assignedName = task.assigned
    ? getMemberNameById(members, task.assigned)
    : "Unassigned";

  const memberOptions = members
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
        console.log("Task updated:", task);
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
        console.log("Task marked as done:", task);
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
        console.log("Task removed:", task);
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

function getMemberNameById(members: Member[], memberId: string): string {
  const member = members.find((member) => member.id === memberId);
  return member ? member.name : "Unknown";
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

function populateMemberDropdown(members: Member[]) {
  const assignedDropdowns = document.querySelectorAll(
    ".assign-member-dropdown"
  ) as NodeListOf<HTMLSelectElement>;

  if (!assignedDropdowns.length) {
    console.error("Assigned dropdown elements not found");
    return;
  }

  assignedDropdowns.forEach((assignedDropdown) => {
    assignedDropdown.innerHTML = '<option value="">Select a member</option>'; // Default option
    members.forEach((member) => {
      const option = document.createElement("option");
      option.value = member.id;
      option.textContent = member.name;
      assignedDropdown.appendChild(option);
    });
  });
}
