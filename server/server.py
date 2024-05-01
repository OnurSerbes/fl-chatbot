from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global list variable to store image paths
image_paths = []

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

if __name__ == "__main__":
    app.run(debug=True)
