# Working with the Gmail JavaScript API

[![Build Status](https://img.shields.io/github/license/KhalidLam/Gmail-App-React)](https://github.com/KhalidLam/Gmail-App-React/blob/master/LICENSE)

A simple Gmail client made with [Create-React-App](https://github.com/facebook/create-react-app) and [Chakra UI](https://github.com/chakra-ui/chakra-ui/) using [Gmail's public Javascript API](https://developers.google.com/gmail/api/).

**How does it work?**
The account sign-in and authentication process is **totally managed by Gmail's secure protocols**. The workflow is as follows:

- First-time users will see a landing page with a button to sign in to
  Gmail.
- Once successfully signed-in, Gmail will display a screen asking the
  user for permission to use the account in the application.
- After permission is granted, the application will load all account data and display the Inbox folder

**IMPORTANT:** The application does **NOT** store or persist any account or user data in any way at all. It simply fetches data from Gmail's API and displays it in the browser.

### Requirements:

- All Gmail API requests require an **_API Key_** and an **_OAuth 2.0 Client ID_**. You can follow [these instructions](https://developers.google.com/fit/android/get-api-key) to obtain those credentials. Then, store those two values in the **_[.env](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables)_** file located in the root folder by replacing `<YOUR_API_KEY>` and `<YOUR_CLIENT_ID>` respectively.

### Features:

- Read, Send, Reply, Forward, Trash And archive messages

### Todo:

- Make App responsive

### License:

[MIT License](https://opensource.org/licenses/MIT)
