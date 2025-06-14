import threading
import numpy as np
import sys
import os
import io
import socket

from flask import Flask, request, jsonify
from flask_cors import CORS
import keras as ks
from flwr.client import start_client, NumPyClient
from utils import load_partition, read_img, get_labels
from werkzeug.utils import secure_filename
from flask import request
from PIL import Image


# -------------------------------------------------------------
# Utility function to retrieve local IP address dynamically
# -------------------------------------------------------------
def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))  # Google's public DNS server
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'  # fallback to localhost if network fails
    finally:
        s.close()
    return ip


# -------------------------------------------------------------
# Set server configuration: IP address and port number
# Could be replaced with command line args or environment vars
# -------------------------------------------------------------
server_address = get_local_ip()
port_number = "8080"

# Unique identifier for this federated learning client instance
client_id = 0


# -------------------------------------------------------------
# Initialize Flask app with CORS enabled for cross-origin access
# -------------------------------------------------------------
app = Flask(__name__)
CORS(app)

# Global storage for received image URLs (blob URLs)
image_paths = []

# Model input image size configuration
IMG_SIZE = 160

# -------------------------------------------------------------
# Define the keras sequential model architecture
# Note: Input expects RGB images of size IMG_SIZE x IMG_SIZE
# -------------------------------------------------------------
model = ks.Sequential([
    ks.layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3)),
    ks.layers.Flatten(),
    ks.layers.Dense(128, activation='relu'),
    ks.layers.Dense(4, activation='softmax'),  # Classification layer
    ks.layers.Dense(4)  # Additional output layer (if needed)
])

# Compile model with Adam optimizer and sparse categorical loss
model.compile(
    optimizer='adam',
    loss=ks.losses.SparseCategoricalCrossentropy(from_logits=True),
    metrics=['accuracy']
)

# -------------------------------------------------------------
# Load training and validation datasets for this client
# Partitioning handled by external utility function 'load_partition'
# -------------------------------------------------------------
X_train, X_val, y_train, y_val = load_partition(client_id)

# Load label names (string classes) for classification output
labels = get_labels()


# -------------------------------------------------------------
# Image preprocessing and prediction helper function
# Input: Raw image bytes
# Output: Predicted label and confidence probability
# -------------------------------------------------------------
def predict_image(image_bytes):
    # Load image from bytes buffer and convert to RGB
    image = Image.open(io.BytesIO(image_bytes))
    image = image.convert('RGB')
    # Resize image to model expected input size
    image = image.resize((IMG_SIZE, IMG_SIZE))
    # Normalize pixel values to range [0,1]
    image = np.array(image) / 255.0
    # Expand dims to create batch dimension
    image = np.expand_dims(image, axis=0)
    
    # Run model prediction to get raw logits
    predictions = model.predict(image)
    
    # Convert logits to probabilities using softmax activation
    probabilities = ks.activations.softmax(predictions).numpy()
    
    # Get index of highest probability class
    predicted_label_index = np.argmax(probabilities)
    probability = probabilities[0, predicted_label_index]
    predicted_label = labels[predicted_label_index]
    
    return predicted_label, probability


# -------------------------------------------------------------
# Flask route to predict label from image bytes sent as form-data
# Endpoint: /predict-bytes
# -------------------------------------------------------------
@app.route('/predict-bytes', methods=['POST'])
def predictBytes():
    # Check if file part exists in the request
    if 'file' not in request.files:
        return "No file part", 400
    
    file = request.files['file']
    
    # Check if a filename was provided
    if file.filename == '':
        return "No selected file", 400
    
    if file:
        image_bytes = file.read()
        predicted_label, probability = predict_image(image_bytes)
        
        # Return prediction and probability as JSON
        return jsonify({
            "label": predicted_label,
            "probability": float(probability)
        })


# -------------------------------------------------------------
# Flask route to upload file and save it on the server
# Endpoint: /upload
# -------------------------------------------------------------
@app.route("/upload", methods=["POST"])
def upload_file():
    # Check file presence in request
    if "file" not in request.files:
        return "No file part", 400
    
    file = request.files["file"]
    
    if file.filename == "":
        return "No selected file", 400
    
    # Save file to disk (modify path as needed)
    file.save("/path/to/save/file")
    
    # Return success message
    return "File uploaded successfully", 200


