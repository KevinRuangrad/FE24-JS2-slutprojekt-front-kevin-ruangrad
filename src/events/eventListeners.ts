import { displayTasks } from "../dom/domManipulation";
import { addTask, addMember, Task, Member } from "../api/api";
import { populateMemberFilter, populateMemberDropdown } from "../utils/utils";

export async function initializeEventListeners(
  tasks: Task[],
  members: Member[]
) {
  displayTasks(tasks, members);

  document
    .getElementById("task-form")
    ?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      const category = formData.get("category") as string;

      if (!title) {
        alert("Please fill in the task title.");
        return;
      }
      if (!description) {
        alert("Please fill in the task description.");
        return;
      }
      if (!category) {
        alert("Please select a task category.");
        return;
      }

      const newTask = {
        title,
        description,
        category,
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
        alert("An error occurred while adding the task. Please try again.");
      }
    });

  document
    .getElementById("add-member-form")
    ?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target as HTMLFormElement);
      const newMemberName = formData.get("name") as string;
      const newMemberRoles = Array.from(formData.getAll("roles")) as (
        | "ux"
        | "dev backend"
        | "dev frontend"
      )[];

      if (!newMemberName) {
        alert("Please fill in the member name.");
        return;
      }
      if (newMemberRoles.length === 0) {
        alert("Please select at least one role for the member.");
        return;
      }

      console.log("New member roles:", newMemberRoles); // Debugging line

      const newMember: Partial<Member> = {
        name: newMemberName,
        roles: newMemberRoles,
      };

      try {
        const addedMember = await addMember(newMember);
        if (addedMember) {
          members.push(addedMember); // Update the original members array
          populateMemberDropdown(members); // Update the dropdown with the new member
          populateMemberFilter(members); // Update the filter with the new member
        }
      } catch (error) {
        console.error("Error adding member:", error);
        alert("An error occurred while adding the member. Please try again.");
      }
    });

  document
    .getElementById("member-filter")
    ?.addEventListener("change", (event) => {
      const selectedMember = (event.target as HTMLSelectElement).value;
      console.log("Selected member for filtering:", selectedMember); // Debugging line
      displayTasks(tasks, members, undefined, selectedMember);
    });

  document
    .getElementById("category-filter")
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
