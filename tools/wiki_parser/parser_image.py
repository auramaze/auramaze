import os
import json
import glob
import argparse
import requests
from bs4 import BeautifulSoup
from tqdm import tqdm as tqdm

URL = 'https://en.wikipedia.org'

class WikiImageParser:

    def __init__(self):
        self.dict = {}

    def _parse(self, user_name, text):
        link = None
        soup = BeautifulSoup(text, 'html.parser')
        for img in soup.find_all('img'):
            href = img.parent.get('href')
            if href is not None and href.startswith('/wiki/File') and not href.endswith('svg'):
                link = href
                break
        if link is None:
            link = ''
        self.dict[user_name] = link

    def download(self, user_name, link, folder):
        try:
            url = URL + link
            html = requests.get(url).text
            soup = BeautifulSoup(html, 'html.parser')
            div = soup.find('div', class_='fullImageLink')
            if div is not None:
                img_url = 'https:' + div.a.get('href')
                img = requests.get(img_url)
                suffix = img_url.split('.')[-1]
                file_name = user_name + '.' + suffix
                with open(os.path.join(folder, file_name), 'wb') as f:
                    f.write(img.content)
        except AttributeError:
            return

    def save(self, output_path):
        with open(output_path, 'w') as f:
            json.dump(self.dict, f, indent=4)

    def process(self, input_path):
        user_name = os.path.basename(input_path).split('.')[0]

        with open(input_path, encoding='utf-8') as f:
            text = f.read()
        self._parse(user_name, text)


def run(input_path, output_path):
    driver = WikiImageParser()

    for file in tqdm(glob.glob(os.path.join(input_path, '*'))):
        input = os.path.join(input_path, os.path.basename(file))
        driver.process(input)

    driver.save(output_path)


def main():
    parser = argparse.ArgumentParser(description='wikipedia parser')
    parser.add_argument('-in', '--input_path', action='store', required=True, type=str, help='specify input path')
    parser.add_argument('-out', '--output_path', action='store', required=True, type=str, help='specify output json path')
    args = parser.parse_args()

    run(args.input_path, args.output_path)


if __name__ == '__main__':
    driver = WikiImageParser()
    with open('test.json') as f:
        dic = json.load(f)
    for user_name, link in tqdm(sorted(dic.items())):
        driver.download(user_name, link, 'img')

