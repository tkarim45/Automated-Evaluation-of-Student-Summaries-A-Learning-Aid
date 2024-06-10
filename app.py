from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    flash,
    jsonify,
    session,
)

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
from flask_sqlalchemy import SQLAlchemy
import bcrypt

app = Flask(__name__)


app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
db = SQLAlchemy(app)
app.secret_key = "secret_key"


class BertForSequenceRegression(nn.Module):

    def __init__(self, path, num_marks=2):
        super(BertForSequenceRegression, self).__init__()
        self.num_marks = num_marks
        with open(path, "rb") as f:
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


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    role = db.Column(db.String(100), default="student")

    def __init__(self, email, password, name, role):
        self.name = name
        self.email = email
        self.password = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")
        self.role = role

    def check_password(self, password):
        return bcrypt.checkpw(password.encode("utf-8"), self.password.encode("utf-8"))


not_adhd_path = "Models/Not ADHD/Debarta/deberta_model.pkl"
adhd_path = "Models/ADHD/Debarta/deberta_model.pkl"

config = Namespace(hidden_dropout_prob=0.05, hidden_size=768)

model_notadhd_debarta = BertForSequenceRegression(not_adhd_path)
model_adhd_debarta = BertForSequenceRegression(adhd_path)

# Define the device to be CPU
device = torch.device("cpu")

# Load the tokenizer using pickle
with open("Models/Not ADHD/Debarta/bert_tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

# Load the trained model
model_notadhd_debarta = BertForSequenceRegression(
    not_adhd_path
).cpu()  # Ensure model is on CPU
model_notadhd_debarta.load_state_dict(
    torch.load(
        "Models/Not ADHD/Debarta/deb_model_3.pt",
        map_location=device,
    )
)
model_notadhd_debarta.eval()


model_adhd_debarta = BertForSequenceRegression(
    adhd_path
).cpu()  # Ensure model is on CPU
model_adhd_debarta.load_state_dict(
    torch.load(
        "Models/ADHD/Debarta/adhd_deb_model_3.pt",
        map_location=device,
    )
)
model_adhd_debarta.eval()

os.environ["GOOGLE_API_KEY"] = "AIzaSyDknsuaSlcs3rAn5coQ_8GI_unD58XjQDc"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel("gemini-pro")


def convert_to_positive(score):
    return 1 / (1 + np.exp(-score))


def to_markdown(text):
    text = text.replace("•", "  *")
    return textwrap.indent(text, "> ", predicate=lambda _: True)


with app.app_context():
    db.create_all()


@app.route("/")
def index():
    return render_template("home.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        # handle request
        name = request.form["name"]
        email = request.form["email"]
        password = request.form["password"]
        role = request.form["role"]

        new_user = User(name=name, email=email, password=password, role=role)
        db.session.add(new_user)
        db.session.commit()

        if role == "teacher":
            return redirect("/loginTeacher")

        return redirect("/loginStudent")

    return render_template("register.html")


@app.route("/loginTeacher", methods=["GET", "POST"])
def loginTeacher():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        role = "teacher"

        if role == "teacher":
            user = User.query.filter_by(email=email).first()

            if user and user.check_password(password):
                session["email"] = user.email
                return redirect("/teacher")
            else:
                return render_template("loginTeacher.html", error="Invalid user")
        else:
            return render_template("loginTeacher.html", error="Invalid user")

    return render_template("loginTeacher.html")


@app.route("/loginStudent", methods=["GET", "POST"])
def loginStudent():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        role = "student"

        if role == "student":
            user = User.query.filter_by(email=email).first()

            if user and user.check_password(password):
                session["email"] = user.email
                return redirect("/student")
            else:
                return render_template("login.html", error="Invalid user")
        else:
            return render_template("login.html", error="Invalid user")

    return render_template("loginStudent.html")


@app.route("/logout")
def logout():
    session.pop("email", None)
    return redirect("/login")


@app.route("/aboutus")
def about_us():
    return render_template("aboutus.html")


@app.route("/teacher")
def teacher():
    if session["email"]:
        user = User.query.filter_by(email=session["email"]).first()
        return render_template("teacher.html")

    return redirect("/login")


@app.route("/student")
def student():
    if session["email"]:
        user = User.query.filter_by(email=session["email"]).first()
        return render_template("student.html")

    return redirect("/login")


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
        scores = model_notadhd_debarta(
            data_vector, content_vector, attention_mask=attention_mask
        )

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
def submit_summary_adhd():
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
        scores = model_adhd_debarta(
            data_vector, content_vector, attention_mask=attention_mask
        )

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


@app.route("/teachernotadhd/submit_summary", methods=["POST"])
def submit_summary_teacher_notadhd():
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
        scores = model_notadhd_debarta(
            data_vector, content_vector, attention_mask=attention_mask
        )

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


@app.route("/teacheradhd/submit_summary", methods=["POST"])
def submit_summary_teacher_adhd():
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
        scores = model_notadhd_debarta(
            data_vector, content_vector, attention_mask=attention_mask
        )

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

    # print(content_score, wording_score)
    # print(markdown_content)

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

    # print(content_score, wording_score)
    # print(markdown_content)

    return render_template(
        "resultsnotadhd.html",
        markdown_content=markdown_content,
        content_score=content_score,
        wording_score=wording_score,
    )


@app.route("/teacherresultadhd")
def teacherresultadhd():
    markdown_content = request.args.get("markdown_content", "")
    content_score = request.args.get("content_score", "")
    wording_score = request.args.get("wording_score", "")

    return render_template(
        "teacherresultadhd.html",
        markdown_content=markdown_content,
        content_score=content_score,
        wording_score=wording_score,
    )


@app.route("/teacherresultnotadhd")
def teacherresultnotadhd():

    markdown_content = request.args.get("markdown_content", "")
    content_score = request.args.get("content_score", "")
    wording_score = request.args.get("wording_score", "")

    # print(content_score, wording_score)
    # print(markdown_content)

    return render_template(
        "teacherresultnotadhd.html",
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
