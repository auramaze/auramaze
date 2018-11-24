import os
import json
import glob
import argparse
from bs4 import BeautifulSoup
from tqdm import tqdm as tqdm

class WikiParser:

    def __init__(self, lang='EN'):
        self.dict = {}
        self.lang = lang

    def _parse(self, user_name, text):
        wiki_dic = {}
        soup = BeautifulSoup(text, 'html.parser')

        for section in soup.find_all('h2'):
            print(section.span.text)
        return 


        for table in soup.find_all("table"):
            table.decompose()
        text = str(soup)

        start_title = text.find("<title")
        end_start_title = text.find(">", start_title+1)
        if self.lang == 'CN':
            stop_title = text.find(" - 维基百科", end_start_title + 1)
        else:
            stop_title = text.find(" - Wikipedia", end_start_title + 1)
        title = text[end_start_title + 1 : stop_title]
        wiki_dic["title"] = title

        start_introduction = text.find("<p>")
        stop_introduction = text.find('<div id="toctitle">', start_introduction + 1)
        if '<div id="toctitle">' not in text:
            stop_introduction_1 = text.find('<div id="toc"')
            stop_introduction_2 = text.find('<h2>')
            if stop_introduction_1 == -1:
                stop_introduction = stop_introduction_2
            else:
                stop_introduction = min(stop_introduction_1, stop_introduction_2)

        introduction = text[start_introduction : stop_introduction - 1]
        soup = BeautifulSoup(introduction, 'html.parser')
        for sup in soup.find_all('sup'):
            sup.decompose()
        for link in soup.find_all('a'):
            link.unwrap()
        for img in soup.find_all('img'):
            img.decompose()
        introduction = ''.join([str(para) for para in soup.find_all('p')])

        wiki_dic["html"] = introduction

        self.dict[user_name] = wiki_dic

    def save(self, output_path):
        with open(output_path, 'w') as f:
            json.dump(self.dict, f, indent=4)

    def process(self, input_path):
        user_name = os.path.basename(input_path).split('.')[0]

        with open(input_path) as f:
            text = f.read()
        self._parse(user_name, text)


def main():
    # parser = argparse.ArgumentParser(description='wikipedia parser')
    # parser.add_argument('-in', '--input_path', action='store', required=True, type=str, help='specify input path')
    # parser.add_argument('-out', '--output_path', action='store', required=True, type=str, help='specify output json path')
    # args = parser.parse_args()

    for type in ['artist', 'museum', 'style', 'genre']:
        input_path = 'wiki-html/{}-html'.format(type)
        output_path = 'wiki-json/wiki-{}-1.json'.format(type)

        driver = WikiParser()

        for file in tqdm(glob.glob(os.path.join(input_path, '*'))):
            html_path = os.path.join(input_path, os.path.basename(file))
            driver.process(html_path)

        # driver.save(output_path)


if __name__ == '__main__':
    main()
