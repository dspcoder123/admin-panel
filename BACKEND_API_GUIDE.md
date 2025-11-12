# Backend API Implementation Guide

This guide shows how to implement the Telegram API endpoint that the admin panel expects.

## Endpoint Required

**POST** `http://localhost:4000/api/telegram/send`

## Request Format

```json
{
  "message": "Your message text here"
}
```

### Example Requests

**Using cURL**:

```bash
curl -X POST http://localhost:4000/api/telegram/send \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello from Admin Panel!"}'
```

**Using JavaScript/Node.js**:

```javascript
fetch("http://localhost:4000/api/telegram/send", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: "Hello from Admin Panel!",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

**Using Python (requests)**:

```python
import requests

url = 'http://localhost:4000/api/telegram/send'
headers = {'Content-Type': 'application/json'}
data = {'message': 'Hello from Admin Panel!'}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

## Response Format

### Success Response (HTTP 200)

```json
{
  "success": true,
  "message": "Message sent successfully",
  "messageId": "12345",
  "chatId": "your_channel_id"
}
```

### Error Response (HTTP 400/500)

```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

## Example Node.js/Express Implementation

```javascript
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const app = express();

// Telegram Bot Setup
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const bot = new TelegramBot(TOKEN, { polling: true });

app.use(express.json());

// Telegram Send Endpoint
app.post("/api/telegram/send", async (req, res) => {
  try {
    const { message } = req.body;

    // Validate message
    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid message format",
      });
    }

    if (message.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    if (message.length > 4096) {
      return res.status(400).json({
        success: false,
        message: "Message exceeds 4096 character limit",
      });
    }

    // Send message to Telegram
    const result = await bot.sendMessage(CHANNEL_ID, message);

    return res.json({
      success: true,
      message: "Message sent successfully",
      messageId: result.message_id,
      chatId: result.chat.id,
    });
  } catch (error) {
    console.error("Telegram API Error:", error);
    return res.status(500).json({
      success: false,
      message: `Error sending message: ${error.message}`,
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Environment Variables for Node.js

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHANNEL_ID=your_channel_id_here
PORT=4000
```

## Example Python/Flask Implementation

```python
from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
TELEGRAM_CHANNEL_ID = os.getenv('TELEGRAM_CHANNEL_ID')

@app.route('/api/telegram/send', methods=['POST'])
def send_telegram_message():
    try:
        data = request.get_json()
        message = data.get('message', '').strip()

        # Validation
        if not message:
            return jsonify({
                'success': False,
                'message': 'Message cannot be empty'
            }), 400

        if len(message) > 4096:
            return jsonify({
                'success': False,
                'message': 'Message exceeds 4096 character limit'
            }), 400

        # Send to Telegram
        url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage'
        payload = {
            'chat_id': TELEGRAM_CHANNEL_ID,
            'text': message
        }

        response = requests.post(url, json=payload)
        result = response.json()

        if response.status_code == 200:
            return jsonify({
                'success': True,
                'message': 'Message sent successfully',
                'messageId': result['result']['message_id']
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result.get('description', 'Failed to send message')
            }), 400

    except Exception as error:
        return jsonify({
            'success': False,
            'message': f'Error: {str(error)}'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4000, debug=True)
```

### Environment Variables for Python

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHANNEL_ID=your_channel_id_here
```

## Getting Telegram Bot Token & Channel ID

### 1. Create a Bot

- Message [@BotFather](https://t.me/botfather) on Telegram
- Follow the instructions to create a new bot
- Save the TOKEN

### 2. Get Channel ID

- Create a Telegram channel (or use existing one)
- Add your bot as admin to the channel
- Send a message to the channel
- Send a request to: `https://api.telegram.org/bot{TOKEN}/getUpdates`
- Find your channel ID in the response

### 3. Alternative: Get Channel ID

- Use [@userinfobot](https://t.me/userinfobot) to find your channel ID

## CORS Configuration

If the admin panel is on a different domain, add CORS headers:

**Node.js/Express**:

```javascript
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
```

**Python/Flask**:

```python
from flask_cors import CORS
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
```

## Testing the Endpoint

### Using Postman

1. Create new POST request
2. URL: `http://localhost:4000/api/telegram/send`
3. Headers: `Content-Type: application/json`
4. Body (raw):
   ```json
   {
     "message": "Test message from Postman"
   }
   ```
5. Click Send

### Using Admin Panel

1. Start the backend server
2. Update `.env.local` if needed
3. Run frontend: `npm run dev`
4. Log in with `admin` / `password123`
5. Go to "Telegram Channel" tab
6. Type a message
7. Click "Send to Telegram"
8. Should see success toast notification

## Error Handling

The admin panel expects these HTTP status codes:

- **200**: Message sent successfully
- **400**: Bad request (validation error)
- **401**: Unauthorized
- **500**: Server error

Response format for errors:

```json
{
  "message": "Human-readable error description"
}
```

This will be displayed in the error toast to the user.

## Rate Limiting (Optional)

Consider implementing rate limiting to prevent spam:

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
});

app.post("/api/telegram/send", limiter, async (req, res) => {
  // ... your code
});
```

## Logging

Implement logging to track messages sent:

```javascript
// Simple logging
app.post("/api/telegram/send", async (req, res) => {
  const { message } = req.body;
  console.log(
    `[${new Date().toISOString()}] Message sent: ${message.substring(0, 50)}...`
  );
  // ... rest of code
});
```

---

**Ready to integrate!** Follow this guide to create your backend endpoint and connect it with the admin panel.
