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

    def _find_header(soup):
        for section in soup.find_all('h2'):
            try:
                count = self.dict.get(section.span.text, 0)
                self.dict[section.span.text] = count + 1
            except:
                continue

    def _parse(self, user_name, text):
        wiki_doc = {}
        soup = BeautifulSoup(text, 'html.parser')

        for table in soup.find_all('table'):
            table.decompose()

        title = soup.find('title').get_text()
        if self.lang == 'CN':
            stop_title = title.find(' - 维基百科')
        else:
            stop_title = title.find(' - Wikipedia')
        wiki_doc['title'] = title[:stop_title]

        wiki_doc['html'] = []

        text = str(soup)
        list = text.split('<h2>')
        for i in range(len(list)):
            if i != 0:
                segment = '<h2>' + list[i]
            else:
                header = 'DEFAULT'
                segment = list[i]

            para_soup = BeautifulSoup(segment, 'html.parser')
            if i != 0:
                try:
                    header = para_soup.find('h2').find('span', class_='mw-headline').get_text()
                except:
                    continue
            for sup in para_soup.find_all('sup'):
                sup.decompose()
            for link in para_soup.find_all('a'):
                link.unwrap()
            for img in para_soup.find_all('img'):
                img.decompose()
            content = ''.join([str(para) for para in para_soup.find_all('p')])

            if content != '':
                wiki_doc['html'].append({'header': header, 'content': content})

        # start_introduction = text.find("<p>")
        # stop_introduction = text.find('<div id="toctitle">', start_introduction + 1)
        # if '<div id="toctitle">' not in text:
        #     stop_introduction_1 = text.find('<div id="toc"')
        #     stop_introduction_2 = text.find('<h2>')
        #     if stop_introduction_1 == -1:
        #         stop_introduction = stop_introduction_2
        #     else:
        #         stop_introduction = min(stop_introduction_1, stop_introduction_2)
        #
        # introduction = text[start_introduction : stop_introduction - 1]
        # soup = BeautifulSoup(introduction, 'html.parser')
        # for sup in soup.find_all('sup'):
        #     sup.decompose()
        # for link in soup.find_all('a'):
        #     link.unwrap()
        # for img in soup.find_all('img'):
        #     img.decompose()
        # introduction = ''.join([str(para) for para in soup.find_all('p')])
        #
        # wiki_doc["html"] = introduction

        self.dict[user_name] = wiki_doc

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

        driver.save(output_path)


if __name__ == '__main__':
    main()
