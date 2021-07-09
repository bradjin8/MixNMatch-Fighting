# Instadating
React Native

## Enable Push Notification

To enable push notification, you need to deploy the firebase functions.

## Steps to deploying the firebase functions

* At the root of InstadatingApp, change directory to firebaseFunctions:

```bash
$ cd firebaseFunctions
```

* First, we need to make sure that the Firebase Command Line Client is installed. Execute the following command to install the firebase-tools package:

```bash
$ npm install -g firebase-tools
```

* login to Firebase by using the following command:

```bash
$ firebase login
```

* The browser should open up and load a URL that was displayed in the console. At the same time the login is recognized by the Firebase CLI in the console.

* next, execute the command bellow to choose your firebase project:

```bash
$ firebase use --add
```

* when prompted for alias name, you can  enter: default

* deploy the Firebase function by using the following command:

```bash
$ firebase deploy
```


After this, you should have firebaseFunctions deployed on your firebase console and Push Notification working.
