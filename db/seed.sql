# Insert Sample Data into Tables for Testing and Demonstration
# User Table Data
INSERT INTO User (userID, username, email, password) VALUES 
(1, 'jstocks1', 'jstocks1@students.towson.edu', 'password1!');

# Account Table Data
INSERT INTO Account (accID, userID, balance) VALUES 
(1, 1, 1400.75);

# Category Table Data
INSERT INTO Category (categoryID, name, description) VALUES 
(1, 'Food', 'Expenses for groceries and restaurants.'),
(2, 'Transportation', 'Expenses for gas, bus, train, etc.'),
(3, 'Recreation', 'Expenses for recreational activity.'),
(4, 'Work-related', 'Work-related purchaes.'),
(5,'Home', 'Expenses for home-improvement, rent, etc.');

# Budget Table Data
INSERT INTO Budget (budgetID, userID, limitAmount, startDate, endDate) VALUES 
(1, 1, 500.00, '2025-04-01', '2025-04-30'),
(2, 1, 1500.00, '2025-05-01', ' 2025-05-31');

# Expenses Table Data
INSERT INTO Expenses (expenseID, userID, accID, categoryID, amount, date) VALUES 
(1, 1, 1, 1, 35.50, '2025-04-12'),
(2, 1, 1, 2, 42.75, '2025-04-20');

# Report Table Data
INSERT INTO Report (reportID, userID, dateGenerated, summary) VALUES 
(1, 1, '2025-04-30', 'Monthly spending report for April 2025. Total expenses: 78.25');

# SharedReport Table Data
#INSERT INTO SharedReport (sharedID, reportID, sharedWithUserID) VALUES 

