import os

import cv2 as cv
import numpy as np
import openai
import pytesseract
from dotenv import load_dotenv
from openai import OpenAI
from PIL import Image

# Load environment variables
load_dotenv()

# Set up OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")
MODEL = os.getenv("OPENAI_MODEL")

# Add this line to use the system-wide installation:
pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"


def get_hair_care_advice(hair_type):
    prompt = f"""Act as a professional hair care expert. Provide advice on what chemicals and natural components to look for and what to avoid in hair products for the following hair type:

    Hair Type: {hair_type}

    Please include:
    1. Recommended chemicals and natural components
    2. Chemicals and components to avoid
    3. General care tips for this hair type

    Advice:"""

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=300,
        n=1,
        stop=None,
        temperature=0.1,
    )

    return response.choices[0].message.content.strip()


def chat_with_hair_expert(messages):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        max_tokens=150,
        n=1,
        stop=None,
        temperature=0.1,
    )
    return response.choices[0].message.content.strip()


def perform_ocr_and_analyze(image, hair_type):
    # Convert streamlit image to opencv format
    image = Image.open(image)
    image = np.array(image.convert("RGB"))
    image = image[:, :, ::-1].copy()

    # Preprocess the image
    gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
    thresh = cv.threshold(gray, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU)[1]

    # Perform OCR
    extracted_text = pytesseract.image_to_string(thresh)

    # Analyze the extracted text
    prompt = f"""As a professional hair care expert, provide a detailed analysis of the following text extracted from a hair product label for {hair_type} hair:

    {extracted_text}

    Please provide a comprehensive analysis including:
    1. Product suitability for the given hair type, explaining why it is or isn't suitable.
    2. Detailed list of beneficial ingredients, their effects, and why they're good for this hair type.
    3. Detailed list of harmful or potentially problematic ingredients, their effects, and why they might be concerning for this hair type.
    4. An in-depth overall recommendation on whether to use this product, considering the balance of beneficial and harmful ingredients.
    5. Suggested frequency of use if recommended, or alternative product types if not recommended.

    Format your response as follows:
    Suitability:
    [Detailed explanation of product suitability]

    Beneficial Ingredients:
    - [Ingredient 1]: [Detailed effects and benefits for this hair type]
    - [Ingredient 2]: [Detailed effects and benefits for this hair type]
    ...

    Harmful or Potentially Problematic Ingredients:
    - [Ingredient 1]: [Detailed effects and potential issues for this hair type]
    - [Ingredient 2]: [Detailed effects and potential issues for this hair type]
    ...

    Overall Recommendation:
    [Comprehensive recommendation including usage advice or alternatives]
    """

    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,
        n=1,
        stop=None,
        temperature=0.1,
    )

    analysis = response.choices[0].message.content.strip()
    return analysis
