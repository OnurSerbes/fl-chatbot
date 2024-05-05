
import threading
import numpy as np
import sys
from flask import Flask, request, jsonify
import keras as ks
from flwr.client import start_numpy_client, NumPyClient
from utils import load_partition, read_img, get_labels

# Load server address and port number from command-line arguments or use default
server_address = "192.168.1.111"
port_number = "8080"

app = Flask(__name__)

IMG_SIZE = 160
model = ks.Sequential([
    ks.layers.Input(shape=(IMG_SIZE, IMG_SIZE)),
    ks.layers.Flatten(),
    ks.layers.Dense(128, activation='relu'),
    ks.layers.Dense(4)
])
model.compile(optimizer='adam', loss=ks.losses.SparseCategoricalCrossentropy(from_logits=True), metrics=['accuracy'])

X_train, X_val, y_train, y_val = load_partition(int(sys.argv[1]))

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files['file']
    image_path = "./temp_image.jpg"
    file.save(image_path)  # Save temporarily
    predicted_label, probability = predict_image(image_path, model)
    return jsonify({"label": predicted_label, "probability": float(probability)})

def predict_image(image_path, model):
    img = read_img(image_path)
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    predictions = model.predict(img)
    predicted_label_index = np.argmax(predictions)
    labels = get_labels()
    return labels[predicted_label_index], np.max(predictions)


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


def run_flower():
    # Configure the client to connect to the server
    start_numpy_client(server_address=f"{server_address}:{port_number}", client=FederatedClient())


if __name__ == '__main__':
    client_id = int(sys.argv[1])
    image_path = 'data/Testing/glioma_tumor/image(1).jpg'
    label, probability = predict_image(image_path, model)
    print(f"Initial Prediction - Label: {label}, Probability: {probability}")

    port = 5001 + client_id
    threading.Thread(target=run_flower).start()
    #app.run(host="0.0.0.0", port=port, debug=True)




"""
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
def predict_image(image_path, model):
    img = read_img(image_path)  # Use the read_img function from utils.py
    img = np.array(img) / 255.0  # Normalize the image
    img = np.expand_dims(img, axis=0)  # Adjust shape for the model

    # Predict using the model
    predictions = model.predict(img)
    predicted_label_index = np.argmax(predictions)
    labels = get_labels()  # This should match the labels used during training
    predicted_label = labels[predicted_label_index]
    probability = np.max(predictions)

    print(f"Predicted Label: {predicted_label}")
    print(f"Probability: {probability:.2f}")

"""