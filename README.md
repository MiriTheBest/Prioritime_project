Prioritime Frontend 🖥️ – Automated Task Scheduling UI

📌 Overview
The frontend of Prioritime is a React-based web application designed to provide users with an intuitive and dynamic task scheduling experience. It enables users to set scheduling preferences, automate task assignments, and manually manage tasks and events. With interactive calendar views, color-coded tasks, and easy task organization, Prioritime ensures efficient task management while maintaining user flexibility.

This frontend is built using modern UI frameworks and follows a responsive, user-friendly design to provide a seamless experience across different devices.

🚀 Technologies Used

Core Frontend Stack
React – Component-based architecture for building an interactive UI.
Material UI & Ant Design – Provides a polished, professional look with responsive design components.
FullCalendar – Integrates a dynamic and interactive calendar interface for scheduling.
API Communication & Authentication
Axios – Handles secure API requests to the backend.
JWT (JSON Web Tokens) – Ensures secure authentication & authorization between frontend and backend.
Styling & Responsiveness
Material UI & Ant Design styling – Custom styles for a clean, professional appearance.
Flexbox & Grid – Ensures proper alignment and layout responsiveness.


🛠️ Core Features & Components

📆 Calendar & Scheduling

✔ Month View Page:

Displays an overview of all scheduled tasks & events for the month.
Differentiates tasks & events using color-coding.
Allows navigation to different months and years.
Supports task re-automation for efficient rescheduling.
Users can set days off to prevent scheduling conflicts.

![pr3](https://github.com/user-attachments/assets/014b6c3a-2846-4bd3-8d98-427eb5927f60)

✔ Day View Page:

Provides a detailed daily schedule with individual time slots.
Highlights tasks with deadlines for better prioritization.
Users can edit, delete, or automate tasks for the selected day.
The scheduling algorithm can re-automate tasks dynamically.


📋 Task & Event Management
✔ Task Page:

Lists all non-automated tasks with key details.
Separate section for recurring tasks.
Allows users to sort & search tasks by name, duration, deadline, tags, and category.
Users can bulk automate multiple tasks with one click.
![pr1](https://github.com/user-attachments/assets/03ba127a-57d1-40ac-afeb-0467f32b2562)


✔ Task Categorization & Tagging:

Tasks can be categorized into predefined categories (personal, home, school, sport, work) or custom user-defined categories.
Tags offer an additional layer of organization for grouping similar tasks.

✔ Recurring Task Support:

Users can create tasks that repeat at specific intervals, ensuring efficient workflow automation.

✔ Task & Event Editing:

Edit Task Modal: Allows users to modify existing tasks quickly.
Edit Event Modal: Enables easy updates to scheduled events.


✔ Event Management:

Users can add custom events alongside tasks.
Supports reminders and recurrence settings for events.

⚙️ User Preferences & Customization

✔ Preferences Modal:

Users can set task scheduling preferences, including preferred work periods (morning, afternoon, evening, night).
Allows users to define workdays and set "days off" where automation is disabled.
Users can specify the start and end of their workday for scheduling.
![pr2](https://github.com/user-attachments/assets/7567961c-40cb-43f3-bfe7-f48fbe8eced7)


✔ User Account System:

Secure authentication with JWT tokens.
Supports user registration, login, and profile management.
