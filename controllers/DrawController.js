const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/:param1/:param2', (req, res) => {
    const param1 = req.params.param1;
    const param2 = req.params.param2;

    console.log(param1 +'/'+ param2);

    const link = 'https://www.instagram.com/' + param1 +'/'+ param2;

    (async () => {

        async function loadMore(page, selector) {
            const moreButton = await page.$(selector)
            if (moreButton) {
                console.log('More')
                await moreButton.click()
                await page.waitForSelector(selector, { timeout: 3000 }).catch(() => { console.log("timeout") })
                await loadMore(page, selector)
            }
        }

        async function getComments(page, selector) {
            const comments = await page.$$eval(selector, links => links.map(link => link.innerText))
            return comments
        }
    
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        await page.goto(link)

        await loadMore(page, '.dCJp8')
        const comments = await getComments(page, '.C4VMK span a')
        comments.forEach(arroba => { console.log(arroba) }) 
        res.render('pages/draw', { comments })
    
        await browser.close()
    })();
})

module.exports = router
