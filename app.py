from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
import os
import pathlib
import textwrap
import google.generativeai as genai
from IPython.display import display
from IPython.display import Markdown
import numpy as np
import torch
import torch.nn as nn
from argparse import Namespace
import pickle

app = Flask(__name__)


class BertForSequenceRegression(nn.Module):

    def __init__(self, num_marks=2):
        super(BertForSequenceRegression, self).__init__()
        self.num_marks = num_marks
        with open("Models/deberta_model.pkl", "rb") as f:
            self.bert = pickle.load(f)

        self.hidden_1 = nn.Linear(2 * config.hidden_size, 2 * config.hidden_size)
        self.notline_1 = nn.ReLU()
        self.dropout_1 = nn.Dropout(config.hidden_dropout_prob)
        self.hidden_2 = nn.Linear(2 * config.hidden_size, config.hidden_size)
        self.notline_2 = nn.ReLU()

        self.dropout_2 = nn.Dropout(config.hidden_dropout_prob)
        self.hidden = nn.Linear(config.hidden_size, 128)
        self.regres = nn.Linear(128, num_marks)

    def forward(
        self,
        input_ids,
        content_vector,
        token_type_ids=None,
        attention_mask=None,
        labels=None,
    ):
        output_bert = self.bert(
            input_ids, token_type_ids, attention_mask
        ).last_hidden_state.mean(1)
        h_concat = torch.cat((content_vector, output_bert), dim=1)
        hidden_vec_1 = self.hidden_1(h_concat)
        hidden_drop_1 = self.dropout_1(hidden_vec_1)
        hidden_vecn_1 = self.notline_1(hidden_drop_1)
        hidden_vec_2 = self.hidden_2(hidden_vecn_1)
        hidden_drop_2 = self.dropout_2(hidden_vec_2)
        hidden_vecn_2 = self.notline_2(hidden_drop_2)
        hidden = self.hidden(hidden_vecn_2)
        marks = self.regres(hidden)

        return marks


config = Namespace(hidden_dropout_prob=0.05, hidden_size=768)
model_bert = BertForSequenceRegression()

# Define the device to be CPU
device = torch.device("cpu")

