Fortnite Stats Update Api
======================================================
### install docker app if not installed yet
https://www.docker.com/get-started
------------------------------------------------------

### Build docker container with Mongo DB
```javascript
docker-compose up
```

### Install NPM dependencies
```javascript
npm install
```

### Start App 
```javascript
npm start
```
 or
 ```javascript
  npm run dev
```
 for development process.

### APi routes list
 ```
  POST /user/register - Register user
  POST /user/login - Authorize user
  PUT /user/me - Update user
  DELETE /user/me - Delete user
  GET /login/me - Get logged in user
  GET /stat/me - Get logged in user stats
```
To successfully test the app u'd probably need one user created with correct F-Nite nickname
here's the example payloads for ya :)

```
`/user/register`
---------------------------------------------------------
    "email": "test.user@gmail.com",
    "password": "test",
    "platform": "kbm",
    "epicNickname": "animal",
    "fullName": "John Doe"
---------------------------------------------------------
`/user/login`
---------------------------------------------------------
    "email": "test.user@gmail.com",
    "password": "test"
---------------------------------------------------------
Authorization token (with Bearer) will be returned. Set it up as Authorization
header and try calling `/stat/me`.
Stats should be returned than.
Users that were not found or theirs account are private would be handled appropriately.
```

And you're good to go.
 
 ------------------------------------------------------
 This app runs Node-Schedule npm package to call scheduled jobs.
 Default jobs scheduled is set to each minute to update users.
 Configurable at `./config/jobs.config.js`
 
 Detailed documentation can be found at

 https://www.npmjs.com/package/node-schedule
 -----------------------------------------------------
 Other dependecies:
 ```
     `bcrypt`: "^5.0.0",
     `body-parser`: "^1.19.0",
     `cookie-parser`: "~1.4.4",
     `cors`: "^2.8.5",
     `debug`: "~2.6.9",
     `express`: "~4.16.1",
     `express-async-handler`: "^1.1.4",
     `joi`: "^17.3.0",
     `jsonwebtoken`: "^8.5.1",
     `mongoose`: "^5.10.12",
     `morgan`: "^1.9.1",
     `node-schedule`: "^1.3.2",
     `passport`: "^0.4.1",
     `passport-jwt`: "^4.0.0",
     `passport-local`: "^1.0.0",
     `request`: "^2.88.2"
```
     
------------------------------------------------
developed by Alex Dimov     