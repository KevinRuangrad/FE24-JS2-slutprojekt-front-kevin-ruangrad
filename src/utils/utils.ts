import { Member } from "../api/api";

export function getMemberNameById(members: Member[], memberId: string): string {
  const member = members.find((member) => member.id === memberId);
  return member ? member.name : "Unknown";
}

export function populateMemberFilter(members: Member[]) {
  const memberFilter = document.getElementById(
    "member-filter"
  ) as HTMLSelectElement;
  memberFilter.innerHTML = '<option value="all">All</option>'; // Reset the filter options
  members.forEach((member) => {
    const option = document.createElement("option");
    option.value = member.id;
    option.textContent = member.name;
    memberFilter.appendChild(option);
  });
}

export function populateMemberDropdown(members: Member[]) {
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
