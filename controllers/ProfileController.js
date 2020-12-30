const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.post('/profile', (req, res) => {
    const userAuth = req.body.username;

    (async () => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        try {
            
            await page.goto('https://www.instagram.com/' + userAuth);

            const userName = await page.$eval('._7UhW9', e => e.innerText);

            if (userAuth == userName) {
                const isPrivate = await page.$('.rkEop');
                
                if(isPrivate == null) {
                    const profileElement = await page.$eval('._6q-tv', e => e.getAttribute('src'));
                    const postsElement = await page.$eval('.ySN3v', e => e.innerHTML);

                    res.render('pages/profile', { userName, profileElement, postsElement });
                    res.statusCode = 200;
                } else {
                    res.redirect('/?isPrivate=true');
                }
            } else {
                res.redirect('/?userNotFound=true');
            }

            await browser.close();

        } catch (err) {
            await browser.close();
            res.send('Browser error');
            res.statusCode(404);
        }
    })();
})

module.exports = router