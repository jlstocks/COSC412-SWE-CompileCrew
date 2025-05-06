require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const db = require('./db');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

db.query(`SELECT 1`)
  .then(() => console.log('Database connection successful'))
  .catch(err => console.error('Database connection error:', err));


// User registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, username, email, password, balance } = req.body;
    
    // Check if username already exists
    const [existingUsers] = await db.execute(
      'SELECT userID FROM User WHERE username = ?',
      [username]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }
    
    // Insert user into database
    const [result] = await db.execute(
      'INSERT INTO User (username, email, _password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    
    const userId = result.insertId;
    
    // Create account for the user
    const [accountResult] = await db.execute(
      'INSERT INTO Account (userID, balance) VALUES (?, ?)',
      [userId, balance]
    );
    
    const accountId = accountResult.insertId;
    
    // Create initial budget
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    
    await db.execute(
      'INSERT INTO Budget (userID, limitAmount, startDate, endDate) VALUES (?, ?, ?, ?)',
      [userId, balance, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      userId,
      accountId
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message });
  }
});

// User login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Get user from database
    const [users] = await db.execute(
      'SELECT u.userID, u.username, u.email, a.accID, a.balance ' +
      'FROM User u ' +
      'JOIN Account a ON u.userID = a.userID ' +
      'WHERE u.username = ? AND u._password = ?',
      [username, password]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    // Get user's budget
    const [budgets] = await db.execute(
      'SELECT limitAmount FROM Budget WHERE userID = ? AND endDate >= CURDATE() ORDER BY endDate ASC LIMIT 1',
      [users[0].userID]
    );
    
    const user = {
      id: users[0].userID,
      username: users[0].username,
      email: users[0].email,
      accountId: users[0].accID,
      balance: users[0].balance,
      budget: budgets.length > 0 ? budgets[0].limitAmount : users[0].balance
    };
    
    res.json({ 
      success: true,
      user
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update balance endpoint
app.post('/api/update-balance', async (req, res) => {
  try {
    const { userId, accountId, balance } = req.body;
    
    // Update account balance
    await db.execute(
      'UPDATE Account SET balance = ? WHERE accID = ? AND userID = ?',
      [balance, accountId, userId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating balance:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update budget endpoint
app.post('/api/update-budget', async (req, res) => {
  try {
    const { userId, budget } = req.body;
    
    // Check if budget exists for user
    const [budgets] = await db.execute(
      'SELECT * FROM Budget WHERE userID = ? AND endDate >= CURDATE() ORDER BY endDate ASC LIMIT 1',
      [userId]
    );
    
    if (budgets.length > 0) {
      // Update existing budget
      await db.execute(
        'UPDATE Budget SET limitAmount = ? WHERE budgetID = ?',
        [budget, budgets[0].budgetID]
      );
    } else {
      // Create new budget (for current month)
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      
      await db.execute(
        'INSERT INTO Budget (userID, limitAmount, startDate, endDate) VALUES (?, ?, ?, ?)',
        [userId, budget, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
      );
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add expense endpoint
app.post('/api/expenses', async (req, res) => {
  try {
    const { userId, accountId, categoryId, amount, name } = req.body;
    
    // Insert expense into database
    await db.execute(
      'INSERT INTO Expenses (userID, accID, categoryID, amount, _date) VALUES (?, ?, ?, ?, CURDATE())',
      [userId, accountId, categoryId, amount]
    );
    
    // Update account balance
    await db.execute(
      'UPDATE Account SET balance = balance - ? WHERE accID = ?',
      [amount, accountId]
    );
    
    // Get updated balance
    const [accounts] = await db.execute(
      'SELECT balance FROM Account WHERE accID = ?',
      [accountId]
    );
    
    res.json({ 
      success: true,
      newBalance: accounts[0].balance
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get recent expenses endpoint
app.get('/api/expenses/:userId/recent', async (req, res) => {
  try {
    const userId = req.params.userId;
    const days = req.query.days || 7;
    
    const [expenses] = await db.execute(
      'SELECT e.expenseID, e.amount, e._date, c._name as categoryName ' +
      'FROM Expenses e ' +
      'LEFT JOIN Category c ON e.categoryID = c.categoryID ' +
      'WHERE e.userID = ? AND e._date >= DATE_SUB(CURDATE(), INTERVAL ? DAY) ' +
      'ORDER BY e._date DESC',
      [userId, days]
    );
    
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching recent expenses:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get categories endpoint
app.get('/api/categories', async (req, res) => {
  try {
    const [categories] = await db.execute(
      'SELECT categoryID, _name, _description FROM Category'
    );
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get reports endpoint
app.get('/api/reports/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get expenses grouped by category
    const [categoryTotals] = await db.execute(
      'SELECT c._name, SUM(e.amount) as total ' +
      'FROM Expenses e ' +
      'LEFT JOIN Category c ON e.categoryID = c.categoryID ' +
      'WHERE e.userID = ? ' +
      'GROUP BY e.categoryID',
      [userId]
    );
    
    // Get total expenses
    const [totalResult] = await db.execute(
      'SELECT SUM(amount) as total FROM Expenses WHERE userID = ?',
      [userId]
    );
    
    res.json({
      categoryTotals,
      total: totalResult[0].total || 0
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Make a request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant with financial expertise." },
          { role: "user", content: message }
        ]
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    res.json({
      reply: data.choices[0].message.content
    });
  } catch (error) {
    console.error('Error in AI chat endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
