## OTP Project

### Project Overview

This project aims to demonstrate the implementation of user authentication and OTP verification in a Node.js application using Express.js and MongoDB.
### Features

- User authentication using OTP
- User signup
- User login
- Sending OTP for verification

### Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)

### Installation

- Clone the repository:

    ```bash
    git clone https://github.com/yourusername/otp_project.git
    ```

### Install dependencies:
- go into the project folder. 
    ```bash
    cd otp_project
    npm install
    ```

### Configuration

- Rename the example.env file to .env and provide the necessary environment variables:
  ```
  PORT=3000
  MONGODB_URI=mongodb://localhost:27017/otp_project
  JWT_SECRET=your_jwt_secret
  ```

### Usage

- Start the server

  ```bash
  npm run dev
  ```

- Use a tool like Postman to send requests to the API endpoints.

  - Sendotp
    ```
    http://localhost:4000/api/v1/sendotp
    ```
    in body send
    ```json
    {
    "number": "1231231232"
    }
    ```
  - Signup
    ```
    http://localhost:4000/api/v1/signup
    ```
    in body send the otp from the header 
    ```json
    {
    "number": "1231231232",
    "otp": "181845"
    }
    ```
  - login 
    ```
    http://localhost:4000/api/v1/login
    ```
    in body send the updated otp generated 
    ```json
    {
    "number": "1231231232",
    "otp": "181845"
    }
    ```

### License

This project is licensed under the MIT License.
