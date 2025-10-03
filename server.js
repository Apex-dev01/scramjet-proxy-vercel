const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Main page with About:blank cloaking and gradient UI
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proxy</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Arial', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      color: white;
    }
    .container {
      text-align: center;
      padding: 40px;
      max-width: 600px;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 20px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 30px;
      opacity: 0.9;
    }
    .input-group {
      margin-bottom: 20px;
    }
    input[type="text"] {
      width: 100%;
      padding: 15px;
      font-size: 1rem;
      border: none;
      border-radius: 8px;
      outline: none;
    }
    button {
      background: rgba(255, 255, 255, 0.2);
      border: 2px solid white;
      color: white;
      padding: 15px 40px;
      font-size: 1.1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      margin: 5px;
    }
    button:hover {
      background: white;
      color: #667eea;
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome</h1>
    <p>Enter a URL to browse through the proxy</p>
    <div class="input-group">
      <input type="text" id="urlInput" placeholder="https://example.com" />
    </div>
    <button onclick="openInAboutBlank()">Go</button>
  </div>
  
  <script>
    function openInAboutBlank() {
      const url = document.getElementById('urlInput').value;
      if (!url) {
        alert('Please enter a URL');
        return;
      }
      
      // About:blank cloaking
      const newWindow = window.open('about:blank', '_blank');
      if (newWindow) {
        const proxyUrl = '/proxy?url=' + encodeURIComponent(url);
        newWindow.document.write('<iframe src="' + proxyUrl + '" style="position:fixed;top:0;left:0;width:100%;height:100%;border:none;"></iframe>');
        newWindow.document.title = 'New Tab';
      }
    }
    
    // Allow Enter key to submit
    document.getElementById('urlInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        openInAboutBlank();
      }
    });
  </script>
</body>
</html>
  `);
});

// Proxy endpoint - basic implementation
app.get('/proxy', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('URL parameter is required');
  }
  
  try {
    // This is a simplified proxy implementation
    // In production, you would use Scramjet's actual proxy middleware
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(targetUrl);
    const html = await response.text();
    res.send(html);
  } catch (error) {
    res.status(500).send('Error fetching the requested URL: ' + error.message);
  }
});

// Export for Vercel
module.exports = app;

// Start server locally
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
