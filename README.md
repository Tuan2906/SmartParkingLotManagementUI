
---

# Post Review Website

## Overview

This project involves building a post review website where posts are reviewed and managed. The system includes both backend and frontend components to handle post moderation, user notifications, and authentication. It leverages AI for detecting sensitive content and provides a user-friendly interface for both administrators and end-users.

## Features

### Backend
The backend provides functionalities such as:
- **Check Sensitive Words:** Uses AI to detect and flag sensitive words or content in posts.
- **Update Post Status:** API endpoints for updating the status of posts (e.g., pending, approved, rejected).
- **Send Notification Emails:** Sends notification emails to users when their posts are reviewed or require action.
- **Authentication & Authorization:** Manages login functionality with different roles and permissions for employees.

**Technology Used:**
- **Framework:** Django Rest Framework
- **AI Integration:** scikit-learn, joblib, pandas

### Frontend
The frontend provides:
- **Post Review Interface:** Allows users to automatically check posts with AI, approve or reject posts, and view detailed information about posts.
- **Login Interface:** Enables users to log in to the system securely.

**Technology Used:**
- **Framework:** ReactJS

## Installation

### Backend

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Tuan2906/XetDuyetBaiDang.git
   ```
2. **Navigate to the Backend Directory:**
   ```bash
   cd shareJourneyProject
   ```
3. **Create and Activate a Virtual Environment:**
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   ```
4. **Install the Required Packages:**
   ```bash
   pip install -r requirements.txt
   ```
5. **Apply Migrations and Start the Server:**
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Tuan2906/XetDuyetBaiDang.git
   ```
2. **Navigate to the Frontend Directory:**
   ```bash
   cd XetDuyetPost
   ```
3. **Install the Required Packages:**
   ```bash
   npm install
   ```
4. **Start the Development Server:**
   ```bash
   npm start
   ```

## Usage

- **Backend API:** 
  - **Endpoints:** The backend provides RESTful APIs for post management, sensitive word checking, and user notifications.
  - **Testing:** Use tools like Postman or cURL to interact with the API endpoints and test functionalities.

- **Frontend:** 
  - **Interface:** The frontend provides a user-friendly interface for reviewing posts and managing login sessions.
  - **Access:** Once the development server is running, navigate to `http://localhost:3000` (or the configured port) to use the application.

## AI Integration Details

- **scikit-learn:** A machine learning library used for building and training models to detect sensitive words in posts. It provides tools for classification, regression, clustering, and more.

- **joblib:** A library used to serialize and deserialize Python objects, such as machine learning models. It ensures that trained models can be saved and loaded efficiently.

- **pandas:** A data manipulation and analysis library used for handling data in tabular form. It is utilized to preprocess data, manage datasets, and perform various data transformations required for model training and evaluation.

## Contributing

Contributions are welcome! To contribute to the project:
1. **Fork the Repository:** Create your own fork of the repository on GitHub.
2. **Make Changes:** Implement your changes or new features in a separate branch.
3. **Submit a Pull Request:** Open a pull request with a detailed description of the changes.

## License

This project is licensed under the [MIT License](LICENSE). See the LICENSE file for details.

## Contact

For questions, feedback, or support, please reach out via email: tuanchaunguyen13@gmail.com.

---
