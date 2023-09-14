const express = require('express');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/taskRoutes'); // Importing the task routes
const authRoutes = require('./routes/authRoutes'); // Importing the auth routes

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
