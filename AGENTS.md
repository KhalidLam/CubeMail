# AGENTS.md

## Cursor Cloud specific instructions

### Service overview

CubeMail is a single-service React SPA (Create React App). There is no backend, database, or Docker infrastructure. All data comes from the Gmail REST API via Google OAuth in the browser.

### Running the dev server

```bash
NODE_OPTIONS=--openssl-legacy-provider npm start
```

The `--openssl-legacy-provider` flag is required because `react-scripts 5` uses a webpack version that relies on a legacy OpenSSL hashing algorithm incompatible with Node.js 17+. Without it, the dev server and build will fail with an `ERR_OSSL_EVP_UNSUPPORTED` error.

The dev server runs at `http://localhost:3000`.

### Building

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

### Linting / Formatting

There is no ESLint config. Code formatting uses Prettier:

```bash
npx prettier --check 'src/**/*.{js,jsx,ts,tsx,json,css,md}'
```

### Tests

No automated tests exist in the codebase. The test runner (Jest via react-scripts) is configured and works:

```bash
CI=true npm test -- --passWithNoTests
```

### OAuth credentials

The app requires Google OAuth credentials in `.env` (see `.env.example`). Without valid `REACT_APP_CLIENT_ID` and `REACT_APP_API_KEY`, the app loads the sign-in page but the "Sign in with Google" button will redirect to a Google error page (`401: invalid_client`). This is expected and does not indicate a code issue.

### Dependencies

Always install with `--legacy-peer-deps` due to peer dependency conflicts between React 18 and some packages.
