var express = require('express');
var router = express.Router();
const mongodb = require('../src/mongo.js');

router.get('/', (req, res) => {
    res.render('index', { 
        title: 'Data visualization on IMDb' 
    });
});

router.get('/top', (req, res) => {
    mongodb.getTVShows().then((tvshows) => {
        res.render('top', {
            tvshows: tvshows,
            title: 'TV Shows : IMDb top 50'
        });
    });
});

router.get('/api/tvshows', (req, res) => {
    mongodb.getTVShows().then((tvshows) => {
        res.json(tvshows);
    });
});

module.exports = router;
