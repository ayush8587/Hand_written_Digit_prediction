# pylint: disable=import-error

from flask import Flask, render_template, request, jsonify
import tensorflow as tf
import numpy as np

app = Flask(__name__)

# Load the trained TensorFlow model
model = tf.keras.models.load_model("models/digit_recognition_model.h5")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predict_digit", methods=["POST"])
def predict_digit():
    try:
        # Receive the user's drawn digit as an image (you may need to preprocess it)
        digit_data = request.get_json()
        digit_image = preprocess_digit(digit_data)

        # Make a prediction using the loaded model
        prediction = model.predict(digit_image)
        predicted_digit = np.argmax(prediction)

        # Return the predicted digit
        return jsonify({"predicted_digit": int(predicted_digit)})

    except Exception as e:
        return jsonify({"error": str(e)})

def preprocess_digit(data):
    # Implement data preprocessing for the drawn digit as needed
    # This could include resizing, normalizing, and formatting the data
    # Example: Convert data to a NumPy array
    digit_image = np.array(data)

    return digit_image

if __name__ == "__main__":
    app.run(debug=True)
