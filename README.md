# **Wellness Studio Appointment Scheduling System**

A full-stack appointment scheduling web application for a wellness studio, featuring separate **admin** and **client** interfaces.  
Built with **Next.js** (frontend) and **.NET Core Web API** (backend), using **Azure SQL Database** for persistent storage.

---

## **Table of Contents**

1. [Features](#features)  
2. [Project Structure](#project-structure)  
3. [Tech Stack](#tech-stack)  
4. [Getting Started](#getting-started)  
    - [Prerequisites](#prerequisites)  
    - [Clone the Repository](#clone-the-repository)  
    - [Backend Setup](#backend-setup)  
    - [Frontend Setup](#frontend-setup)  
5. [Usage](#usage)  
6. [Demo Login Credentials](#demo-login-credentials)  


---

## **Features**

- **Admin Portal:**
  - Login as admin
  - Manage time slots (add, edit, delete)
  - View and cancel appointments

- **Client Portal:**
  - Login as client
  - View available appointment slots
  - Book appointments
  - View own appointments

- **General:**
  - JWT authentication and refresh token logic
  - Validation (frontend & backend) 
  - Azure SQL Database (no need for local SQL Server)

---

## **Project Structure**

1. **`wellness-studio-frontend/`**:  
   The frontend part of the application built with **Next.js**. It handles the user interface, such as displaying available time slots, booking appointments, managing user sessions, etc.

2. **`wellness-studio-server/`**:  
   The backend part of the application built with **.NET Core Web API**. It handles logic for managing time slots, appointments, users, and the interaction with the **Azure SQL Database**.
---

## **Tech Stack**

- **Frontend**:  
  - Next.js (TypeScript)
  - Tailwind CSS
  - Axios (for API calls)

- **Backend**:  
  - ASP.NET Core Web API (C#)
  - Entity Framework Core (for database interaction)
  - FluentValidation (for input validation)
  - AutoMapper (for mapping between entities and DTOs)

- **Database**:  
  - Azure SQL Database

- **Authentication**:  
  - JWT (access and refresh tokens)

---

## **Getting Started**

### **Prerequisites**

- [Node.js & npm](https://nodejs.org/) (for frontend)
- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download) (for backend)
- Access to [Azure SQL Database](https://portal.azure.com/) and connection details

---

### **Clone the Repository**

```bash
git clone https://github.com/yourusername/AppointmentSchedulingSystem.git
cd AppointmentSchedulingSystem
```

### **Backend Setup**
- Navigate to Backend Folder and restore dependencies

```bash
cd wellness-studio-server
dotnet restore
```
- Run the API

```bash
dotnet run
```
- API will start (default: https://localhost:7264/ or as configured).

### **Frontend Setup**
 - Navigate to Frontend Folder and Install Dependencies

 ```bash
 cd ../wellness-studio-frontend
 npm install

 ```
 - Run the Frontend
 
 ```bash
 npx next dev
  ```
  - App will be available at http://localhost:3000

  ### **Usage**
  - Access the App:

    - Go to http://localhost:3000 in your browser.

  - Login:

    - Use demo credentials displayed on the login screen.

- Admin Functions:

     - Add, edit, delete, and manage time slots.

     - View/cancel all appointments.

- Client Functions:

    - Book new appointments.

    - See only available slots (no double-booking).

    - View your own appointments.
 ### **Demo Login Credentials**

 - These credentials are shown on the frontend login page (for demo/testing):

 | Role    |Username | Password  |
| -------- | ------- |------- |
|  Admin | admin   | admin123 
| Client | client1     | client123






