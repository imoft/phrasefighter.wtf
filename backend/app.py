from starlette.applications import Starlette
from starlette.responses import UJSONResponse
import uvicorn
import os
import gc
import os
import gc
import scipy
import nltk
import re
import requests as rq
from bs4 import BeautifulSoup
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
from nltk.corpus import stopwords
nltk.download('stopwords')
stopset = set(stopwords.words('english'))
from nltk.tokenize import RegexpTokenizer
tokenizer = RegexpTokenizer(r'\w+')
import spacy 
import en_core_web_md
nlp = en_core_web_md.load()
import random
import json
import string



app = Starlette(debug=False)


# Needed to avoid cross-domain issues
response_header = {
    'Access-Control-Allow-Origin': '*'
}

generate_count = 0


# ==--=-=-=-=-==-=-=--=-==-=--==-=--=-=-==--==-=-=--==-==-=-=-=-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--==-=-=--=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
# WEB_SCRAPER


def getTextFromURL(url, input):
    res = rq.get(url)
    html_page = res.content
    soup = BeautifulSoup(html_page, 'html.parser')
    text = soup.find_all(text=True)
    output = ''
    statements = []
    soup.findAll(attrs={"name":"description"})
    

    


    blacklist = [
        '[document]',
        '[endif]'
        '[if]'
        'noscript',
        'header',
        'html',
        'meta',
        'head', 
        'input',
        'script',
        'div',
        'style',
        
        # there may be more elements you don't want, such as "style", etc.
    ]

    for t in text:
        if t.parent.name not in blacklist:
            output += t

    sentence_list = nltk.sent_tokenize(output)

    cleaned_sentences = []


    for sentence in sentence_list:
        if len(sentence) < 200 and len(sentence) > 50:
            clean_text = re.sub(r'\[[0-9]*\]', ' ', sentence)
            clean_text = re.sub(r'\s+', ' ', clean_text)
            clean_text = re.sub(r'^https?:\/\/.*[\r\n]*', '', clean_text, flags=re.MULTILINE)

            cleaned_sentences.append(clean_text)


    #print(len(cleaned_sentences), "sentences found")

    queries = [input]
    query_embedding = nlp(input)
    number_top_matches =  5
    distances = []
    for sentence in cleaned_sentences:
        sentence_embedding = nlp(sentence)
        distance = query_embedding.similarity(sentence_embedding)
        distances.append({'distance':distance, 'sentence':sentence})

    results = sorted(distances, key=lambda x: x['distance'], reverse=True)
    topvalues = results[0:5]
    return topvalues




@app.route('/', methods=['GET', 'POST', 'HEAD'])
async def homepage(request):


    if request.method == 'GET':
        params = request.query_params
    elif request.method == 'POST':
        params = await request.json()
    elif request.method == 'HEAD':
        return UJSONResponse({'text': ''},
                             headers=response_header)

    query = params.get('query', 'I love playing games on the internet.' )
    url = params.get('url', 'https://en.wikipedia.org/wiki/Happiness' )

    topvalues = getTextFromURL(url, query)
    print(topvalues)


    
    return UJSONResponse({'values': topvalues},
                         headers=response_header)

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))