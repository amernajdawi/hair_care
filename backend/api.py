from flask import Flask, jsonify, request
from flask_cors import CORS
from src.hair_classification.hair_type_classification import (
    chat_with_hair_expert,
    get_hair_care_advice,
    perform_ocr_and_analyze,
)

app = Flask(__name__)
CORS(app)


@app.route("/api/hair-advice", methods=["POST"])
def hair_advice():
    data = request.json
    advice = get_hair_care_advice(data["hairType"], data["porosity"])
    return jsonify({"advice": advice})


@app.route("/api/chat", methods=["POST"])
def chat():
    response = chat_with_hair_expert(request.json["messages"])
    return jsonify({"response": response})


@app.route("/api/product-analysis", methods=["POST"])
def product_analysis():
    try:
        image = request.files["image"]
        hair_type = request.form["hairType"]
        porosity = request.form["porosity"]
        analysis = perform_ocr_and_analyze(image, hair_type, porosity)
        return jsonify({"analysis": analysis})
    except Exception as e:
        return jsonify({"error": "An error occurred during product analysis"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
