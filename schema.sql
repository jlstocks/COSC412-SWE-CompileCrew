CREATE DATABASE IF NOT EXISTS stackntrack;
USE stackntrack;

# Create User table
CREATE TABLE User (
    userID INT AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    PRIMARY KEY userID
);

# Create Account table
CREATE TABLE Account (
    accID INT AUTO_INCREMENT,
    userID INT NOT NULL,
    balance DECIMAL(10,2) DEFAULT 0.00,
    PRIMARY KEY accID,
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
);

# Create Category table
CREATE TABLE Category (
    categoryID INT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT
    PRIMARY KEY categoryID
);

# Create Budget table
CREATE TABLE Budget (
    budgetID INT AUTO_INCREMENT,
    userID INT NOT NULL,
    limitAmount DECIMAL(10,2) NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    PRIMARY KEY budgetID
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
);

# Create Expenses table
CREATE TABLE Expenses (
    expenseID INT AUTO_INCREMENT,
    userID INT NOT NULL,
    accID INT NOT NULL,
    categoryID INT,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    PRIMARY KEY expenseID,
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE,
    FOREIGN KEY (accID) REFERENCES Account(accID) ON DELETE CASCADE,
    FOREIGN KEY (categoryID) REFERENCES Category(categoryID) ON DELETE SET NULL
);

# Create Report table
CREATE TABLE Report (
    reportID INT AUTO_INCREMENT,
    userID INT NOT NULL,
    dateGenerated DATE NOT NULL,
    summary TEXT,
    PRIMARY KEY reportID,
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
);

#Create SharedReport table
CREATE TABLE SharedReport (
    sharedID INT AUTO_INCREMENT,
    reportID INT NOT NULL,
    sharedWithUserID INT NOT NULL,
    PRIMARY KEY sharedID
    FOREIGN KEY (reportID) REFERENCES Report(reportID) ON DELETE CASCADE,
    FOREIGN KEY (sharedWithUserID) REFERENCES User(userID) ON DELETE CASCADE
);
