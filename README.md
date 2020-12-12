# CubeMail [![Build Status](https://img.shields.io/github/license/KhalidLam/Gmail-App-React)](https://github.com/KhalidLam/Gmail-App-React/blob/master/LICENSE)

![alt text](https://github.com/KhalidLam/CubeMail/blob/master/screenshot.jpg?raw=true)

CubeMail is a webmail-client built using [Create-React-App](https://github.com/facebook/create-react-app) and [Chakra UI](https://github.com/chakra-ui/chakra-ui/), It runs completely in the browser and uses the [Gmail's public Javascript API](https://developers.google.com/gmail/api/).

## [Check it live here](https://khalidlam.github.io/CubeMail/)

## How does it work?

The account sign-in and authentication process is **totally managed by Gmail's secure protocols**. The workflow is as follows:

- First-time users will see a landing page with a button to sign in to Gmail.
- Once successfully signed-in, Gmail will display a screen asking the user for permission to use the account in the application.
- After permission is granted, the application will load all account data and display the Inbox folder

**IMPORTANT:** The application does **NOT** store or persist any account or user data in any way at all. It simply fetches data from Gmail's API and displays it in the browser.

## Requirements

- All Gmail API requests require an **_API Key_** and an **_OAuth 2.0 Client ID_**. You can follow [these instructions](https://developers.google.com/fit/android/get-api-key) to obtain those credentials. Then, store those two values in the **_[.env](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables)_** file located in the root folder by replacing `<YOUR_API_KEY>` and `<YOUR_CLIENT_ID>` respectively.

## Getting started

1. Clone this repo

```sh
$ git clone https://github.com/KhalidLam/CubeMail.git
$ cd  CubeMail
$ npm install
```

2. Create a `.env` from `.env.example` and add your Google API credentials - [Google Api](https://console.developers.google.com)

```
$ cp .env.example .env
```

3. Run: `$ npm start`
4. Open http://localhost:3000 in your browser.

## Technologies used

- [React](https://github.com/facebook/react) - build interfaces & data flow
- [Chakra UI](https://github.com/chakra-ui/chakra-ui/) - components & styling
- [React Icons](https://github.com/react-icons/react-icons) - Icons
- [js-base64](https://github.com/dankogai/js-base64) - Base64 transcoder
- [Gmail's public Javascript API](https://github.com/google/google-api-javascript-client) - access to Google APIs
- [Gmail REST API](https://developers.google.com/gmail/api) - Documentation

## Features

- Read, Send, Reply, Forward, Trash And archive messages

## Todo

- [ ] Make app responsive
- [x] Add search feature
- [ ] Display user's Labels
- [ ] Add animation on Buttons
- [x] Add infinite scrolling
- [ ] Error handling on login or connexion issues
- [ ] Switch to Redux instead of Context API

### License:

[MIT License](https://opensource.org/licenses/MIT)
