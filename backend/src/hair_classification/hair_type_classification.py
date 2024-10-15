import os
import logging
import cv2 as cv
import numpy as np
import pytesseract
from dotenv import load_dotenv
from openai import OpenAI
from PIL import Image
import traceback

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL = os.getenv("OPENAI_MODEL")

pytesseract.pytesseract.tesseract_cmd = pytesseract.pytesseract.tesseract_cmd or "tesseract"


def get_hair_care_advice(hair_type, porosity, oiliness, dyed, language="en"):
    print(f"get_hair_care_advice called with language: {language}")  # Debug print

    prompt = f"""
Act as a professional hair care expert. Provide advice on what chemicals and natural components to look for and what to avoid in hair products for the following hair characteristics:

Hair Type: {hair_type}
Hair Porosity: {porosity}
Hair Oiliness: {oiliness}
Hair Dyed: {dyed}

Your response should include the following sections and tell the user his Hair Type, Hair Porosity, Hair Oiliness, and Hair Dyed

1. Recommended Brands for Product Analysis

Suggest reputable, salon-quality brands known for their effective hair care products (excluding drugstore brands and the following: Mielle, Sunsilk, Pantene, Elvive L'Oréal, Garnier, TRESemmé, Head & Shoulders, Dove, Aussie, OGX, Herbal Essences, Cantu, and Bed Head).
For each brand:
Name: Brand Name
Specialty: Describe the brand's focus, such as moisturizing, damage repair, or color care.
Example Products: Include a variety of product types (e.g., shampoo, conditioner, leave-in conditioner, oil, hair mask) and list up to two specific examples worth considering for further analysis.

2. Recommended Chemicals and Natural Components

For each recommendation:
Name: The chemical or natural component
Benefits: Briefly explain why this component is beneficial for the given hair type, porosity, oiliness, and dye status.
Usage Guidelines:
Recommended Amount: Specify how much to use.
Frequency: Indicate how often it should be used.

Note: If recommending protein treatments or products, mention that overuse of protein may be harmful and explain why.

3. Chemicals and Components to Avoid

Name: The chemical or natural component
Risks: Explain why it should be avoided for this specific hair profile.

4. General Hair Care Tips

Provide practical advice on:
Washing Frequency: How often should this hair type be washed?
Styling Tips: Recommendations for maintaining healthy hair texture and preventing damage.
Heat and Chemical Treatments: Guidance on safe usage, if applicable.
Additional Care: Any other essential tips.

Important:
Base your advice on reputable sources in the field of hair care and trichology.
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


def chat_with_hair_expert(messages, hair_type, porosity, oiliness, dyed, language="en"):
    print(f"chat_with_hair_expert called with language: {language}, hair_type: {hair_type}, porosity: {porosity}, oiliness: {oiliness}, dyed: {dyed}")  # Debug print

    system_message = {
        "role": "system",
        "content": f"""
        You are a professional hair care expert. Always respond in {'Arabic' if language == 'ar' else 'English'}.
        
        Hair Type: {hair_type}
        Hair Porosity: {porosity}
        Hair Oiliness: {oiliness}
        Hair Dyed: {dyed}
        
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
        3. Avoid recommending the following brands: Mielle, Sunsilk, Pantene, Elvive L'Oréal, Garnier, TRESemmé, 
           Head & Shoulders, Dove, Aussie, OGX, Herbal Essences, Cantu and Bed Head.
        4. Consider hair type, porosity, oiliness, and dye status when providing advice.
        5. Tailor your responses specifically to the given hair characteristics.
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


def perform_ocr_and_analyze(image, hair_type, porosity, scalpType, dyed, language="en"):
    try:
        logging.debug(f"Starting OCR and analysis for image")
        image = np.array(Image.open(image).convert("RGB"))[:, :, ::-1]
        gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
        thresh = cv.threshold(gray, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU)[1]
        extracted_text = pytesseract.image_to_string(thresh)
        
        logging.debug(f"OCR completed. Extracted text length: {len(extracted_text)}")

        if not extracted_text.strip():
            logging.warning("No text extracted from the image")
            return "No text could be extracted from the image. Please ensure the image contains clear, readable text."

        prompt = f"""As a professional hair care expert, provide a detailed analysis of the following text extracted from a hair product label for {hair_type} hair with {porosity} porosity, {scalpType} scalp type, and {dyed} status:

        hair care products details:
        {extracted_text}
        
        If the text is Not about hair care products details, respond with "Not Related" and ask the user to reupload a related image.
        
        else:
        Please provide a comprehensive analysis including:
        1. Product suitability for the given hair characteristics, explaining why it is or isn't suitable.
        2. Detailed list of beneficial ingredients, their effects, and why they're good for this hair type, porosity, scalp type, and dye status.
        3. Detailed list of harmful or potentially problematic ingredients, their effects, and why they might be concerning for these hair characteristics.
        4. An in-depth overall recommendation on whether to use this product, considering the balance of beneficial and harmful ingredients.
        5. Suggested frequency of use if recommended, or alternative product types if not recommended.
        6. A usability score from 0 to 10, where 0 is not usable at all and 10 is perfectly suited for these hair characteristics.

        Format your response as follows:
        Suitability:
        [Detailed explanation of product suitability]

        Beneficial Ingredients:
        - [Ingredient 1]: [Detailed effects and benefits for these hair characteristics]
        - [Ingredient 2]: [Detailed effects and benefits for these hair characteristics]
        ...

        Harmful or Potentially Problematic Ingredients:
        - [Ingredient 1]: [Detailed effects and potential issues for these hair characteristics]
        - [Ingredient 2]: [Detailed effects and potential issues for these hair characteristics]
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

        logging.debug("Sending request to OpenAI API")
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            max_tokens=1000,
            n=1,
            stop=None,
            temperature=0.1,
        )
        logging.debug("Received response from OpenAI API")

        return response.choices[0].message.content.strip()
    except Exception as e:
        logging.error(f"Error in perform_ocr_and_analyze: {str(e)}")
        logging.error(traceback.format_exc())
        raise
