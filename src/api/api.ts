const API_BASE_URL =
  "https://fe24-js2-slutprojekt-back-kevin-ruangrad.onrender.com";

// Task type definition
export type Task = {
  id: string;
  title: string;
  description: string;
  category: "dev frontend" | "dev backend" | "ux";
  status: "to do" | "in progress" | "done";
  timestamp: string;
  assigned?: string;
};

// Member type definition
export type Member = {
  id: string;
  name: string;
  roles: ("ux" | "dev backend" | "dev frontend")[];
  tasks: Task[];
};

// Fetch tasks from the API
async function fetchTasks(): Promise<Task[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/task`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const tasks = await response.json();
    return tasks;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return [];
  }
}

// Fetch members from the API
async function fetchMembers(): Promise<Member[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/member`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const members = await response.json();
    return members;
  } catch (error) {
    console.error("Failed to fetch members:", error);
    return [];
  }
}

// Add a new task to the API
async function addTask(task: Partial<Task>): Promise<Task | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to add task:", errorText);
      throw new Error("Network response was not ok");
    }

    const addedTask = await response.json();
    return addedTask;
  } catch (error) {
    console.error("Error adding task:", error);
    return null;
  }
}

// Add a new member to the API
async function addMember(newMember: Partial<Member>): Promise<Member | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/member`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMember),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const addedMember: Member = await response.json();
    return addedMember;
  } catch (error) {
    console.error("Failed to add new member:", error);
    return null;
  }
}

// Update an existing task in the API
async function updateTask(task: Task, memberId?: string): Promise<Task> {
  try {
    const response = await fetch(`${API_BASE_URL}/task/${task.id}/assign`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...task, assigned: memberId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to update task:", errorText);
      throw new Error("Failed to update task");
    }

    const updatedTask = await response.json();
    return updatedTask;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

// Mark a task as done in the API
async function markTaskAsDone(taskId: string): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/task/${taskId}/done`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to mark task as done");
  }

  return response.json();
}

// Remove a task from the API
async function removeTask(taskId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/task/${taskId}/complete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to remove task");
  }
}

export {
  fetchTasks,
  fetchMembers,
  addTask,
  addMember,
  updateTask,
  markTaskAsDone,
  removeTask,
};
