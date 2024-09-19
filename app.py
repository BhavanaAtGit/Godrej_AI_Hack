from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import requests
from bs4 import BeautifulSoup
from duckduckgo_search import DDGS

app = Flask(__name__)
CORS(app)

# Configure the GenAI API
genai.configure(api_key="AIzaSyB3CZvOuKPCvz9g0sLt9QTGXVCB4guzN20")  # Replace with your actual API key

def get_gemini_response(question, prompt):
    model = genai.GenerativeModel('gemini-pro')
    response = model.generate_content([prompt, question])
    return response.text

def refine_query_with_gemini(question):
    prompt = f"""
    Based on the following question: "{question}",
    generate three different but related questions that can help gather comprehensive information on the topic.
    """
    refined_questions_response = get_gemini_response(question, prompt)
    refined_questions = refined_questions_response.split("\n")
    return [q for q in refined_questions if q][:3]

def perform_duckduckgo_search(query, num_results=5):
    with DDGS() as ddgs:
        results = list(ddgs.text(query, max_results=num_results))
    return [result['href'] for result in results]

def scrape_content(url):
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        paragraphs = soup.find_all('p')
        content = ' '.join([para.get_text() for para in paragraphs])
        return content[:1000]  # Limit content to first 1000 characters
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return ""

def generate_answer_with_sources(query, scraped_contents, urls):
    prompt = f"""
    Based on the following information from various web sources, provide a comprehensive answer to the query: "{query}"
    
    Include relevant facts and insights from the provided content.

    Web content:
    {scraped_contents}

    Instructions:
    1. Provide a detailed answer to the query.
    2. Use information from the given web content.
    3. Format the response in Markdown.
    4. Do not include a sources list in your response.
    """
    answer = get_gemini_response(query, prompt)
    
    return answer, urls

@app.route('/api/search', methods=['POST'])
def search_api():
    data = request.get_json()
    query = data.get('query', '')

    if not query:
        return jsonify({'error': 'No query provided'}), 400

    try:
        refined_questions = refine_query_with_gemini(query)
        all_scraped_contents = []
        all_urls = []
        
        for refined_query in refined_questions:
            urls = perform_duckduckgo_search(refined_query, num_results=5)
            all_urls.extend(urls)
            
            for url in urls:
                content = scrape_content(url)
                all_scraped_contents.append(content)
        
        combined_content = " ".join(all_scraped_contents)
        answer, sources = generate_answer_with_sources(query, combined_content, all_urls)
        
        return jsonify({'answer': answer, 'sources': sources})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/trending', methods=['POST'])
def trending_topics():
    data = request.get_json()
    interests = data.get('interests', [])

    if not interests:
        return jsonify({'error': 'No interests provided'}), 400

    try:
        trending_topics = []
        
        for interest in interests:
            refined_questions = refine_query_with_gemini(interest)
            count = 0  # Counter to limit the number of topics per interest

            for refined_query in refined_questions:
                if count >= 2:
                    break  # Stop if we already have 2 topics for this interest
                
                urls = perform_duckduckgo_search(refined_query, num_results=3)
                for url in urls:
                    if count >= 2:
                        break  # Stop if we already have 2 topics for this interest
                    
                    content = scrape_content(url)
                    if content:
                        summarized_content = summarize_content_with_gemini(content)
                        trending_topics.append({
                            'interest': interest,
                            'url': url,
                            'content': summarized_content
                        })
                        count += 1  # Increment the counter

        return jsonify({'trending_topics': trending_topics})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def summarize_content_with_gemini(content):
    prompt = f"""
    Summarize the following content, focusing on the main points and excluding any advertisements or irrelevant information:

    {content}
    """
    summary_response = get_gemini_response("Summarize this content", prompt)
    return summary_response.strip()  # Return the summarized content

if __name__ == '__main__':
    app.run(debug=True)