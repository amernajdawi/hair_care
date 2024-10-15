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
    try:
        data = request.json
        logging.debug(f"Received hair advice request: {data}")
        
        if not all([data.get("hairType"), data.get("porosity"), data.get("scalpType"), data.get("dyed"), data.get("language")]):
            return jsonify({"error": "Missing required fields"}), 400

        advice = get_hair_care_advice(
            data["hairType"],
            data["porosity"],
            data["scalpType"],
            data["dyed"],
            data["language"]
        )
        logging.debug(f"Generated hair advice: {advice[:100]}...")  # Log first 100 characters of advice
        return jsonify({"advice": advice})
    except Exception as e:
        logging.error(f"Error in hair_advice endpoint: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({"error": f"An error occurred while generating hair advice: {str(e)}"}), 500


@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        logging.debug(f"Received chat request: {data}")
        language = data.get("language", "en")
        hair_type = data.get("hairType", "")
        porosity = data.get("porosity", "")
        oiliness = data.get("oiliness", "")
        dyed = data.get("dyed", "")
        response = chat_with_hair_expert(
            data["messages"],
            hair_type,
            porosity,
            oiliness,
            dyed,
            language
        )
        logging.debug(f"Chat response: {response}")
        return jsonify({"response": response})
    except Exception as e:
        logging.error(f"Error in chat endpoint: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


@app.route("/api/product-analysis", methods=["POST"])
def product_analysis():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        image = request.files["image"]
        hair_type = request.form.get("hairType")
        porosity = request.form.get("porosity")
        scalpType = request.form.get("scalpType")
        dyed = request.form.get("dyed")
        language = request.form.get("language", "en")
        
        logging.debug(f"Received product analysis request: hair_type={hair_type}, porosity={porosity}, scalpType={scalpType}, dyed={dyed}, language={language}")
        
        if not all([hair_type, porosity, scalpType, dyed]):
            missing_fields = [field for field in ['hairType', 'porosity', 'scalpType', 'dyed'] if not request.form.get(field)]
            return jsonify({"error": f"Missing hair characteristics: {', '.join(missing_fields)}. Please provide all required information."}), 400
        
        analysis = perform_ocr_and_analyze(
            image,
            hair_type,
            porosity,
            scalpType,
            dyed,
            language
        )
        logging.debug("Product analysis completed successfully")
        return jsonify({"analysis": analysis})
    except Exception as e:
        logging.error(f"Error in product analysis: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({"error": f"An error occurred during product analysis: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
