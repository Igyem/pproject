from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np

app = Flask(__name__)

# Load your trained model
model = load_model('tomato_disease_model.h5')

# Define the class labels
class_labels = ['Healthy', 'Early Blight', 'Late Blight']  # Replace with your actual classes

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']

    # Preprocess the image
    img = load_img(file, target_size=(224, 224))
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Make prediction
    prediction = model.predict(img_array)
    predicted_class = class_labels[np.argmax(prediction)]
    confidence = float(np.max(prediction) * 100)

    return jsonify({'class': predicted_class, 'confidence': confidence})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
