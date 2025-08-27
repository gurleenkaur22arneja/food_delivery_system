# Full-Stack FoodieExpress( food delivery platform) Management System

## Project Overview

This project is a full-stack web application designed to manage **[Briefly describe what your application manages, e.g., "product inventory", "student records", "task assignments"]**. It demonstrates robust CRUD (Create, Read, Update, Delete) operations, secure user authentication, and adherence to modern DevOps practices.

The application is built with a Node.js and Express.js backend API, a dynamic React.js frontend, and uses MongoDB for data persistence. The entire software development lifecycle, from project management with JIRA to automated deployment via GitHub Actions to an AWS EC2 instance, has been meticulously implemented.

## Live Application

You can access the deployed application via the following URL:

*   **Public URL**: http://13.236.87.173:3000/

### Access Credentials (for demonstration)

To access the dashboard and explore the application's features, you may use the following demonstration credentials:

*   **Role**: Restaurent Owner
*   **Username**: gurleen@gmail.com
*   **Password**: 1234

*   **Role**: Delivery Agent
*   **Username**: derrick@gmail.com
*   **Password**: 1234

*   **Role**: CUstomer
*   **Username**: gurleen1@gmail.com
*   **Password**: 1234

*Note: These credentials are provided for initial review. We encourage you to register a new account to experience the full user registration and login flow.*

## Key Features

*   **User Authentication**: Secure user registration, login, and session management using JSON Web Tokens (JWT).
*   **[Your Chosen Entity] Management**: Comprehensive CRUD operations (Create, Read, Update, Delete)
*   **Secure API Endpoints**: All data manipulation operations are protected, ensuring only authenticated users can perform actions.
*   **Responsive User Interface**: A user-friendly and intuitive interface built with React.js.
*   **Automated CI/CD Pipeline**: Seamless and continuous deployment to AWS EC2 via GitHub Actions.

## Technologies Used

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database ODM**: Mongoose (for MongoDB interaction)
*   **Authentication**: JSON Web Tokens (JWT), bcryptjs (for password hashing)

### Frontend
*   **Library**: React.js
*   **Routing**: React Router DOM
*   **HTTP Client**: Axios

### Database
*   **NoSQL Database**: MongoDB

### DevOps & Project Management
*   **Project Management**: JIRA
*   **Version Control**: Git, GitHub
*   **Continuous Integration/Continuous Deployment (CI/CD)**: GitHub Actions
*   **Deployment Target**: AWS EC2 Instance
*   **Process Manager**: PM2 (for Node.js application management on EC2)

## Project Management

Our project development was meticulously managed using JIRA. You can review the project's epics, user stories, sub-tasks, and sprint progress here:

*   **JIRA Board URL**: https://gurleenarneja705.atlassian.net/jira/software/projects/FDS/boards/34

## Repository Structure

This repository is organised into two main directories:

*   **Backend**: Contains the Node.js/Express.js API.
    *   **Link**: https://github.com/gurleenkaur22arneja/food_delivery_system/tree/main/backend
*   **Frontend**: Contains the React.js user interface.
    *   **Link**: https://github.com/gurleenkaur22arneja/food_delivery_system/tree/main/frontend

## Getting Started (Local Development)

To set up and run this project on your local machine, please follow these instructions:

### Prerequisites

Ensure you have the following installed:

*   **Node.js**: Version 18 or higher (LTS recommended).
*   **npm** or **Yarn**: A package manager for Node.js.
*   **MongoDB**: A running instance (local or cloud-based like MongoDB Atlas).
*   **Git**: For cloning the repository.

### 1. Clone the Repository

First, clone the project repository to your local machine:
The frontend application will be accessible in your web browser at `http://localhost:3000`.

## CI/CD Pipeline

This project features a robust Continuous Integration and Continuous Deployment (CI/CD) pipeline implemented using **GitHub Actions**. This pipeline automates the process of testing and deploying the application to an AWS EC2 instance, ensuring rapid and reliable updates.

### Workflow Overview

The CI/CD workflow is triggered on every push to the `main` branch and performs the following steps:

1.  **Checkout Code**: Fetches the latest code from the GitHub repository.
2.  **Setup Node.js**: Configures the appropriate Node.js environment on the self-hosted runner.
3.  **Install Dependencies**: Installs all required Node.js packages for both the backend and frontend using Yarn.
4.  **Build Frontend**: Creates an optimised production build of the React.js frontend application.
5.  **Run Backend Tests**: Executes unit and integration tests for the backend to ensure code quality and functionality.
6.  **Create `.env` File**: Dynamically constructs the `.env` file on the EC2 instance using sensitive environment variables securely stored as GitHub Secrets. This ensures the application has the correct configuration for the production environment.
7.  **Deploy Application**:
    *   Stops all running PM2 processes on the EC2 instance.
    *   Ensures the latest code is in place.
    *   Restarts all PM2-managed applications, allowing them to pick up the new code and the updated `.env` configuration.

This automated process ensures that any changes pushed to the `main` branch are quickly and reliably deployed to the production environment, facilitating continuous delivery.

## Author

*   **Full Name**: Gurleen
*   **Student ID**: [Your Student ID]