const mongodb = require('mongodb');
const config = require('./config/mongo.json');

let url = 'mongodb://localhost:27017/imdb';
let MongoClient = mongodb.MongoClient;

const obj = {
    init() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    reject(err);
                }
                this.instance = db;
                resolve(db);
            });
        });
    },
    getTVShows() {
        return new Promise((resolve, reject) => {
            const collection = this.instance.collection('tvshows');
            collection.find({}).toArray((err, tvshows) => {
                if (err) {
                    reject(err);
                }
                resolve(tvshows);
            });
        });
    }
}

module.exports = obj;
