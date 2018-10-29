FROM python:3.6
COPY requirements.txt /
RUN pip install -r /requirements.txt
COPY elasticsearch.py .env /
CMD ["python", "elasticsearch.py"]
