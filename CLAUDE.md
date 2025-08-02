# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CubeMail is a Gmail web client built with React 18 and Chakra UI v1.8. It provides full Gmail functionality including reading, sending, replying, forwarding, and managing emails through Gmail's JavaScript API. The app runs entirely in the browser with OAuth 2.0 authentication.

## Common Commands

```bash
# Install dependencies (handles peer dependency conflicts)
npm install --legacy-peer-deps

# Start development server (requires --openssl-legacy-provider for older Node compatibility)
npm start

# Build for production
npm run build

# Format code with Prettier
npm run format

# Deploy to GitHub Pages
npm run deploy
```

## Architecture

### Authentication Flow
- **Google Identity Services** (modern OAuth 2.0) replaces deprecated gapi.auth
- Authentication state managed in `App.js` with `handleAuthClick()` and `handleTokenResponse()`
- OAuth configuration in `.env` with CLIENT_ID, API_KEY, and proper scopes
- SignIn page (`src/pages/SignIn.js`) handles UI and error display

### State Management
- **React Context API** pattern in `src/context/email/`
- `EmailState.js` - Main provider with Gmail API methods
- `emailReducer.js` - Reducer for email actions
- `emailContext.js` - Context definition
- `types.js` - Action type constants

### Core Gmail API Integration
Located in `src/context/email/EmailState.js`:
- `getMessages()` - Fetch 20 messages for a label (default: INBOX)
- `getMessagesQuery()` - Search emails with Gmail query syntax
- `getOneMessage()` - Fetch individual message details
- `loadMoreMessages()` - Infinite scroll pagination
- All methods use `window.gapi.client.gmail.users.messages` API

### Component Structure
- **App.js** - Root component with authentication logic
- **Main.js** - Layout container (post-authentication)
- **Components/** - Organized by feature:
  - `EmailList/` - Message list with search and infinite scroll
  - `Email/` - Message display and actions (reply, forward, trash)
  - `MailboxList/` - Gmail labels/folders navigation
  - `ErrorBoundary.js` - Error handling wrapper

### Gmail API Patterns
- Messages fetched in two steps: list IDs → get full message data
- Pagination via `nextPageToken` for infinite scroll
- Label-based navigation (INBOX, SENT, TRASH, etc.)
- Search uses Gmail query syntax (`from:user@domain subject:text`)

## Environment Configuration

### Required .env Variables
```
REACT_APP_CLIENT_ID=<Google OAuth Client ID>
REACT_APP_API_KEY=<Google API Key>
REACT_APP_SCOPES=https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify
```

### Google Cloud Console Setup
- Gmail API must be enabled
- OAuth consent screen configured with test users for development
- Authorized redirect URIs: `http://localhost:3000`
- See `GOOGLE_OAUTH_SETUP.md` for detailed configuration steps

## Technology Stack

- **React 18** with createRoot API
- **Chakra UI v1.8** with responsive design patterns
- **React Context** for state management
- **Google Identity Services** for modern OAuth
- **Gmail REST API** for email operations
- **js-base64** for email content encoding
- **React Icons** for UI icons

## Development Notes

### Gmail API Scopes
Use proper scopes in production:
- `gmail.readonly` - Read access only
- `gmail.send` - Send emails
- `gmail.modify` - Full email management

### OAuth Testing
- Development requires adding test users in Google Cloud Console
- Production requires Google app verification for public access
- Error handling displays user-friendly OAuth messages

### Responsive Design
Uses Chakra UI responsive props pattern:
```jsx
<Component 
  prop={{ base: 'mobile-value', lg: 'desktop-value' }}
  direction={{ base: 'column', lg: 'row' }}
/>
```

### Error Handling
- ErrorBoundary wraps entire app
- Authentication errors shown in SignIn component
- Gmail API errors logged to console with user feedback

## Build Considerations

This project uses `--openssl-legacy-provider` flag for Node.js compatibility. For modern development, consider migrating to Next.js or Vite for better build tools and performance.