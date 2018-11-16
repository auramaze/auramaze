FROM python:3.6
COPY requirements.txt .env /
RUN pip install numpy & pip install gunicorn & pip install -r requirements.txt
COPY aura /aura
CMD ["gunicorn", "-b", "0.0.0.0:5000", "-w", "2", "aura:app"]
