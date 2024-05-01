Here's the reorganized README file for your FL-ChatBot project:

## FL-ChatBot

FL-ChatBot is a chat application built with React and Flask that allows users to send text messages and images. The application utilizes a federated learning approach for image classification, enabling the chatbot to learn and improve based on user interactions.

### Project Overview

* **Built with:** React (client-side), Flask (server-side)
* **Features:** 
    * Send text messages
    * Send images
    * Image classification with federated learning
    * Real-time chat history and bot responses

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   ```

2. **Navigate to the project directory:**

   ```bash
   cd FL-ChatBot
   ```

3. **Start the server:**

   ```bash
   cd server
   python server.py
   ```

4. **Open a new terminal window/tab.**

5. **Start the React development server:**

   ```bash
   cd client
   npm install
   npm start
   ```

6. **Access the application:**

   Open http://localhost:3000 in your web browser.

### Usage

* Interact with the chat interface to send text messages and images.
* View the chat history and bot responses in real-time.

**Note:** To run both the client and server simultaneously, execute `npm start` from the client directory.

### URLs

* **Client URL:** http://localhost:3000
* **Server URL:** http://localhost:5000/get-image-paths  (This URL might be used for internal functionalities and might not be relevant to users)


