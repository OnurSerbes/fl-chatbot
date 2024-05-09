import threading
import numpy as np
import sys
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import keras as ks
from flwr.client import start_numpy_client, NumPyClient
from utils import load_partition, read_img, get_labels
from werkzeug.utils import secure_filename

# Load server address and port number from command-line arguments or use default
server_address = "10.0.25.106"
port_number = "8080"


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global list variable to store image paths
image_paths = []

IMG_SIZE = 160
model = ks.Sequential([
    ks.layers.Input(shape=(IMG_SIZE, IMG_SIZE)),
    ks.layers.Flatten(),
    ks.layers.Dense(128, activation='relu'),
    ks.layers.Dense(4)
])
model.compile(optimizer='adam', loss=ks.losses.SparseCategoricalCrossentropy(from_logits=True), metrics=['accuracy'])

X_train, X_val, y_train, y_val = load_partition(int(sys.argv[1]))

# Define the labels
labels = get_labels()




##################################
# Encapsulated metods START here #
##################################


def prepare_image(image_path):
    """Converts the uploaded image to the format expected by the model."""
    img = read_img(image_path)
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return "No file part", 400
    file = request.files['file']
    if file.filename == '':
        return "No selected file", 400
    if file:
        # Save temporarily
        image_path = "./temp_image.jpg"
        file.save(image_path)

        # Process the image and predict
        processed_image = prepare_image(image_path)
        predictions = model.predict(processed_image)
        predicted_label_index = np.argmax(predictions)
        probability = np.max(predictions)
        predicted_label = labels[predicted_label_index]

        # Print on the server terminal
        print(f"Predicted Label: {predicted_label}, Probability: {probability}")

        # Clean up the saved file (optional)
        os.remove(image_path)

        return jsonify({
            "label": predicted_label,
            "probability": float(probability)
        })




# Route to receive Blob URL from client
@app.route("/receive-blob-url", methods=["POST"])
def receive_blob_url():
    data = request.json
    blob_url = data.get("blobUrl")
    if blob_url:
        image_paths.append(blob_url)
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False, "error": "Blob URL not provided"}), 400



# Route to retrieve and log stored image paths
@app.route("/get-image-paths")
def get_image_paths():
    print("Stored Image Paths:")
    for path in image_paths:
        print(path)
    return jsonify({"imagePaths": image_paths}), 200

# Metod to retrun client id
@app.route('/get-client-id', methods=['GET'])
def get_client_id():
    client_id = int(sys.argv[1])
    return jsonify({"client_id": client_id}), 200


# Flask route to start federated learning
@app.route("/start-fl", methods=['GET'])
def start_flower():
    # Start Federated Learning process
    run_flower()
    
    # Return success message
    return jsonify({"message": "Federated Learning process started successfully"}), 200




###############################
# Federated Client START Here #
###############################

class FederatedClient(NumPyClient):
    def get_parameters(self, config):
        return model.get_weights()

    def fit(self, parameters, config):
        model.set_weights(parameters)
        history = model.fit(X_train, y_train, epochs=100, batch_size=32, steps_per_epoch=5, validation_split=0.1)

        results = {
            "loss": history.history["loss"][0],
            "accuracy": history.history["accuracy"][0],
            "val_loss": history.history["val_loss"][0],
            "val_accuracy": history.history["val_accuracy"][0],
        }

        return model.get_weights(), len(X_train), results

    def evaluate(self, parameters, config):
        model.set_weights(parameters)
        loss, accuracy = model.evaluate(X_val, y_val)
        print("****** CLIENT ACCURACY: ", accuracy, " ******")
        # Predict labels for validation data
        y_pred = np.argmax(model.predict(X_val), axis=1)

        # Calculate the number of correct guesses for each label
        correct_guesses = [np.sum((y_pred == i) & (y_val == i)) for i in range(4)]

        print("Correct Guesses for Each Label:", correct_guesses)

        return loss, len(X_val), {"accuracy": accuracy}

# Start Federated Learning progress
def run_flower():
    # Configure the client to connect to the server
    start_numpy_client(server_address=f"{server_address}:{port_number}", client=FederatedClient())



############################


# Main Metod
def main():
    client_id = int(sys.argv[1])
    port = 5001 + client_id
    run_flower()
    app.run(host="0.0.0.0", port=port, debug=True)


if __name__ == '__main__':
    main()
