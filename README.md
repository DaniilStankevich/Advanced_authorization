## The project is a full-stack authentication implementation using JWT in conjunction with a Mongo DB database.

**On the server, the following functionality is implemented:**

- Registration and authentication
- Logout
- Routing, endpoints
- Generation of access and refresh tokens
- Validation of login and password
- Account confirmation via email
- Connection to the Mongo DB database
- Middleware for error handling and token verification

**On the client:**

- Interceptors for adding tokens to requests and updating tokens
- Global MobX store
- Storing the token in local storage
- Login form
