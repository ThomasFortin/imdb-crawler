# -*- coding: utf-8 -*-

import scrapy
import re
from crawler.items import TVShowItem

class imdbtvshowsSpider(scrapy.Spider):
    name = "imdbtvshows"
    allowed_domains = ["imdb.com"]
    start_urls = [
        "http://www.imdb.com/chart/toptv"
    ]

    def parse(self, response):
        # On ne prend pas les 250 mais on s'arrête aux 100 meilleures séries (ce qui est déjà long)
        self.max = 50
        for selection in response.xpath("//*[contains(@class, 'chart')]/tbody/tr"):
            item = TVShowItem()
            item['Title'] = selection.xpath('td[2]/a/text()').extract()[0]
            # On ne souhaite qu'une partie de ce qui se trouve à cet endroit atteint avec xPath, puis on convertit le résultat en string et on supprime les espaces/sauts de lignes indésirables
            item['Ranking'] = re.match(r'(^[0-9]+)',selection.xpath('td[2]/text()').extract()[0].__str__().strip()).group(1)
            item['Rating'] = selection.xpath('td[3]/strong/text()').extract()[0]
            item['ReleaseDate'] = selection.xpath('td[2]/span[1]/text()').re(r'\d+')[0]
            item['PageUrl'] = 'http://www.imdb.com' + selection.xpath('td[2]/a/@href').extract()[0]

            request = scrapy.Request(item['PageUrl'], callback=self.parseTVShowDetails)
            request.meta['item'] = item
            # On vérifie qu'on n'a pas atteint le nombre max de séries attendu
            if(int(item['Ranking']) >= self.max + 1):
                return

            yield request


    # Fonction pour parser tous les détails d'une série
    def parseTVShowDetails(self, response):
        # Les détails d'une série sont constitués des infos basiques, techniques et du casting, donc en envoie vers ces fonctions une par une
        item = response.meta['item']
        item = self.getBasicInfo(item, response)

        return item


    # Fonction pour obtenir les informations "basiques" d'une série
    def getBasicInfo(self, item, response):
        item['NbVotes'] = response.xpath("//*[@id='title-overview-widget']/div[2]/div[2]/div/div[1]/div[1]/a/span/text()").extract()
        item['Creators'] = response.xpath("//div/span[@itemprop='creator']/a/span/text()").extract()
        # On ne souhaite pas tout ce qui se trouve dans le p, mais seulement la partie Synopsis même (sans le em à la fin dans certains cas). Puis on strip pour enlever le \n du début et les espaces à la fin
        item['Synopsis'] = response.xpath("//div[@itemprop='description']/p/text()").extract()[0].strip()
        item['Genres'] = response.xpath("//div[@itemprop='genre']/a/text()").extract()

        return item

    # Fonction pour vérifier que ce n'est pas vide
    def ifNotEmptyGetIndex(self, item, index = 0):
        if item:
            return item[index]
        else:
            return item
