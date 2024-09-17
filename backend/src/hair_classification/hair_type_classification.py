import os

import cv2 as cv
import numpy as np
import pytesseract
from dotenv import load_dotenv
from openai import OpenAI
from PIL import Image

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL = os.getenv("OPENAI_MODEL")

pytesseract.pytesseract.tesseract_cmd = pytesseract.pytesseract.tesseract_cmd or "tesseract"


def get_hair_care_advice(hair_type, porosity, language="en"):
    print(f"get_hair_care_advice called with language: {language}")  # Debug print

    prompt = f"""Act as a professional hair care expert. Provide advice on what chemicals and natural components to look for and what to avoid in hair products for the following hair type and porosity:

    Hair Type: {hair_type}
    Hair Porosity: {porosity}

    Please include:
    1. Recommended chemicals and natural components
    2. Chemicals and components to avoid
    3. General care tips for this hair type and porosity

    For each recommended chemical or natural component, please specify:
    - The recommended amount to use
    - How frequently it should be used

    If you suggest protein treatments or products, please mention that overuse of protein may be harmful and explain why.

    Ensure that all answers to my questions come from reputable sources in the field of hair care and trichology.

    Advice:"""

    messages = [
        {
            "role": "system",
            "content": f"You are a hair care expert. Always respond in {'Arabic' if language == 'ar' else 'English'}.",
        },
        {"role": "user", "content": prompt},
    ]

    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        max_tokens=1000,
        n=1,
        stop=None,
        temperature=0.1,
    )

    return response.choices[0].message.content.strip()


def chat_with_hair_expert(messages, hair_type, porosity, language="en"):
    print(f"chat_with_hair_expert called with language: {language}, hair_type: {hair_type}, porosity: {porosity}")  # Debug print

    system_message = {
        "role": "system",
        "content": f"""
        You are a professional hair care expert. Always respond in {'Arabic' if language == 'ar' else 'English'}.
        
        Hair Type: {hair_type}
        Hair Porosity: {porosity}
        
        Recommended brands for analysis and suggestions:
        - ALASEEL
        - Hareer
        - Eva Professional Hair Care
        - Mielle
        - Simply Zen
        - Olaplex
        - Teknia
        
        Instructions:
        1. Utilize these products' attributes for personalized suggestions and relevant content generation.
        2. You may suggest other high-quality hair care products that align with professional standards.
        3. Avoid recommending the following brands: Sunsilk, Pantene, Elvive L'Oréal, Garnier, TRESemmé, 
           Head & Shoulders, Dove, Aussie, OGX, Herbal Essences, Cantu and Bed Head.
        4. Consider both hair type and porosity when providing advice.
        5. Tailor your responses specifically to the given hair type and porosity.
        """,
    }

    response = client.chat.completions.create(
        model=MODEL,
        messages=[system_message] + messages,
        max_tokens=1000,
        n=1,
        stop=None,
        temperature=0.1,
    )
    return response.choices[0].message.content.strip()


def perform_ocr_and_analyze(image, hair_type, porosity, language="en"):
    print(f"perform_ocr_and_analyze called with language: {language}")  # Debug print

    image = np.array(Image.open(image).convert("RGB"))[:, :, ::-1]
    gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
    thresh = cv.threshold(gray, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU)[1]
    extracted_text = pytesseract.image_to_string(thresh)

    prompt = f"""As a professional hair care expert, provide a detailed analysis of the following text extracted from a hair product label for {hair_type} hair with {porosity} hair porosity:

    {extracted_text}

    Please provide a comprehensive analysis including:
    1. Product suitability for the given hair type and porosity, explaining why it is or isn't suitable.
    2. Detailed list of beneficial ingredients, their effects, and why they're good for this hair type and porosity.
    3. Detailed list of harmful or potentially problematic ingredients, their effects, and why they might be concerning for this hair type and porosity.
    4. An in-depth overall recommendation on whether to use this product, considering the balance of beneficial and harmful ingredients.
    5. Suggested frequency of use if recommended, or alternative product types if not recommended.
    6. A usability score from 0 to 10, where 0 is not usable at all and 10 is perfectly suited for this hair type and porosity.

    Format your response as follows:
    Suitability:
    [Detailed explanation of product suitability]

    Beneficial Ingredients:
    - [Ingredient 1]: [Detailed effects and benefits for this hair type and porosity]
    - [Ingredient 2]: [Detailed effects and benefits for this hair type and porosity]
    ...

    Harmful or Potentially Problematic Ingredients:
    - [Ingredient 1]: [Detailed effects and potential issues for this hair type]
    - [Ingredient 2]: [Detailed effects and potential issues for this hair type]
    ...

    Overall Recommendation:
    [Comprehensive recommendation including usage advice or alternatives]

    Usability Score: [Score from 0 to 10]
    [Brief explanation of the score]
    """

    messages = [
        {
            "role": "system",
            "content": f"You are a hair care expert. Always respond in {'Arabic' if language == 'ar' else 'English'}.",
        },
        {"role": "user", "content": prompt},
    ]

    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        max_tokens=1000,
        n=1,
        stop=None,
        temperature=0.1,
    )

    return response.choices[0].message.content.strip()
