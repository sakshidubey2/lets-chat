# RealTimeChatApp
This is chat app built in React.js and Node.

## Info
The app uses firebase authentication to authenticate user using google auth and firebase firestore to store application data and provide realtime updation. Other then that material ui with css for styling and icons, emoji picker to use emojis in chats. 
In this chat application user can create a chat room, join a chat room and leave a chat room. There is a functionality for starting the private chat with the selected user. 

## Technologies
* React JS 17.0
* Firebase 9.0

## Setup
In order to run this project locally, we need to perform certain steps.
1. Use `node v16` to run this app.
2. Run `npm install`
3. Run `npm start` 
3. This will run the app in `localhost:3000`

## Steps for Deployment
To deploy this app, here is the series of steps that needs to be performed.
1. Firebase should be installed in the system.
2. Run `npm run build` for making the production build for deployment.
3. Run `firebase deploy --only hosting`. This will deploy the app.


[Visit this link](real-time-chat-app-47c2a.web.app) for opening the demo of this application.


