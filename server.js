const http = require('http');
const app = require('./app');  

// Initialize HTTP server
const server = http.createServer(app);

// Port setup
const PORT = process.env.PORT || 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
