# Akpoho Invoicing Software

Akpoho Invoicing Software is an open-source software which provides quotation, invoicing, and receipt functionalities for small businesses. Akpoho means money in Annang language spoken by the Annang people of Akwa Ibom state, Nigeria.

The software is open-sourced in order the form a reference point for the development of a full-stack web application using Adonisjs and Vuejs. When fully-developed, you can use it for managing your invoices, receipts, and quotations for your business.

## Technology Stack

Akpoho Invoicing Software is developed with the following technologies:
1. The frontend is developed with the Quasar Framework (a Vuejs framework),
2. The backend is developed with the Adonisjs framework (a Nodejs framework),
3. MySQL is used for data persistence on the backend,
4. Redis is used for data caching and caching of authentication tokens

## Demo

You can explore the application through the demo site: https://demo.akpoho.com. Please note that Akpoho Software is still under active development and has not be released yet.

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
7. Create a new `.env` file for the backend and generate a new `APP_KEY`. Copy the output and paste it into the `.env` file at the end of the line for `APP_KEY`.
    ```bash
    cp .env.example .env
    node ace generate:key #Generates new APP_KEY
    ```
8. Generate a new UUID namespace for the application. Copy the output and paste it into the `.env` file at the end of the line for `UUID_NAMESPACE`.
   ```bash
    ./node_modules/.bin/uuid v4
    ```
9. Using any method you know, create a separate MYSQL user with a password, or use the `root` user. Create a new database (schema) for the application. Grant that new user access to the new database. If you are using `root` user, it has access to all databases for default.
10. Within the `.env` file, configure the MYSQL* and REDIS* variables to suit your environment setup.
11.  When the backend installation is completed, launch the backend server.
    ```bash
    yarn serve
    ```
12. Open a new terminal and launch the frontend server.
    ```bash
    cd /home/dev/akpoho-invoicing-software/frontend
    yarn serve
    ```
13. A browser window will open when the frontend is launched. 
14. You won't be able to log in because there are no users. So, it is time to seed the database.
15. To prepare (seed) the database with mock data:
    1.  First, let's migrate the database.

        ```bash
        node ace migration:run
        ```

    2.  Next, Let's seed important tables on the database. Run the index seeder command below to run all configured seeders for the application and fully setup it up in one command:
      
        ```bash        
        node ace db:seed --files="database/seeders/MainSeeder/Index.ts"
        ```
        If you are on Windows and having errors, you can run:
        
        ```bash        
        node ace db:seed --files="database\seeders\MainSeeder\Index.ts"
        ```

        Please note that this operation could take a couple of minutes.
    
16. After running the index seeder, all users generated will be logged to file. Check the file: `database/data/seeded_users.txt` and take note of the user credentials logged to the file.
   1.  Get an email and password of a user and log in.
   2.  Congratulations. You have successfully set up the Akpoho Invoicing Software.
17. After you log in, check the role of the logged-in user. Click the avatar on the top-right corner of the user interface. The role is displayed after the user's name. E.g. `CompanyAdmin`, `CompanyEditor`, or `CompanyStaff`. 
18. If you need to switch to another user with a higher role:
    1. Open the side drawer by clicking the menu icon on the top-left corner of the user interface. 
    2. Click `Settings`. On the Settings page, view Users. Take note of the email and role of the user you want to switch over to. 
    3. Log out. 
    4. Open the `database/data/seeded_users.txt` file to find the user's credentials. 
    5. Log in with the credentials.