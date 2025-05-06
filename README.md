# CompileCrew
StacknTrack personal finance project for Software Engineering (COSC412).

## Team Members
- Jaelyn McCracken
- Gavin Labino
- Kyle Miller
- Ethan Sakryd
- Jackson Stockstill

## Necessary Software/Programs
StacknTrack uses the following software to run. 
Testing for the database was done using MySQL Server and MySQL Workbench. MySQL Workbench was used during testing to view data being added to the database. Alternatively, MariaDB is compatible but has not been tested.
- [Download Node.js](https://nodejs.org/en/download)
- [Download MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- [Download MySQL Community Workbench](https://dev.mysql.com/downloads/workbench/)
- [Download Google Chrome](https://www.google.com/intl/en_uk/chrome/)

StacknTrack uses an API key from OpenAI for its financial advisor chat feature.
- [Visit OpenAI Platform](https://platform.openai.com/api-keys)

Additionally, Git will allow for easy cloning of this repository but is not required to run.
- [Download Git](https://git-scm.com/downloads)

## Required Packages
The following packages are required for Node.js.
- Express: Framework for web application
- MySQL2: MySQL for Node.js
- dotenv: Loads environment variables stored in .env
- cors: Cross-origin resource sharing
- node-fetch: Necessary for API implementation
- path: Utilities for file paths

## Installation
1. Clone the repository using git and navigate into directory,
```
git clone https://github.com/jlstocks/COSC412-SWE-CompileCrew
cd COSC412-SWE-CompileCrew
```
or curl the repository to a desired directory and unzip the contents.
```
curl -L -o repository.zip https://github.com/jlstocks/COSC412-SWE-CompileCrew/archive/refs/heads/main.zip
unzip repository.zip
cd COSC412-SWE-CompileCrew-main
```
2. Install the required packages.
```
npm install
```
3. Configure the database using the commandline,
```
mysql -u *username* -p < db/init.sql
mysql -u *username* -p < db/schema.sql
mysql -u *username* -p < db/seed.sql
```
or by using an instance of MySQL Workbench connected to your local MySQL Server. Run the `db/init.sql`, `db/schema.sql`, and `db/seed.sql` scripts inside the MySQL Workbench GUI to initialize and populate the database with sample data.
4. Create a .env file in the root directory of the project.
```
PORT=3000
DB_HOST=localhost
DB_USER=*username*
DB_PASSWORD=*password*
DB_NAME=stackntrack
API_KEY=*API Key*
```
## Running the Application
1. Start the server.
```
node server.js
```
2. Access the application via web browser of choice. Application is hosted on 3000 by default but may be defined in the .env configuration.
```
http://localhost:3000
```
