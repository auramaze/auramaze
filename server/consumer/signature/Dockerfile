FROM python:3.6
COPY requirements.txt /
RUN pip install numpy && pip install -r /requirements.txt
COPY signature.py elasticsearch_driver.py .env /
CMD ["python", "signature.py"]
