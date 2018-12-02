import os
import json
import glob
import argparse
from bs4 import BeautifulSoup
from tqdm import tqdm as tqdm

class WikiParser:

    def __init__(self, lang='en'):
        self.dict = {}
        self.lang = lang

    def _find_header(self, soup):
        for section in soup.find_all('h2'):
            try:
                count = self.dict.get(section.span.text, 0)
                self.dict[section.span.text] = count + 1
            except:
                continue

    def _parse(self, user_name, text):
        wiki_doc = {}
        soup = BeautifulSoup(text, 'html.parser')

        # self._find_header(soup)
        # return

        for table in soup.find_all('table'):
            table.decompose()

        title = soup.find('title').get_text()
        if self.lang == 'zh':
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

        self.dict[user_name] = wiki_doc

    def save_count(self, output_path):
        r_list = sorted(((v,k) for k,v in self.dict.items()), reverse=True)
        with open(output_path, 'w', encoding='utf8') as f:
            json.dump(r_list, f, indent=4, ensure_ascii=False)

    def save(self, output_path):
        with open(output_path, 'w', encoding='utf8') as f:
            json.dump(self.dict, f, indent=4, ensure_ascii=False)

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
        # en version
        input_path = 'wiki-html/{}-html'.format(type)
        output_path = 'wiki-json/wiki-{}-en.json'.format(type)

        driver = WikiParser()

        for file in tqdm(glob.glob(os.path.join(input_path, '*'))):
            html_path = os.path.join(input_path, os.path.basename(file))
            driver.process(html_path)

        driver.save(output_path)
        # zh version
        input_path = 'wiki-html/{}-html-zh'.format(type)
        output_path = 'wiki-json/wiki-{}-zh.json'.format(type)

        driver = WikiParser('zh')

        for file in tqdm(glob.glob(os.path.join(input_path, '*'))):
            html_path = os.path.join(input_path, os.path.basename(file))
            driver.process(html_path)

        driver.save(output_path)


if __name__ == '__main__':
    main()
