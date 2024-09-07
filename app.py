import base64
import os
from io import BytesIO

import requests
import streamlit as st
from PIL import Image
from streamlit_lottie import st_lottie
from streamlit_option_menu import option_menu

from src.hair_classification.hair_type_classification import (
    OpenAI,
    chat_with_hair_expert,
    get_hair_care_advice,
    os,
    perform_ocr_and_analyze,
)

# Initialize the OpenAI client
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

client = OpenAI(api_key=api_key)


def load_lottieurl(url: str):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.json()


def get_image_base64(image_path):
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode("utf-8")


# Add this function to create the common header
def create_header():
    st.markdown(
        """
        <div class="fancy-header">
            <div class="header-content">
                <img src="data:image/png;base64,{}" class="logo" alt="Logo">
                <div class="title-container">
                    <h1>Hair Care Expert</h1>
                    <h3>Powered by AI</h3>
                </div>
            </div>
        </div>
        """.format(
            get_image_base64("images/main_logo.png")
        ),
        unsafe_allow_html=True,
    )


# Modify the main function
def main():
    st.set_page_config(page_title="Hair Care Expert", layout="wide", page_icon="💇‍♀️")

    # Add custom CSS
    st.markdown(
        """
    <style>
    .stApp {
        background: linear-gradient(135deg, #FFF0F5 0%, #E6E6FA 100%);
    }
    .stSelectbox, .stButton>button, .stTextInput>div>div>input {
        border-radius: 20px;
        border: none;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }
    .stSelectbox:hover, .stTextInput>div>div>input:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
    .stTab {
        background-color: rgba(255, 255, 255, 0.7);
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .stButton>button {
        background: linear-gradient(90deg, #FF69B4, #DA70D6);
        color: white;
        font-weight: 600;
    }
    .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
    .stTextInput>div>div>input {
        background-color: rgba(255, 255, 255, 0.8);
    }
    h1, h2, h3 {
        color: #4A0E2E;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }
    .fancy-header {
        background: linear-gradient(90deg, #FF69B4, #DA70D6);
        padding: 25px 35px;
        border-radius: 25px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        margin-bottom: 30px;
    }
    .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .logo {
        width: 120px;
        height: 120px;
        object-fit: contain;
        filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));
    }
    .title-container {
        text-align: right;
    }
    .fancy-header h1 {
        color: white;
        margin: 0;
        font-size: 3.5em;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
    }
    .fancy-header h3 {
        color: #FFF0F5;
        margin: 0;
        font-weight: 300;
        font-size: 1.8em;
    }
    .sidebar .stButton>button {
        width: 100%;
        margin-bottom: 10px;
        background: linear-gradient(90deg, #FF69B4, #DA70D6);
        color: white;
        font-weight: 600;
        border-radius: 20px;
        padding: 10px 15px;
        transition: all 0.3s ease;
    }
    .sidebar .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
    .chat-container {
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 15px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .user-message {
        background-color: #E6E6FA;
        border-radius: 15px;
        padding: 10px 15px;
        margin-bottom: 10px;
    }
    .assistant-message {
        background-color: #FFF0F5;
        border-radius: 15px;
        padding: 10px 15px;
        margin-bottom: 10px;
    }
    </style>
    """,
        unsafe_allow_html=True,
    )

    create_header()

    # Create a sidebar for navigation
    with st.sidebar:
        st.markdown("<h2 style='text-align: center;'>Navigation</h2>", unsafe_allow_html=True)
        if st.button("Hair Type"):
            st.session_state.page = "Hair Type"
        if st.button("Care Advice"):
            st.session_state.page = "Care Advice"
        if st.button("Product Analysis"):
            st.session_state.page = "Product Analysis"
        if st.button("About"):
            st.session_state.page = "About"

    if "page" not in st.session_state:
        st.session_state.page = "Hair Type"

    if st.session_state.page == "Hair Type":
        hair_type_page()
    elif st.session_state.page == "Care Advice":
        care_advice_page()
    elif st.session_state.page == "Product Analysis":
        product_analysis_page()
    elif st.session_state.page == "About":
        about_page()

    # Add footer
    st.markdown("---")
    st.markdown(
        """
        <p style='text-align: center; color: #666;'>
        Made with ❤️ by Hair Care Expert | © 2024 All Rights Reserved
        </p>
        """,
        unsafe_allow_html=True,
    )


