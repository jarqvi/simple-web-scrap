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
    await page.goto('https://rahavard365.com/stock');
    const html = await page.content();
    const $ = cheerio.load(html);
    const list = $('table > tbody > tr').map((i, e) => {
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
    return list;
}
async function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
async function scrapOtherItem(page, scrapeList) {
    for (let i = 0; i < scrapeList.length; i++) {
        await page.goto(scrapeList[i].url);
        const html = await page.content();
        const $ = cheerio.load(html);
        const stratrgy = $('#main-gauge-text').text();  
        const buyer = toEnglish($('.personbuyercount').text());
        const seller = toEnglish($('.personsellercount').text());
        const volumeBuy = toEnglish($('.personbuyvolume').attr('title')); 
        const volumeSell = toEnglish($('.personsellvolume').attr('title'));
        scrapeList[i].stratrgy = stratrgy;
        scrapeList[i].buyer = buyer;
        scrapeList[i].seller = seller;
        scrapeList[i].volumeBuy = volumeBuy;
        scrapeList[i].volumeSell = volumeSell;
        console.log(scrapeList[i]);
        sleep(1500);
    }
}
async function main() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const scrapeList = await scrap(page);
    const scrapeListWithOtheItem = await scrapOtherItem(page, scrapeList);
    console.log(scrapeList);
}
main();