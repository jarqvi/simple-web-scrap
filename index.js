const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const scrapModel = require('./model');
const schedule = require('node-schedule');
const objToCsv = require('objects-to-csv');
const path = require('path');

async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/scrap-db')
        console.log('Connected to DB.');
    } catch (err) {
        console.error(err);
    }
}
function toEnglish(persianNumber) {
    const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g, /،/g, /٬/g];
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '', '.'];
    let englishNumber = persianNumber;
    for (let i = 0; i < persianDigits.length; i++) {
      englishNumber = englishNumber.replace(persianDigits[i], englishDigits[i]);
    }
    return englishNumber;
}
async function scrap(page) {
    try {
        await page.goto('https://rahavard365.com/stock');
        const html = await page.content();
        const $ = cheerio.load(html);
        const list = $('table > tbody > tr').map((i, e) => {
            const titleElement = $(e).find('.symbol');
            const title = $(titleElement).text();
            const url = 'https://rahavard365.com' + $(titleElement).attr('href');
            const dateElement = $(e).find('[data-type="date-time-data"]');
            const date = $(dateElement).attr('data-order');
            const percentElement = $(e).find('[data-type="real-close-price-change-percent-data"]');
            const percent = $(percentElement).attr('data-order');
            const priceElement = $(e).find('[data-type="real-close-price-data"]');
            const price = $(priceElement).attr('data-order');
            return {title, url, date, percent, price};
        }).get();
        return list;
    } catch (err) {
        console.error(err);
    }
}
async function sleep(time) {
    try {
        return new Promise(resolve => setTimeout(resolve, time));
    } catch (err) {
        console.error(err);
    }
}
async function scrapOtherItem(page, scrapList) {
    try {
        let result = [];
        for (let i = 0; i < scrapList.length; i++) {
            await page.goto(scrapList[i].url);
            const html = await page.content();
            const $ = cheerio.load(html);
            const stratrgy = $('#main-gauge-text').text();  
            const buyer = toEnglish($('.personbuyercount').text());
            const seller = toEnglish($('.personsellercount').text());
            const volumeBuy = toEnglish($('.personbuyvolume').attr('title')); 
            const volumeSell = toEnglish($('.personsellvolume').attr('title'));
            scrapList[i].stratrgy = stratrgy;
            scrapList[i].buyer = buyer;
            scrapList[i].seller = seller;
            scrapList[i].volumeBuy = volumeBuy;
            scrapList[i].volumeSell = volumeSell;
            result.push(scrapList[i]);
            sleep(1500);
        }
        console.log('scrap finished.');
        return result;
    } catch (err) {
        console.error(err);
    }
}
async function CreateCsvFile(data) {
    try {
        let csv = new objToCsv(data);
        await csv.toDisk(path.join(__dirname, 'scrap.csv'));
    } catch (err) {
        console.error(err);
    }
}
async function main() {
    try {
        await connectDB();
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const scrapList = await scrap(page);
        const scrapListWithOtheItem = await scrapOtherItem(page, scrapList);
        await CreateCsvFile(scrapListWithOtheItem);
        await scrapModel.insertMany(scrapListWithOtheItem);
    } catch (err) {
        console.error(err);
    }
}
function scheduler() {
    const job = schedule.scheduleJob('0 12 * * *', () => {
        main();
    });
}
scheduler();