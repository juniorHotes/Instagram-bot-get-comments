const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

// Read page
async function start() {

    // View more comments
    async function loadMore(page, selector) {
        const moreButton = await page.$(selector)
        if (moreButton) {
            console.log('More')
            await moreButton.click()
            await page.waitForSelector(selector, { timeout: 3000 }).catch(() => { console.log("timeout") })
            await loadMore(page, selector)
        }
    }

    // Get comments
    async function getComments(page, selector) {
        const comments = await page.$$eval(selector, links => links.map(link => link.innerText))
        return comments
    }

    // Open page and get url
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.goto('https://www.instagram.com/p/CChMVvQgYKK/')

    await loadMore(page, '.dCJp8')
    const comments = await getComments(page, '.C4VMK span a')
    const counted = count(comments)
    const sorted = sort(counted)
    sorted.forEach(arroba => { console.log(arroba) }) 
    
    await browser.close()
}

// count repeated comments
function count(arrobas) {
    const count = {}
    arrobas.forEach(arroba => { count[arroba] = (count[arroba] || 0) + 1 })
    return count
}

// order
function sort(counted) {
    const entries = Object.entries(counted)
    const sorted = entries.sort((a, b) => b[1] - a[1])
    return sorted
}

router.post('/pesquisa', (req, res) => {
    console.log('Esta na pesquisa')
    start()
})
