# FL-ChatBot

FL-ChatBot is a simple chat application built with React on the client side and Flask on the server side. It allows users to send text messages and images, with image classification performed.

This project implements a federated learning approach for machine learning, enabling the chatbot to continuously improve its image classification capabilities based on user interactions.

### Installation

1. Clone the repository to your local machine:

   git clone <repository_url>

2. Navigate to the project directory:

   cd FL-ChatBot

3. Start the Flask server:

   cd server
   python server.py

4. Open a new terminal window/tab.

5. Start the React development server:

   cd client
   npm install
   npm start

6. Access the application at [http://localhost:3000](http://localhost:3000) in your web browser.

### Usage

- Send text messages and images through the chat interface.
- View the chat history and bot responses in real-time.

The Flask server is integrated with the React client. To run both deployments simultaneously, execute the following command in the client-side directory:

npm start

## URLs

- Client URL: [http://localhost:3000/]
- Server URL: [http://localhost:5000/get-image-paths]

---
