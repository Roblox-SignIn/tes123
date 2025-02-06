const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();

// Serve the frontend (search bar)
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Proxy Search</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background: #f3f4f6;
        }
        .container {
          text-align: center;
        }
        input[type="text"] {
          width: 80%;
          padding: 10px;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        button {
          padding: 10px 20px;
          font-size: 1rem;
          color: white;
          background: #007bff;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to the Proxy</h1>
        <form method="GET" action="/proxy">
          <input type="text" name="url" placeholder="Enter URL (e.g., https://example.com)" required />
          <button type="submit">Go</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// Handle dynamic proxying
app.use('/proxy', (req, res, next) => {
  const targetUrl = req.query.url; // Get the URL from the query string
  if (!targetUrl) {
    res.status(400).send('Error: Please specify a URL to proxy using the search bar.');
    return;
  }

  // Proxy the request to the specified URL
  createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,
    onError: (err, req, res) => {
      res.status(500).send('Error: Unable to process the request. Make sure the URL is correct.');
    },
    pathRewrite: {
      '^/proxy': '', // Remove "/proxy" from the path
    },
  })(req, res, next);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running at http://localhost:${PORT}`);
});
