
# Attendance Project for Sahyadri College of Engineering and Management

This project is a web-based attendance and placement workflow management system built specifically for **Sahyadri College of Engineering and Management**. It simplifies campus placement drives, offering a seamless experience for both students and administrators.

## Features

- **Campus Drive Management**: Students can browse available drives and apply.
- **QR-Based Attendance**: Students receive a QR code upon applying for a drive. This code is scanned during the drive to mark attendance.
- **Role-Based Access Control (RBAC)**: Secures both frontend and backend with different access levels for users.
- **Email Notifications**: Students receive acknowledgment emails with the QR code for attendance.
- **Responsive Design**: Optimized for use across various devices.

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js with Express
- **Database**: MySQL

## Setup and Installation

### Clone the Repository

```bash
git clone https://github.com/ape-with-helmet/attendance-project.git
cd attendance-project
```

### Backend Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure the MySQL database (provide details for database setup).
3. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the `app` directory:
   ```bash
   cd app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm start
   ```

### Access the Application

Visit the application in your browser at `http://localhost:3000` (or your deployment URL).

## Usage

- **Students**: Browse available campus drives, apply, and receive a QR code for attendance.
- **Admins**: Manage drive listings, track applications, and scan QR codes to mark attendance.

## Deployment

The project is hosted online. Ensure that the hosting platform supports React for the frontend and Node.js with Express for the backend.

## Contributing

Feel free to fork this project and submit a pull request with your changes.

## License

This project is licensed under [LICENSE NAME]. See the [LICENSE](LICENSE) file for details.
