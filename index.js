const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
require('dotenv').config();  // Load environment variables from .env file

const app = express();
const port = 8080;

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
  const name = req.body.name;
  try {
    // Call ChatGPT API using the API key from environment variables
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [{"role": "user", "content": `Tell me about the name ${name}`}],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = response.data.choices[0].message.content;
    res.send(`<html>
                <head>
                  <link rel="stylesheet" href="/styles.css">
                </head>
                <body>
                  <div class="container">
                    <h1>Information about ${name}</h1>
                    <div class="response-container">
                      <p>${data}</p>
                    </div>
                    <a href="/">Go back</a>
                  </div>
                </body>
              </html>`);
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
    res.send(`<html>
                <head>
                  <link rel="stylesheet" href="/styles.css">
                </head>
                <body>
                  <div class="container">
                    <h1>Error</h1>
                    <div class="response-container">
                      <p>Sorry, there was an error processing your request. Please try again later.</p>
                    </div>
                    <a href="/">Go back</a>
                  </div>
                </body>
              </html>`);
  }
});

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
