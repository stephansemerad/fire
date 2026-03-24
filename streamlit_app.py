import streamlit as st
import pandas as pd
import numpy as np

st.title("My First Streamlit App")

# User input
user_input = st.text_input("Enter some text:")
if user_input:
    st.write("You said:", user_input)

# Sample data and slider
df = pd.DataFrame(np.random.randn(10, 2), columns=["A", "B"])
slider_val = st.slider("Filter threshold", 0.0, 1.0, 0.5)
filtered_df = df[df["A"] > slider_val]
st.write(filtered_df)
