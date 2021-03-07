import requests, urllib, re, time
from bs4 import BeautifulSoup

from config import *

from selenium import webdriver
from selenium.webdriver.chrome.options import Options

class KP:
    def __init__(self, query):
        self.query = query    
        self.yoho_base = 'https://nono.games/'
    
    @property
    def _url(self):
        return 'https://www.kinopoisk.ru/index.php?%s' % urllib.parse.urlencode({ 'kp_query': self.query})

    def search(self):
        resp = requests.get(self._url)
        soup = BeautifulSoup(resp.text, 'lxml')
        elements = soup.select('.search_results .element')
        if len(elements) < 1:
            return self._parse_element(soup)
        return self._parse_elements(elements)

    def _parse_element(self, soup):        
        try:
            _id = re.search(r"www\.kinopoisk\.ru%2Ffilm%2F(\d+)", str(soup)).group(1)
        except:
            _id = ''

        # if _id != '' and requests.get('https://nono.games/film/{}/'.format(_id)).status_code == 200:
        if _id != '':
            chrome_options = Options()
            chrome_options.add_argument("--headless")
            chrome_options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36")
            driver = webdriver.Chrome(executable_path=WEBDRIVER_BINARY_PATH, options=chrome_options)
            driver.get('https://www.kinopoisk.ru/film/{}/'.format(_id))
            time.sleep(.1)
            title = driver.find_element_by_tag_name("h1").text
            driver.quit()
            return title
        return None 


    def _parse_elements(self, elements):
        parsed_elements = []
        for elm in elements:
            name_div = elm.select('.name')[0]
            types = ['film', 'series']
            _id = name_div.select('a')[0].attrs['data-id']
            _type = name_div.select('a')[0].attrs['data-type']
            if requests.get(self.yoho_base + '{}/{}/'.format(_type, _id)).status_code == 200 and _type in types:
                name = name_div.select('a')[0].text            
                
                year = ''
                try:
                    year = name_div.select('.year')[0].text
                except:
                    year = None
                title_en = elm.select('.info span')[1].text.split(', ')[0]
                parsed_elements.append({
                    "title": name,
                    "year": year,
                    "id": _id,
                    "type": _type,
                    "title_en": title_en,
                    "yoho": self.yoho_base + '{}/{}/'.format(_type, _id)
                })
        return parsed_elements



if __name__ == '__main__': 
    print(KP('matrix').search())