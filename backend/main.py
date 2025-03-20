from fastapi import FastAPI, HTTPException, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import random
import os
import google.generativeai as genai
import torch
from argparse import Namespace
import pickle
from dotenv import load_dotenv

load_dotenv()


from utils.bert import BertForSequenceRegression
from utils.pincone_utils import (
    fetch_adhd_papers,
    store_papers_in_pinecone,
    generate_response_with_context,
)

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define config globally
config = Namespace(hidden_dropout_prob=0.05, hidden_size=768)

# Device
device = torch.device("cpu")

# Load models with fresh DeBERTa base
model_notadhd_debarta = (
    BertForSequenceRegression().cpu()
)  # Default to "microsoft/deberta-base"
model_notadhd_debarta.load_state_dict(
    torch.load("Models/Not ADHD/Debarta/deb_model_3.pt", map_location=device)
)

model_adhd_debarta = BertForSequenceRegression().cpu()
model_adhd_debarta.load_state_dict(
    torch.load("Models/ADHD/Debarta/adhd_deb_model_3.pt", map_location=device)
)

# Tokenizer and input prep
with open("Models/Not ADHD/Debarta/bert_tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

# load the Gemini API key from environment variable
GENAI_API_KEY = os.getenv("GOOGLE_API_KEY")

os.environ["GOOGLE_API_KEY"] = GENAI_API_KEY
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel("gemini-1.5-pro")


# Ensure uploads directory exists
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# Database setup
conn = sqlite3.connect("users.db", check_same_thread=False)
c = conn.cursor()

# Users table
c.execute(
    """CREATE TABLE IF NOT EXISTS users (
    email TEXT PRIMARY KEY,
    password TEXT,
    username TEXT,
    profile_pic TEXT,
    adhd_status TEXT
)"""
)

# Performance metrics table
c.execute(
    """CREATE TABLE IF NOT EXISTS performance_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    focus_time INTEGER,  -- Minutes spent focused
    task_completion INTEGER,  -- Number of tasks completed
    distraction_count INTEGER,  -- Number of distractions logged
    timestamp TEXT,
    FOREIGN KEY (email) REFERENCES users(email)
)"""
)
conn.commit()


# Dummy data generation
def generate_dummy_metrics(email):
    for _ in range(5):  # 5 days of data
        focus_time = random.randint(30, 120)  # 30-120 minutes
        task_completion = random.randint(1, 10)  # 1-10 tasks
        distraction_count = random.randint(0, 5)  # 0-5 distractions
        timestamp = f"2025-02-{random.randint(16, 20)} 10:00:00"  # Dummy dates
        c.execute(
            "INSERT INTO performance_metrics (email, focus_time, task_completion, distraction_count, timestamp) VALUES (?, ?, ?, ?, ?)",
            (email, focus_time, task_completion, distraction_count, timestamp),
        )
    conn.commit()


class AuthRequest(BaseModel):
    email: str
    password: str


class ProfileRequest(BaseModel):
    email: str
    username: str


class QuizRequest(BaseModel):
    email: str
    adhd_status: str


@app.post("/signup")
async def signup(data: AuthRequest):
    c.execute("SELECT * FROM users WHERE email = ?", (data.email,))
    if c.fetchone():
        raise HTTPException(status_code=400, detail="Email already exists")
    c.execute(
        "INSERT INTO users (email, password) VALUES (?, ?)", (data.email, data.password)
    )
    conn.commit()
    generate_dummy_metrics(data.email)
    return {"email": data.email}


@app.post("/login")
async def login(data: AuthRequest):
    c.execute(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        (data.email, data.password),
    )
    user = c.fetchone()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"email": user[0], "username": user[2] or "", "adhdStatus": user[4] or ""}


@app.post("/profile")
async def update_profile(
    email: str = Form(...), username: str = Form(...), profile_pic: UploadFile = None
):
    pic_path = None
    if profile_pic:
        pic_path = f"uploads/{profile_pic.filename}"
        with open(pic_path, "wb") as f:
            f.write(await profile_pic.read())
    c.execute(
        "UPDATE users SET username = ?, profile_pic = ? WHERE email = ?",
        (username, pic_path, email),
    )
    conn.commit()
    return {"message": "Profile updated"}


@app.post("/quiz")
async def submit_quiz(data: QuizRequest):
    c.execute(
        "UPDATE users SET adhd_status = ? WHERE email = ?",
        (data.adhd_status, data.email),
    )
    conn.commit()
    return {"message": "Quiz completed"}


@app.get("/metrics/{email}")
async def get_metrics(email: str):
    c.execute(
        "SELECT focus_time, task_completion, distraction_count, timestamp FROM performance_metrics WHERE email = ?",
        (email,),
    )
    metrics = [
        {
            "focus_time": row[0],
            "task_completion": row[1],
            "distraction_count": row[2],
            "timestamp": row[3],
        }
        for row in c.fetchall()
    ]
    return {"metrics": metrics}


