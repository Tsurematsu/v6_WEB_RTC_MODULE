import puppeteer from 'puppeteer';
export default async function testBrowser(url, callback=()=>{}){
  const browser = await puppeteer.launch({args: ['--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--no-sandbox']});
  
  const newPage = async (index) => {
    const page = await browser.newPage();
    page.on('console', callback);
    await page.goto(url, {waitUntil: 'networkidle0'});
    return page;
  }
  
  return newPage;
}
