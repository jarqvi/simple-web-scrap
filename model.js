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

const scrapModel = mongoose.model('scrap', mongoose.Schema({
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

module.exports = scrapModel;