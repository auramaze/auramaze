FROM python:3.6
COPY requirements.txt /
RUN pip install -r /requirements.txt
COPY main.py .env /
CMD ["python", "main.py"]
