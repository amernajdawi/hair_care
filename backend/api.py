import logging
import traceback

from flask import Flask, jsonify, request
from flask_cors import CORS
from src.hair_classification.hair_type_classification import (
    chat_with_hair_expert,
    get_hair_care_advice,
    perform_ocr_and_analyze,
)

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app)


@app.route("/api/hair-advice", methods=["POST"])
def hair_advice():
    data = request.json
    advice = get_hair_care_advice(data["hairType"], data["porosity"], data["language"])
    return jsonify({"advice": advice})


@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        logging.debug(f"Received chat request: {data}")
        language = data.get("language", "en")  # Use "en" as default if language is not provided
        hair_type = data.get("hairType", "")  # Get hair type from request
        porosity = data.get("porosity", "")  # Get porosity from request
        response = chat_with_hair_expert(data["messages"], hair_type, porosity, language)
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
        return jsonify({"error": "An error occurred during product analysis"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
