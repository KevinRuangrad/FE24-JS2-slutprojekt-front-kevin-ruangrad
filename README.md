# FE24-JS2-slutprojekt-front-kevin-ruangrad

Overview
This project is a task management application that allows users to manage tasks and members. It includes features such as filtering tasks by category and member, and sorting tasks by timestamp and title.

Features

- Task Management: Create, update, and delete tasks.
- Member Management: Add and manage members.
- Filtering: Filter tasks by category and assigned member.
- Sorting: Sort tasks by timestamp (newest to oldest, oldest to newest) and title (A to Z, Z to A).

Project Structure

- api/: Contains API calls to fetch tasks and members.
- events/: Contains event listeners for handling user interactions.
- dom/: Contains functions for DOM manipulation.
- utils/: Contains utility functions.
- main.ts: Entry point of the application, initializes the task manager.

Usage

1.  Initialize: The application fetches tasks and members from the API and displays them.
2.  Filter: Use the filter dropdowns to filter tasks by category and member.
3.  Sort: Use the sort dropdowns to sort tasks by timestamp and title.
4.  Manage Tasks: Add new tasks using the task form. Update task status and assigned member. Remove tasks when completed.
5.  Manage Members: Add new members using the member form.