@app.post("/logout")
async def logout(email: str):
    # Optional: Log logout event or clear session data if using tokens
    return {"message": "Logged out"}


# New Summary Evaluation Endpoints
class SummaryRequest(BaseModel):
    summary: str


def to_markdown(text):
    # Simple markdown conversion (replace with your actual implementation if different)
    return text.replace("\n", "<br>").replace("**", "<strong>").replace("*", "<em>")


def convert_to_positive(score):
    # Assuming this converts negative scores to positive range (e.g., 0-100)
    return max(0, min(100, (score + 1) * 50))  # Example conversion, adjust as needed


@app.post("/notadhd/submit_summary")
async def submit_summary_notadhd(request: SummaryRequest):
    summary = request.summary
    question = "What are the grammatical and sentence structure errors in the following Summary and how Can one improve it? Explain for children in grades 2-12."
    complete_response = f'{question}\n"{summary}"'

    # Tokenize the text
    tokens = tokenizer.tokenize(summary)
    cls_token_id = tokenizer.convert_tokens_to_ids("[CLS]")
    sep_token_id = tokenizer.convert_tokens_to_ids("[SEP]")
    token_index = (
        [cls_token_id] + tokenizer.convert_tokens_to_ids(tokens) + [sep_token_id]
    )

    # Pad or truncate
    max_length = 260
    pad_token_id = tokenizer.convert_tokens_to_ids("[PAD]")
    if len(token_index) < max_length:
        pad = [pad_token_id] * (max_length - len(token_index))
        token_index = token_index + pad
    else:
        token_index = token_index[:max_length]

    # Convert to tensor
    input_ids = torch.tensor([token_index], dtype=torch.long).to(device)
    attention_mask = torch.ones_like(input_ids).to(device)
    attention_mask[0, len(tokens) + 2 :] = 0  # Mask padding tokens
    content_vector = torch.randn(1, config.hidden_size).to(device)

    # Perform prediction
    with torch.no_grad():
        scores = model_notadhd_debarta(
            input_ids=input_ids,
            content_vector=content_vector,
            attention_mask=attention_mask,
        )

    content_score, wording_score = scores[0, 0].item(), scores[0, 1].item()
    positive_content_score = convert_to_positive(content_score)
    positive_wording_score = convert_to_positive(wording_score)

    # Generate response
    response = model.generate_content(complete_response)
    markdown_content = to_markdown(response.text)

    return {
        "markdown_content": markdown_content,
        "content_score": positive_content_score,
        "wording_score": positive_wording_score,
    }


@app.post("/adhd/submit_summary")
async def submit_summary_adhd(request: SummaryRequest):
    summary = request.summary
    question = "What are the grammatical and sentence structure errors in the following Summary and how Can one improve it? Explain for children in grades 2-12."
    complete_response = f'{question}\n"{summary}"'

    # Tokenize the text
    tokens = tokenizer.tokenize(summary)
    cls_token_id = tokenizer.convert_tokens_to_ids("[CLS]")
    sep_token_id = tokenizer.convert_tokens_to_ids("[SEP]")
    token_index = (
        [cls_token_id] + tokenizer.convert_tokens_to_ids(tokens) + [sep_token_id]
    )

    # Pad or truncate
    max_length = 260
    pad_token_id = tokenizer.convert_tokens_to_ids("[PAD]")
    if len(token_index) < max_length:
        pad = [pad_token_id] * (max_length - len(token_index))
        token_index = token_index + pad
    else:
        token_index = token_index[:max_length]

    # Convert to tensor
    input_ids = torch.tensor([token_index], dtype=torch.long).to(device)
    attention_mask = torch.ones_like(input_ids).to(device)
    attention_mask[0, len(tokens) + 2 :] = 0  # Mask padding tokens
    content_vector = torch.randn(1, config.hidden_size).to(device)

    # Perform prediction
    with torch.no_grad():
        scores = model_adhd_debarta(
            input_ids=input_ids,
            content_vector=content_vector,
            attention_mask=attention_mask,
        )

    content_score, wording_score = scores[:, 0].item(), scores[:, 1].item()
    positive_content_score = convert_to_positive(content_score)
    positive_wording_score = convert_to_positive(wording_score)

    # Generate response
    response = model.generate_content(complete_response)
    markdown_content = to_markdown(response.text)

    return {
        "markdown_content": markdown_content,
        "content_score": positive_content_score,
        "wording_score": positive_wording_score,
    }


class DoctorRequest(BaseModel):
    query: str


@app.post("/doctor")
async def doctor_chat(request: DoctorRequest):
    query = request.query
    research_papers = fetch_adhd_papers(query)
    store_papers_in_pinecone(research_papers)
    result = generate_response_with_context(query)
    return {"response": result}
