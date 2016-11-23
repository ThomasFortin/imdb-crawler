# -*- coding: utf-8 -*-

from scrapy import Item, Field


class TVShowItem(Item):
    # General
    title = Field()
    ranking = Field()
    rating = Field()
    nbVotes = Field()
    releaseDate = Field()
    pageUrl = Field()

    # Extra
    creators = Field()  # Au pluriel, il peut y en avoir plusieurs
    synopsis = Field()
    genres = Field()    # Au pluriel, il peut y en avoir plusieurs

