// Function to send Blob URL to the server
export const sendBlobUrlToServer = async (blobUrl) => {
  try {
    const response = await fetch("http://localhost:5000/receive-blob-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blobUrl }),
    });
    if (response.ok) {
      console.log("Blob URL sent successfully.");
    } else {
      console.error("Error sending Blob URL to server:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending Blob URL to server:", error.message);
  }
};

// Function to get stored image paths from the server
// !!Not getting used for now!!
export const getImagePathsFromServer = async () => {
  try {
    const response = await fetch("http://localhost:5000/get-image-paths");
    if (response.ok) {
      const data = await response.json();
      console.log("Stored Image Paths:", data.imagePaths);
      return data.imagePaths;
    } else {
      console.error("Error fetching stored image paths:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching stored image paths:", error.message);
    return [];
  }
};
