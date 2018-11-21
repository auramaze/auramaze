import json
import requests

from bs4 import BeautifulSoup

def get_zh_url(en_url):
    r = requests.get(en_url)
    html_doc = r.text

    soup = BeautifulSoup(html_doc, 'html.parser')
    zh_link = soup.find(attrs={"lang": "zh", "class": "interlanguage-link-target"})
    if zh_link:
        zh_url = zh_link['href']
        if requests.get(zh_url).status_code == 200:
            return zh_url
    return None

if __name__ == '__main__':
    print(get_zh_url('https://en.wikipedia.org/wiki/Vincent_van_Gogh'))