# Load the tokenizer using pickle
with open("Models/bert_tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

# Load the trained model
model_bert = BertForSequenceRegression().cpu()  # Ensure model is on CPU
model_bert.load_state_dict(
    torch.load(
        "Models/deb_model_3.pt",
        map_location=device,
    )
)
model_bert.eval()

os.environ["GOOGLE_API_KEY"] = "AIzaSyDknsuaSlcs3rAn5coQ_8GI_unD58XjQDc"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel("gemini-pro")


def convert_to_positive(score):
    return 1 / (1 + np.exp(-score))


def to_markdown(text):
    text = text.replace("•", "  *")
    return textwrap.indent(text, "> ", predicate=lambda _: True)


@app.route("/")
def index():
    return render_template("home.html")


@app.route("/aboutus")
def about_us():
    return render_template("aboutus.html")


@app.route("/teacher")
def teacher():
    return render_template("teacher.html")


@app.route("/student")
def student():
    return render_template("student.html")


@app.route("/adhd")
def adhd():
    return render_template("adhd.html")


@app.route("/notadhd/submit_summary", methods=["POST"])
def submit_summary_notadhd():
    summary = request.json.get("summary", "")
    question = "What are the grammatical and sentence structure errors in the following Summary and how Can one imporve it? Explain for children in grades 2-12."
    summary = '"' + summary + '"'
    complete_response = question + "\n" + summary

    # Tokenize the text
    tokens = tokenizer.tokenize(summary)
    token_index = (
        [tokenizer.cls_token_id]
        + tokenizer.convert_tokens_to_ids(tokens)
        + [tokenizer.sep_token_id]
    )

    # Pad or truncate the token index
    max_length = 260
    if len(token_index) < max_length:
        pad = [tokenizer.pad_token_id] * (max_length - len(token_index))
        token_index = token_index + pad
    else:
        token_index = token_index[:max_length]

    # Convert token index to tensor
    data_vector = torch.LongTensor(token_index).unsqueeze(dim=0).to(device)

    # Generate content vector (random for illustration)
    content_vector = torch.randn(1, 768).to(device)

    # Generate attention mask
    attention_mask = (data_vector != 0).long()

    # Perform prediction
    with torch.no_grad():
        scores = model_bert(data_vector, content_vector, attention_mask=attention_mask)

    # Parse the output tensor to extract content and wording scores
    content_score, wording_score = scores[:, 0], scores[:, 1]

    # Convert content and wording scores to positive values
    positive_content_score = convert_to_positive(content_score.item())
    positive_wording_score = convert_to_positive(wording_score.item())

    response = model.generate_content(complete_response)
    markdown_content = to_markdown(response.text)

    response_data = {
        "markdown_content": markdown_content,
        "content_score": positive_content_score,
        "wording_score": positive_wording_score,
    }

    # Redirect to the results page with the markdown_content as a query parameter
    return jsonify(response_data), 200, {"Content-Type": "application/json"}


@app.route("/adhd/submit_summary", methods=["POST"])
def submit_summary():
    summary = request.json.get("summary", "")
    question = "What are the grammatical and sentence structure errors in the following Summary and how Can one imporve it? Explain for children in grades 2-12."
    summary = '"' + summary + '"'
    complete_response = question + "\n" + summary

    # Tokenize the text
    tokens = tokenizer.tokenize(summary)
    token_index = (
        [tokenizer.cls_token_id]
        + tokenizer.convert_tokens_to_ids(tokens)
        + [tokenizer.sep_token_id]
    )

    # Pad or truncate the token index
    max_length = 260
    if len(token_index) < max_length:
        pad = [tokenizer.pad_token_id] * (max_length - len(token_index))
        token_index = token_index + pad
    else:
        token_index = token_index[:max_length]

    # Convert token index to tensor
    data_vector = torch.LongTensor(token_index).unsqueeze(dim=0).to(device)

    # Generate content vector (random for illustration)
    content_vector = torch.randn(1, 768).to(device)

    # Generate attention mask
    attention_mask = (data_vector != 0).long()

    # Perform prediction
    with torch.no_grad():
        scores = model_bert(data_vector, content_vector, attention_mask=attention_mask)

    # Parse the output tensor to extract content and wording scores
    content_score, wording_score = scores[:, 0], scores[:, 1]

    # Convert content and wording scores to positive values
    positive_content_score = convert_to_positive(content_score.item())
    positive_wording_score = convert_to_positive(wording_score.item())

    response = model.generate_content(complete_response)
    markdown_content = to_markdown(response.text)

    response_data = {
        "markdown_content": markdown_content,
        "content_score": positive_content_score,
        "wording_score": positive_wording_score,
    }

    # Redirect to the results page with the markdown_content as a query parameter
    return jsonify(response_data), 200, {"Content-Type": "application/json"}


@app.route("/resultsadhd")
def resultsadhd():
    # Get the markdown_content from the query parameters
    markdown_content = request.args.get("markdown_content", "")
    content_score = request.args.get("content_score", "")
    wording_score = request.args.get("wording_score", "")

    print(content_score, wording_score)
    print(markdown_content)

    # Render the template with the values
    return render_template(
        "resultsadhd.html",
        markdown_content=markdown_content,
        content_score=content_score,
        wording_score=wording_score,
    )


@app.route("/resultsnotadhd")
def resultsnotadhd():
    # Get the markdown_content from the query parameters
    # Get the markdown_content from the query parameters
    markdown_content = request.args.get("markdown_content", "")
    content_score = request.args.get("content_score", "")
    wording_score = request.args.get("wording_score", "")

    print(content_score, wording_score)
    print(markdown_content)

    return render_template(
        "resultsnotadhd.html",
        markdown_content=markdown_content,
        content_score=content_score,
        wording_score=wording_score,
    )


@app.route("/notadhd")
def notadhd():
    return render_template("notadhd.html")


@app.route("/quiz")
def quiz():
    return render_template("quiz.html")


@app.route("/startquiz")
def startquiz():
    return render_template("startquiz.html")


@app.route("/teacheradhd")
def teacheradhd():
    return render_template("teacheradhd.html")


@app.route("/teachernotadhd")
def teachernotadhd():
    return render_template("teachernotadhd.html")


if __name__ == "__main__":
    app.run(debug=True)
