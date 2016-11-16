# -*- coding: utf-8 -*-

from scrapy import Item, Field


class TVShowItem(Item):
    # General
    Title = Field()
    Ranking = Field()
    Rating = Field()
    NbVotes = Field()
    ReleaseDate = Field()
    PageUrl = Field()

    # Extra
    Creators = Field()  # Au pluriel, il peut y en avoir plusieurs
    Synopsis = Field()
    Genres = Field()    # Au pluriel, il peut y en avoir plusieurs

