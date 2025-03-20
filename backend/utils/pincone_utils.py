import requests
from bs4 import BeautifulSoup
from pinecone import Pinecone, ServerlessSpec
from sentence_transformers import SentenceTransformer
import google.generativeai as genai
import os
from dotenv import load_dotenv

PINECONE_API_KEY = (
    ""
)
INDEX_NAME = "adhd-research"
PINECONE_ENVIRONMENT = "us-east-1"
DIMENSION = 384  # Dimension for text-embedding-ada-002


os.environ["GOOGLE_API_KEY"] = "AIzaSyDknsuaSlcs3rAn5coQ_8GI_unD58XjQDc"
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
model = genai.GenerativeModel("gemini-1.5-pro")

# Embedding model
embedder = SentenceTransformer("all-MiniLM-L6-v2")


def fetch_adhd_papers(query, num_papers=10):
    papers = []
    base_url = "https://pubmed.ncbi.nlm.nih.gov/"
    # query = "ADHD research"
    page = 1
    papers_collected = 0

    while papers_collected < num_papers:
        search_url = f"{base_url}?term={query}&page={page}"
        response = requests.get(search_url)
        soup = BeautifulSoup(response.content, "html.parser")

        # Extract abstracts (simplified; actual implementation may vary based on site structure)
        articles = soup.find_all("div", class_="docsum-content")
        for article in articles:
            title = article.find("a", class_="docsum-title").text.strip()
            abstract_elem = article.find("div", class_="full-view-snippet")
            abstract = (
                abstract_elem.text.strip()
                if abstract_elem
                else "No abstract available."
            )
            papers.append({"title": title, "abstract": abstract})
            papers_collected += 1
            if papers_collected >= num_papers:
                break

        page += 1
        if not articles or papers_collected >= num_papers:
            break

    return papers[:num_papers]


# research_papers = fetch_adhd_papers()

# Initialize Pinecone client
pc = Pinecone(api_key=PINECONE_API_KEY)

# Define expected index parameters
EXPECTED_DIMENSION = DIMENSION  # Your defined dimension
EXPECTED_METRIC = "cosine"
EXPECTED_SPEC = ServerlessSpec(cloud="aws", region="us-east-1")


# Check if index exists and has correct configuration
def verify_index_configuration():
    if INDEX_NAME in pc.list_indexes().names():
        # Get index description
        index_info = pc.describe_index(INDEX_NAME)

        # Check if existing index matches our requirements
        current_dimension = index_info.dimension
        current_metric = index_info.metric

        if current_dimension != EXPECTED_DIMENSION or current_metric != EXPECTED_METRIC:
            print(f"Index '{INDEX_NAME}' exists but has incompatible configuration:")
            print(
                f"Expected dimension: {EXPECTED_DIMENSION}, Found: {current_dimension}"
            )
            print(f"Expected metric: {EXPECTED_METRIC}, Found: {current_metric}")
            print("Deleting and recreating index with correct configuration...")
            pc.delete_index(INDEX_NAME)
            return False
        return True
    return False


# Create or connect to Pinecone index
if not verify_index_configuration():
    print(f"Creating new index '{INDEX_NAME}'...")
    pc.create_index(
        name=INDEX_NAME,
        dimension=EXPECTED_DIMENSION,
        metric=EXPECTED_METRIC,
        spec=EXPECTED_SPEC,
    )

index = pc.Index(INDEX_NAME)


# Embed and store papers
def store_papers_in_pinecone(papers):
    vectors = []
    for i, paper in enumerate(papers):
        text = f"{paper['title']} {paper['abstract']}"
        embedding = embedder.encode(text).tolist()
        vectors.append(
            (
                str(i),
                embedding,
                {"title": paper["title"], "abstract": paper["abstract"]},
            )
        )

    # Upsert vectors to Pinecone
    index.upsert(vectors=vectors)
    print(f"Stored {len(vectors)} papers in Pinecone.")


# store_papers_in_pinecone(research_papers)


def to_markdown(text):
    # Simple markdown conversion (replace with your actual implementation if different)
    return text.replace("\n", "<br>").replace("**", "<strong>").replace("*", "<em>")


def retrieve_relevant_documents(query, top_k=10):
    query_embedding = embedder.encode(query).tolist()
    results = index.query(vector=query_embedding, top_k=top_k, include_metadata=True)
    matches = results["matches"]
    documents = [match["metadata"]["abstract"] for match in matches]
    return "\n\n".join(documents)


def generate_response_with_context(query):
    context = retrieve_relevant_documents(query)
    # print(f"Context:\n{context}")
    prompt = f"Answer the following question based on this context:\n\nContext:\n{context}\n\nQuestion: {query}"
    response = model.generate_content(prompt)
    markdown_content = to_markdown(response.text)
    return markdown_content
