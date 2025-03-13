import { displayTasks } from "../dom/domManipulation";
import { addTask, addMember, Task, Member } from "../api/api";
import { populateMemberFilter, populateMemberDropdown } from "../utils/utils";

export async function initializeEventListeners(
  tasks: Task[],
  members: Member[]
) {
  document
    .getElementById("task-form")
    ?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);
      const newTask = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category"),
        status: "to do", // Default status
      } as Partial<Task>;

      try {
        const addedTask = await addTask(newTask);
        if (addedTask) {
          tasks.push(addedTask); // Update the original tasks array
          displayTasks(tasks, members); // Re-display tasks with the new task included
        }
      } catch (error) {
        console.error("Error adding task:", error);
      }
    });

  document
    .getElementById("add-member-form")
    ?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);
      const newMemberName = formData.get("name") as string;
      const newMemberRoles = Array.from(formData.getAll("roles")) as string[];

      const newMember = {
        name: newMemberName,
        roles: newMemberRoles,
      };

      try {
        const addedMember = await addMember(newMember);
        populateMemberDropdown(members); // Update the dropdown with the new member
        populateMemberFilter(members); // Update the filter with the new member
      } catch (error) {
        console.error("Error adding member:", error);
      }
    });

  document
    .getElementById("member-filter")
    ?.addEventListener("change", (event) => {
      const selectedMember = (event.target as HTMLSelectElement).value;
      displayTasks(tasks, members, undefined, selectedMember);
    });

  document
    .getElementById("category-filter")
    ?.querySelector("select")
    ?.addEventListener("change", (event) => {
      const selectedCategory = (event.target as HTMLSelectElement).value;
      displayTasks(tasks, members, selectedCategory);
    });

  document
    .getElementById("sort-timestamp")
    ?.querySelector("select")
    ?.addEventListener("change", (event) => {
      const sortOrder = (event.target as HTMLSelectElement).value;
      displayTasks(tasks, members, undefined, undefined, sortOrder);
    });

  document
    .getElementById("sort-title")
    ?.querySelector("select")
    ?.addEventListener("change", (event) => {
      const sortOrder = (event.target as HTMLSelectElement).value;
      displayTasks(tasks, members, undefined, undefined, undefined, sortOrder);
    });
}
