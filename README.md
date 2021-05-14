# Akpoho Invoicing Software

Akpoho Invoicing Software is an open-source software which provides quotation, invoicing, and receipt functionalities for small businesses. Akpoho means money in Annang language spoken by the Annang people of Akwa Ibom state, Nigeria.

The software is open-sourced in order the form a reference point for the development of a full-stack web application using Adonisjs and Vuejs. When fully-developed, you can use it for managing your invoices, receipts, and quotations for your business.

## Technology Stack

Akpoho Invoicing Software is developed with the following technologies:
1. The frontend is developed with the Quasar Framework (a Vuejs framework),
2. The backend is developed with the Adonisjs framework (a Nodejs framework),
3. MySQL is used for data persistence on the backend,
4. Redis is used for data caching and caching of authentication tokens

## Pre-requisites for Installation

1. Make sure that you have fully setup MySQL on your preferred environment. Please research how to install MySQL on your preferred environment (Windows, MacOS, or Linux).
2. Make sure that you have fully installed and setup Redis on your preferred environment. Please research how to install Redis on your preferred environment.
3. Make sure that you have installed `git` on your preferred environment.
4. Make sure that you have installed `Nodejs` on your preferred environment.
5. Make sure that you have installed `yarn` package manager on your preferred environment

## How to Install

1. Launch your preferred terminal application. It could be the `Windows Powershell, Git Bash, or Windows Command Prompt`.

2. Change into your preferred directory on your environment
   
    ```bash
    cd /home/dev
    ```
3. Clone this repository
    ```bash
    git clone https://github.com/ndianabasi/akpoho-invoicing-software.git
    ```
4. After cloning, change into the application directory. You will see two sub-directories: `backend` and `frontend`.
    ```bash
    cd akpoho-invoicing-software
    ```
5. Change into the `frontend` folder and install all dependencies for the frontend.
    ```bash
    cd frontend
    yarn install
    ```
6. When completed, change into the `backend` directory and install all dependencies for the backend.
    ```bash
    cd ../backend
    yarn install
    ```
7. When the backend installation is completed, launch the backend server.
    ```bash
    yarn serve
    ```
8. Open a new terminal and launch the frontend server.
    ```bash
    cd /home/dev/akpoho-invoicing-software/frontend
    yarn serve
    ```
9. A browser window will open when the frontend is launched.
10. Seeding the database //To do
