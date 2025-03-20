<h1 align="center">Automated Evaluation of Student Summaries: A Learning Aid</h1>

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [Contributing](#contributing)
6. [License](#license)

## Project Overview

This frontend is part of a larger system aimed at automating the evaluation of student summaries. Built with React and styled with Tailwind CSS, it provides a responsive and user-friendly interface for students, educators, and administrators. Key functionalities include a dashboard, chatbot assistance, quiz integration, and informational pages.

The project was initialized with `create-react-app` and has been customized to support ADHD-friendly design principles, ensuring accessibility and ease of use.

## Tech Stack

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![React](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Git](https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white)

## Installation

Follow these steps to set up the project locally:

### Prerequisites

- **Node.js**: Version 14.x or higher (includes npm).
- **Git**: For cloning the repository.

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/automated-evaluation-frontend.git
   cd automated-evaluation-frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

   This installs React, Tailwind CSS, and other dependencies listed in `package.json`.

3. **Run the Development Server**

   ```bash
   npm start
   ```

   The app will launch at `http://localhost:3000` in your browser.

4. **Build for Production** (optional)

   ```bash
   npm run build
   ```

   Creates an optimized build in the `build/` folder.

5. **Download Model Weights**
   Download the model weights from [this link](https://drive.google.com/drive/folders/1xQ5y4x8gG6-eVcKEB-eWlVHbn531mluy?usp=share_link) and place the folder in the `backend` directory.

6. **Install Backend Dependencies**
   Navigate to the `backend` directory and install the required dependencies:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

7. **Run the Backend Server**
   Start the backend server by running:

   ```bash
   unicorn main:app --reload
   ```

   The backend will run on `http://localhost:8000`.

8. **Access the Application**
   Open your web browser and go to `http://localhost:3000` to access the frontend. The frontend will communicate with the backend running on `http://localhost:8000`.

## Environment Variables

The project uses environment variables to configure the app. Create a `.env` file in the backend directory and add the following variables:

```env
GOOGLE_API_KEY=your-google-api-key
PINECONE_API_KEY=your-pinecone-api-key
```

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to your fork (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please ensure your code follows ESLint rules (if configured) and includes relevant documentation.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
