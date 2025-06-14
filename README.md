## Authors:
Onur Serbes, Efecan Okkalıoğlu, Oğuzhan Apaydın, Ferhan Zeynep Aydın, Ebrar Mutlu, Lütfullah Burak Kaya

## FL-ChatBot

FL-ChatBot is a chat application built with React and Flask that allows users to send text messages and images. The application utilizes a federated learning approach for image classification, enabling the chatbot to learn and improve based on user interactions.

### Project Overview

- **Built with:** React (client-side), Flask (server-side)
- **Features:**
  - Send text messages
  - Send images
  - Image classification with federated learning
  - Real-time chat history and bot responses

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   ```

2. **Navigate to the project directory:**

   ```bash
   cd FL-ChatBot
   ```

3. **Set up the Flask server:**

   a. Navigate to the server directory:

   ```bash
   cd server
   ```

   b. Create and activate a virtual environment (optional but recommended):

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

   c. Install the required Python packages:

   ```bash
   pip install opencv-python
   pip install flask
   pip install flask-cors
   pip install tensorflow
   pip install keras
   pip install scikit-learn
   pip install flwr
   pip install numpy
   pip install pydicom
   pip install pillow
   ```

4. **Set up the React client:**

   a. Navigate to the client directory:

   ```bash
   cd ../client
   ```

   b. Install the required npm packages:

   ```bash
   npm install
   npm install concurrently
   npm install cross-env
   ```

### Running the Application

To run both the Flask client and the React client simultaneously, use the following command in the client directory:

```bash
npm start
```

To run the federated learning server, use the following command in the server directory:

```bash
python server.py
```

server.py will perform federated learning after minimum 4 client registiration after first upload.

### Usage

- Interact with the chat interface to send text messages and images.
- View the chat history and bot responses in real-time.

### URLs

- **Client URL:** http://localhost:3000
- **Server URL:** http://localhost:5000

**Note:** The server URL might be used for internal functionalities and might not be relevant to users.
