const API_BASE_URL = "http://localhost:3000";

export type Task = {
  id: string;
  title: string;
  description: string;
  category: "frontend dev" | "backend dev" | "UX";
  status: "to do" | "in progress" | "done";
  timestamp: string;
  assigned?: string;
};

export type Member = {
  id: string;
  name: string;
  tasks: Task[];
};

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

async function addMember(newMember: Partial<Member>): Promise<Member | null> {
  try {
    console.log("Sending new member data:", newMember); // Log the request payload
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
    console.log("Added member response:", addedMember); // Log the response data

    if (!addedMember) {
      throw new Error("Failed to parse added member");
    }
    return addedMember;
  } catch (error) {
    console.error("Failed to add new member:", error);
    return null;
  }
}

async function updateTask(task: Task, memberId?: string): Promise<Task> {
  try {
    console.log("Updating task:", task); // Log the task being updated
    const response = await fetch(`${API_BASE_URL}/task/${task.id}/assign`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...task, memberId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to update task:", errorText); // Log the error response
      throw new Error("Failed to update task");
    }

    const updatedTask = await response.json();
    console.log("Updated task response:", updatedTask); // Log the updated task response
    return updatedTask;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
}

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