# -------------------------------------------------------------
# Helper to preprocess an image file from disk before prediction
# -------------------------------------------------------------
def prepare_image(image_path):
    img = read_img(image_path)
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img


# -------------------------------------------------------------
# Flask route to accept uploaded file, save temporarily,
# predict label using the model, and return results
# Endpoint: /predict
# -------------------------------------------------------------
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return "No file part", 400
    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400
    
    if file:
        image_path = "./temp_image.jpg"
        # Save uploaded image temporarily
        file.save(image_path)
        
        # Preprocess and predict using the model
        processed_image = prepare_image(image_path)
        predictions = model.predict(processed_image)
        
        predicted_label_index = np.argmax(predictions)
        probability = np.max(predictions)
        predicted_label = labels[predicted_label_index]
        
        # Log prediction results on server terminal
        print(f"Predicted Label: {predicted_label}, Probability: {probability}")
        
        # Cleanup temporary image file
        os.remove(image_path)
        
        return jsonify({
            "label": predicted_label,
            "probability": float(probability)
        })


# -------------------------------------------------------------
# Route to receive image Blob URLs from clients and store them
# -------------------------------------------------------------
@app.route("/receive-blob-url", methods=["POST"])
def receive_blob_url():
    data = request.json
    blob_url = data.get("blobUrl")
    
    if blob_url:
        image_paths.append(blob_url)
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False, "error": "Blob URL not provided"}), 400


# -------------------------------------------------------------
# Route to retrieve all stored image paths for review/debugging
# -------------------------------------------------------------
@app.route("/get-image-paths")
def get_image_paths():
    print("Stored Image Paths:")
    for path in image_paths:
        print(path)
    return jsonify({"imagePaths": image_paths}), 200


# -------------------------------------------------------------
# Endpoint to return this client's ID number
# -------------------------------------------------------------
@app.route('/get-client-id', methods=['GET'])
def get_client_id():
    client_id_int = int(client_id)
    return jsonify({"client_id": client_id_int}), 200


# -------------------------------------------------------------
# Endpoint to manually start federated learning process from client
# -------------------------------------------------------------
@app.route("/start-fl", methods=['GET'])
def start_flower():
    # Start federated learning client process in separate thread if desired
    run_flower()
    
    return jsonify({"message": "Federated Learning process started successfully"}), 200


###############################
# Federated Client class implementing Flower's NumPyClient interface
###############################
class FederatedClient(NumPyClient):
    def get_parameters(self, config):
        # Return current model weights
        return model.get_weights()

    def fit(self, parameters, config):
        # Set model weights from server parameters
        model.set_weights(parameters)
        
        # Train model locally on client's dataset
        history = model.fit(
            X_train,
            y_train,
            epochs=100,
            batch_size=32,
            steps_per_epoch=5,
            validation_split=0.1
        )
        
        # Collect training metrics to send back
        results = {
            "loss": history.history["loss"][0],
            "accuracy": history.history["accuracy"][0],
            "val_loss": history.history["val_loss"][0],
            "val_accuracy": history.history["val_accuracy"][0],
        }
        
        return model.get_weights(), len(X_train), results

    def evaluate(self, parameters, config):
        # Set weights to current parameters from server
        model.set_weights(parameters)
        
        # Evaluate model on validation set
        loss, accuracy = model.evaluate(X_val, y_val)
        
        print("****** CLIENT ACCURACY: ", accuracy, " ******")
        
        # Additional detailed evaluation per class label
        y_pred = np.argmax(model.predict(X_val), axis=1)
        correct_guesses = [np.sum((y_pred == i) & (y_val == i)) for i in range(4)]
        
        print("Correct Guesses for Each Label:", correct_guesses)
        
        return loss, len(X_val), {"accuracy": accuracy}


# -------------------------------------------------------------
# Function to initialize and start the Flower federated client
# -------------------------------------------------------------
def run_flower():
    client = FederatedClient().to_client()
    start_client(server_address=f"{server_address}:{port_number}", client=client)


# -------------------------------------------------------------
# Main entry point: start Flask app on port offset by client ID
# -------------------------------------------------------------
def main():
    port = 5001 + client_id
    # run_flower()  # Uncomment if you want to start FL client immediately on start
    app.run(host="0.0.0.0", port=port, debug=True)


if __name__ == '__main__':
    main()
