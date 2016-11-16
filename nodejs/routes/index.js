var express = require('express');
var router = express.Router();
const mongodb = require('../src/mongo.js');

/* GET home page. */
router.get('/', (req, res) => {
    mongodb.getTVShows().then((tvshows) => {
        res.render('index', {
            tvshows: tvshows,
            title: 'TV Shows : Top 50'
        });
        console.log(tvshows);
    });
});

module.exports = router;