def hair_type_page():
    st.subheader("Hair Type Classification")

    hair_types = [
        "Type 1A: Straight (Fine/Thin)",
        "Type 1B: Straight (Medium)",
        "Type 1C: Straight (Coarse)",
        "Type 2A: Wavy (Fine/Thin)",
        "Type 2B: Wavy (Medium)",
        "Type 2C: Wavy (Coarse)",
        "Type 3A: Curly (Loose)",
        "Type 3B: Curly (Tight)",
        "Type 3C: Curly (Corkscrews)",
        "Type 4A: Coily (Soft)",
        "Type 4B: Coily (Wiry)",
        "Type 4C: Coily (Tight)",
    ]

    if "selected_hair_type" not in st.session_state:
        st.session_state.selected_hair_type = hair_types[0]

    st.session_state.selected_hair_type = st.selectbox(
        "Select your hair type:",
        hair_types,
        index=hair_types.index(st.session_state.selected_hair_type),
    )

    if st.button("Get Hair Care Advice", key="advice_button"):
        with st.spinner("Generating advice..."):
            advice = get_hair_care_advice(st.session_state.selected_hair_type)
            st.success("Advice generated!")
            st.write(advice)


def care_advice_page():
    st.subheader("Chat with Hair Care Expert")

    if (
        "messages" not in st.session_state
        or st.session_state.selected_hair_type != st.session_state.get("last_hair_type")
    ):
        st.session_state.messages = [
            {
                "role": "system",
                "content": f"You are a professional hair care expert. Provide advice and answer questions about hair care. The user's hair type is {st.session_state.selected_hair_type}. Always consider this hair type when giving advice.",
            },
            {
                "role": "assistant",
                "content": f"Hello! I'm your AI hair care expert. I see that your hair type is {st.session_state.selected_hair_type}. How can I help you with your hair today?",
            },
        ]
        st.session_state.last_hair_type = st.session_state.selected_hair_type

    for message in st.session_state.messages[1:]:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("Ask about your hair"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            message_placeholder = st.empty()
            full_response = chat_with_hair_expert(st.session_state.messages)
            message_placeholder.markdown(full_response)
        st.session_state.messages.append({"role": "assistant", "content": full_response})

    if st.button("Start New Conversation"):
        st.session_state.messages = [
            {
                "role": "system",
                "content": f"You are a professional hair care expert. Provide advice and answer questions about hair care. The user's hair type is {st.session_state.selected_hair_type}. Always consider this hair type when giving advice.",
            },
            {
                "role": "assistant",
                "content": f"Hello! I'm your AI hair care expert. I see that your hair type is {st.session_state.selected_hair_type}. How can I help you with your hair today?",
            },
        ]
        st.rerun()


def product_analysis_page():
    st.subheader("Product Analysis")
    if "selected_hair_type" in st.session_state:
        st.write("Selected hair type:", st.session_state.selected_hair_type)

        uploaded_file = st.file_uploader(
            "Upload an image of your hair product label", type=["jpg", "jpeg", "png"]
        )
        if uploaded_file is not None:
            # Remove the following line to avoid displaying the image
            # st.image(uploaded_file, caption="Uploaded Image", use_column_width=True)

            with st.spinner("Performing OCR and analyzing..."):
                analysis = perform_ocr_and_analyze(
                    uploaded_file, st.session_state.selected_hair_type
                )
                st.markdown("## Analysis:")
                st.markdown(analysis)
    else:
        st.error("Please classify your hair type first.")


def about_page():
    st.markdown(
        """
        ## Welcome to the AI-Powered Hair Care Expert

        This innovative web application is designed to revolutionize your hair care routine using cutting-edge AI technology. Our platform offers personalized advice and analysis tailored to your specific hair type and concerns.

        ### Key Features:
        1. **Hair Type Classification**: Identify your hair type and receive customized care recommendations.
        2. **AI Chat Assistant**: Engage with our AI expert to get answers to all your hair care questions.
        3. **Product Analysis**: Upload images of hair care products for AI-driven analysis and compatibility assessment.

        Whether you're looking to address specific hair issues, find the perfect product, or simply optimize your hair care routine, our AI-powered tool is here to help you achieve your hair goals.

        Get started by selecting your hair type in the Hair Type tab!
        """
    )


if __name__ == "__main__":
    main()
