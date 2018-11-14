FROM python:3.6
COPY aura /aura
COPY setup.py .env /
WORKDIR /
RUN pip install numpy & pip install gunicorn & pip install -e .
CMD ["gunicorn", "-b", "localhost:5000", "-w", "2", "aura:app"]
