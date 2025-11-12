# Admin Panel - Telegram Integration

A professional admin dashboard built with Next.js 16, React 19, and Tailwind CSS v4 with integrated Telegram messaging functionality.

## Features

✨ **Professional Admin Dashboard**

- Beautiful sidebar navigation with collapsible menu
- Responsive design optimized for all devices
- Clean and modern UI with Tailwind CSS

🔐 **Authentication System**

- Secure login page with credential validation
- Cookie-based session management
- Protected dashboard routes with middleware

📱 **Telegram Integration**

- Send messages directly to Telegram channels
- Real-time toast notifications
- Message character counter
- Form validation and error handling

📊 **Home Dashboard**

- Welcome overview with key statistics
- Feature highlights
- Quick start guide
- System status indicators

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.0
- **Styling**: Tailwind CSS v4.1.17
- **Notifications**: react-hot-toast
- **Language**: TypeScript 5

## Setup Instructions

### 1. Installation

```bash
npm install
```

### 2. Environment Variables

Create or update `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3. Backend API

The admin panel expects your backend to be running on `http://localhost:4000` with this endpoint:

**POST** `/api/telegram/send`

Request body:

```json
{
  "message": "Your message text here"
}
```

Response (on success):

```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and log in with:

- **Username**: `admin`
- **Password**: `password123`

## Project Structure

```
admin-panel/
├── app/
│   ├── layout.tsx              # Root layout with ToastProvider
│   ├── globals.css             # Global Tailwind styles
│   ├── page.tsx                # Home (redirects to login)
│   ├── login/
│   │   └── page.tsx            # Login page
│   └── dashboard/
│       └── page.tsx            # Main dashboard with sidebar
├── components/
│   ├── Sidebar.tsx             # Navigation sidebar
│   ├── HomeTab.tsx             # Dashboard home content
│   ├── TelegramTab.tsx         # Telegram messaging interface
│   └── ToastProvider.tsx       # Toast notification provider
├── middleware.ts               # Route protection middleware
├── .env.local                  # Environment variables
└── tailwind.config.js          # Tailwind configuration
```

## Key Components

### Sidebar Component

- Collapsible navigation menu
- Active tab highlighting
- Logout button with cookie clearing
- Smooth transitions and animations

### HomeTab Component

- Welcome banner with gradient
- Statistics cards
- Feature highlights grid
- Quick start guide

### TelegramTab Component

- Message textarea with character counter
- Submit and clear buttons
- Loading states
- Tips and status information
- Message format example

### Toast Notifications

- Success messages (green)
- Error messages (red)
- Auto-dismiss after 3-4 seconds
- Top-right positioning

## Features in Detail

### Authentication Flow

1. User visits `/` → Redirected to `/login`
2. User enters credentials → Validated against hardcoded values
3. On success → Cookie set (`isLoggedIn=true`) and redirected to `/dashboard`
4. If unauthenticated → Middleware redirects to `/login`

### Telegram Message Sending

1. User navigates to "Telegram Channel" tab
2. Enters message in textarea (max 4096 characters)
3. Clicks "Send to Telegram" button
4. API call to `http://localhost:4000/api/telegram/send`
5. On success → Success toast shown and field cleared
6. On error → Error toast displayed with error message

### Responsive Design

- Sidebar adapts to screen size
- Mobile-friendly layout
- Collapsible navigation for smaller screens
- Flexible grid system

## Styling

The project uses **Tailwind CSS v4** with custom configuration:

- Dark gradient sidebar
- Blue accent colors
- Purple/Pink gradient headers
- Shadow and hover effects
- Smooth transitions

## Toast Notifications

Configured with:

- Position: Top-right
- Success: Green, 3 seconds
- Error: Red, 4 seconds
- Custom styling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Build for Production

```bash
npm run build
npm start
```

### Lint Code

```bash
npm run lint
```

## Notes

- **Hardcoded Credentials**: Currently uses hardcoded username/password for demo. For production, implement proper authentication.
- **API Configuration**: Update `.env.local` to point to your actual backend server
- **Message Limit**: Telegram messages are limited to 4096 characters per message

## Future Enhancements

- Message history/logs
- User management
- Multiple Telegram channels
- Scheduled messages
- Analytics and statistics
- Dark mode toggle
- Message templates
- File/media support

## License

MIT

---

Created with ❤️ by Admin Panel Team
