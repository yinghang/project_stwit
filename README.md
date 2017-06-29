## Project Stwits

**Setup instructions**

- `Source process.env` to get the credentials into the system before running nodemon
- Ask for process.env & mongo details
- ngrok is required for oauth to work



**Important files**

- Root directory
  - app.js - Node/Express main driver
  - routes
    - users.js - Routes for authentication & sentiment search
  - public
    - app
      - app.js - Angular main file
      - app.routes.js - Routes for Angular
      - controllers
        - mainCtrl.js - Controls login/logout/get sentiment
      - views
        - index.html & home.html - HTML views
      - services
        - authService.js - handles tokens