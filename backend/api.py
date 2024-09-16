import logging
import traceback
import os
from dotenv import load_dotenv

from flask import Flask, jsonify, request
from flask_cors import CORS
from src.hair_classification.hair_type_classification import (
    chat_with_hair_expert,
    get_hair_care_advice,
    perform_ocr_and_analyze,
)

# Load environment variables from .env file
load_dotenv()

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.route("/api/hair-advice", methods=["POST"])
def hair_advice():
    try:
        data = request.json
        advice = get_hair_care_advice(data["hairType"], data["porosity"], data["language"])
        return jsonify({"advice": advice})
    except Exception as e:
        logging.error(f"Error in hair_advice endpoint: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        logging.debug(f"Received chat request: {data}")
        language = data.get("language", "en")  # Use "en" as default if language is not provided
        response = chat_with_hair_expert(data["messages"], language)
        logging.debug(f"Chat response: {response}")
        return jsonify({"response": response})
    except Exception as e:
        logging.error(f"Error in chat endpoint: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route("/api/product-analysis", methods=["POST"])
def product_analysis():
    try:
        image = request.files["image"]
        hair_type = request.form["hairType"]
        porosity = request.form["porosity"]
        language = request.form["language"]
        analysis = perform_ocr_and_analyze(image, hair_type, porosity, language)
        return jsonify({"analysis": analysis})
    except Exception as e:
        logging.error(f"Error in product_analysis endpoint: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=True)
