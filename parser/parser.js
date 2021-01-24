import puppeteer from 'puppeteer';

class Parser {
  /**
   * @param {string} url url of the page that'll be parsed
   * @param {string} waitForSelector selector that has to be loaded until parsing will start
   * @param {function} parse function that will parse data
   */
  constructor(url, waitForSelector, parse) {
    this.url = url;
    this.waitForSelector = waitForSelector;
    this.parse = parse;
  }
}

/**
 * @param {Array<Parser>} parsers
 */
async function getData(parsers) {
  if (!parsers.length) return [];

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  let data = [];
  for (const parser of parsers) {
    await page.goto(parser.url);
    await page.waitForSelector(parser.waitForSelector);

    data = data.concat(await page.evaluate(parser.parse));
  };

  browser.close();

  return data;
}

const zakazParse = () => {
  let items = Array.from(document.querySelectorAll('.product-tile'));

  return items.map($el => {
    let weight = $el.querySelector('.product-tile__weight').innerText.trim()
    weight = weight.replace('за', '');
    const unit = weight.replaceAll(/[ 0-9]/g, '');
    weight = parseFloat(weight);

    if (unit.toLowerCase() === 'г') weight *= 1e-3;

    return {
      name: $el.querySelector('.product-tile__title').innerText,
      price: +(parseFloat($el.querySelector('.Price__value_caption').innerText) / weight).toFixed(2),
      url: $el.href,
      imageUrl: $el.querySelector('.product-tile__image-i').src,
    }
  })
}

// Function that'll parse buckwheat
const getDataAboutBuckwheat = getData.bind(null, [
  new Parser(
    'https://auchan.ua/ua/catalogsearch/result/?q=%D0%B3%D1%80%D0%B5%D1%87%D0%B0%D0%BD%D0%B0%20%D0%BA%D1%80%D1%83%D0%BF%D0%B0',
    'div[class^="item_root"]',

    () => {
      let items = Array.from(document.querySelectorAll('div[class^="item_root"]'));
      items = items.filter(item => item.querySelector('.stock'));

      return items.map($el => {
        const $name = $el.querySelector('[class^="item_data__name"]');
        let [name, weight] = $name.innerText.trim().split(',');
        const unit = weight.replaceAll(/[ 0-9]/g, '');
        weight = parseFloat(weight);

        if (unit.toLowerCase() === 'г') weight *= 1e-3;

        return {
          name,
          price: +(parseFloat($el.querySelector('[class^="item_price"]').innerText.replace(',', '.')) / weight).toFixed(2),
          url: $name.href,
          imageUrl: $el.querySelector('[class^="item_image"] img').src,
        }
      });
    }
  ),

  new Parser(
    'https://auchan.zakaz.ua/ru/categories/buckwheat-auchan/',
    '.product-tile',
    zakazParse,
  ),

  new Parser(
    'https://fozzyshop.ua/ru/300143-krupa-grechnevaya',
    '.js-product-miniature-wrapper',

    () => {
      let items = Array.from(document.querySelectorAll('.js-product-miniature-wrapper'));
      items = items.filter(item => !item.classList.contains('product_grey'));

      return items.map($el => {
        const $name = $el.querySelector('.product-title > a');

        let weight = $el.querySelector('.product-reference').innerText.trim();
        weight = weight.replace('Фасовка:', '').replace(',', '.').trim();
        const unit = weight.replaceAll(/[ *0-9]/g, '');

        if (weight.includes('*')) {
          weight = weight.split('*').map(parseFloat).reduce((res, current) => res * current, 1);
        } else {
          weight = parseFloat(weight);
        }

        if (unit.toLowerCase() === 'г') weight *= 1e-3;

        return {
          name: $name.innerText.trim(),
          price: +(parseFloat($el.querySelector('.product-price').innerText.replace(',', '.')) / weight).toFixed(2),
          url: $name.href,
          imageUrl: $el.querySelector('.product-thumbnail-first').src,
        }
      });
    }
  ),

  new Parser(
    'https://metro.zakaz.ua/ru/categories/buckwheat-metro/',
    '.product-tile',
    zakazParse,
  )
]);

export { getDataAboutBuckwheat };
