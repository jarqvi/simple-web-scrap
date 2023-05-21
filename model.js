const mongoose = require('mongoose');

// const output = [
//     {
//         title: '',
//         data: '',
//         url: '',
//         percent: '',
//         stratrgy: '',
//         price: '',
//         buyer: '',
//         seller: '',
//         volumeBuy: '',
//         volumeSell: ''

//     }
// ];

const ScrapeModel = mongoose.model('Scrape', mongoose.Schema({
    title: String,
    data: Date,
    url: String,
    stratrgy: String,
    percent: String,
    price: String,
    buyer: String,
    seller: String,
    volumeBuy: String,
    volumeSell: String,
}));

module.exports = ScrapeModel;