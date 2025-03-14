import { fetchTasks, fetchMembers, Task, Member } from "./api/api";
import { initializeEventListeners } from "./events/eventListeners";
import { displayTasks } from "./dom/domManipulation";
import { populateMemberFilter, populateMemberDropdown } from "./utils/utils";

(async () => {
  let tasks: Task[] = [];
  let members: Member[] = [];

  try {
    // Fetch tasks from the API
    const tasksResponse = await fetchTasks();
    tasks = tasksResponse;

    // Fetch members from the API
    members = await fetchMembers();

    // Display tasks if available
    if (tasks && tasks.length > 0) {
      displayTasks(tasks, members);
    } else {
      console.error("No tasks to display");
    }

    // Populate member filters and dropdowns if members are available
    if (members.length > 0) {
      populateMemberFilter(members);
      populateMemberDropdown(members);
    } else {
      console.error("No members to display");
    }
  } catch (error) {
    console.error("Error fetching tasks or members:", error);
  }

  // Initialize event listeners
  initializeEventListeners(tasks, members);
})();
