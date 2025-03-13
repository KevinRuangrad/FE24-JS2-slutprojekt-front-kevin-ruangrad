import { fetchTasks, fetchMembers, Task, Member } from "./api/api";
import { initializeEventListeners } from "./events/eventListeners";
import { displayTasks } from "./dom/domManipulation";
import { populateMemberFilter, populateMemberDropdown } from "./utils/utils";

(async () => {
  let tasks: Task[] = [];
  let members: Member[] = [];

  try {
    const tasksResponse = await fetchTasks();
    tasks = tasksResponse;

    members = await fetchMembers();

    if (tasks && tasks.length > 0) {
      displayTasks(tasks, members);
    } else {
      console.error("No tasks to display");
    }

    if (members.length > 0) {
      populateMemberFilter(members);
      populateMemberDropdown(members);
    } else {
      console.error("No members to display");
    }
  } catch (error) {
    console.error("Error fetching tasks or members:", error);
  }

  initializeEventListeners(tasks, members);
})();
