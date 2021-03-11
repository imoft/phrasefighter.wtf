FROM python:3.7.3-slim-stretch
RUN apt-get -y update && apt-get -y install --reinstall build-essential

WORKDIR /

COPY firebase.json /
COPY requirements.txt /
COPY ./data/ /data

COPY app.py /
# Make changes to the requirements/app here.
# This Dockerfile order allows Docker to cache the checkpoint layer
# and improve build times if making changes.
RUN pip3 install --no-cache-dir -r requirements.txt
RUN pip3 install nltk && \
    mkdir ~/nltk_data && \
    mkdir ~/nltk_data/chunkers && \
    mkdir ~/nltk_data/corpora && \
    mkdir ~/nltk_data/taggers && \
    mkdir ~/nltk_data/tokenizers && \
    python3 -c "import nltk; nltk.download(['punkt', 'averaged_perceptron_tagger', 'stopwords'])"


# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


ENV PORT 8080
EXPOSE 8080
ENTRYPOINT ["python3", "-X", "utf8", "app.py"]