const API_BASE_URL = "http://localhost:3000";

export type Category = "UX" | "dev frontend" | "dev backend";
export type Status = "to do" | "in progress" | "done";

export type Task = {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: Status;
  timestamp: string;
  assigned?: string;
};

export type Member = {
  id: string;
  name: string;
  tasks: Task[];
};

async function fetchTasks(): Promise<Task[] | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/task`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const tasks: Task[] = await response.json();
    return tasks;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
  }
}

async function fetchMembers(): Promise<Member[] | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/member`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const members: Member[] = await response.json();
    return members;
  } catch (error) {
    console.error("Failed to fetch members:", error);
  }
}

async function addTask(
  task: Omit<Task, "id" | "timestamp" | "status">
): Promise<Task | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const newTask: Task = await response.json();
    return newTask;
  } catch (error) {
    console.error("Failed to add task:", error);
  }
}

export { fetchTasks, fetchMembers, addTask };
