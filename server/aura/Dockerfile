FROM python:3.6
COPY aura /aura
COPY setup.py .env /
RUN pip install numpy & pip install -e . & pip install gunicorn
CMD ["gunicorn", "-b", "localhost:5000", "-w", "2", "aura:app"]
