const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

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

(async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://rahavard365.com/stock');
    const html = await page.content();
    const $ = cheerio.load(html);
    const result = $('table > tbody > tr').map((i, e) => {
        const titleElement = $(e).find('.symbol');
        const title = $(titleElement).text();
        const url = 'https://rahavard365.com' + $(titleElement).attr('href');
        const dateElement = $(e).find('[data-type="date-time-data"]');
        const date = new Date($(dateElement).attr('data-order'));
        const percentElement = $(e).find('[data-type="real-close-price-change-percent-data"]');
        const percent = $(percentElement).attr('data-order');
        const priceElement = $(e).find('[data-type="real-close-price-data"]');
        const price = $(priceElement).attr('data-order');
        return {title, url, date, percent, price};
    }).get();
    console.log(result);
    console.log(result);
}())