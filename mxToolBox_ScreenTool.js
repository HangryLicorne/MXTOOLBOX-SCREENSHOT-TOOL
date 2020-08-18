const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true, frame: false, useContentSize: true, height: 1250, width: 1500 });
const nightmare2 = Nightmare({ show: true, frame: false, useContentSize: true, height: 1250, width: 1500 });


const screenshotSelector = require('nightmare-screenshot-selector');

const prompt = require('prompt-sync')();

Nightmare.action('screenshotSelector', screenshotSelector)

captureDnsMxToolBox = async (host, pathStockScreenDns) => {       
    let result = await nightmare
        .useragent("Mozilla/72.0.2 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36")                
        .goto('https://mxtoolbox.com/domain/' + host)

        .wait(function () { const a = document.querySelector('#spanTestsRemaining'); return (a.innerHTML === 'Complete') })
        .click('div.col-xs-4:nth-child(6) > a:nth-child(1)')

        .evaluate(() => {            
            document.querySelector('#aspnetForm > div:nth-child(8) > footer').remove();
            const captureElement = document.querySelector('#actionResults2 > table:nth-child(2)');
            const captureRect = captureElement.getBoundingClientRect();

            const captureElement1 = document.querySelector('#actionResults2 > table:nth-child(4)');
            const captureRect1 = captureElement1.getBoundingClientRect();

            const captureElement2 = document.querySelector('#actionResults2 > div.well:nth-child(5)');
            const captureRect2 = captureElement2.getBoundingClientRect();

            return {                        
                top: captureRect.top,
                left: captureRect.left,
                top1: captureRect1.top,
                left1: captureRect1.left,
                top2: captureRect2.top,
                left2: captureRect2.left                        
            }
        })
        .then(function(position){
            return nightmare                        
                .scrollTo(position.top, position.left)
                .screenshotSelector({ selector: '#actionResults2 > table:nth-child(2)', path: pathStockScreenDns + 'table1' + '.png' })
                .wait(1000)
                .scrollTo(position.top1, position.left1)
                .screenshotSelector({ selector: '#actionResults2 > table:nth-child(4)', path: pathStockScreenDns + 'table2' + '.png' })
                .wait(1000)
                .scrollTo(position.top2, position.left2)
                .screenshotSelector({ selector: '#actionResults2 > div.well:nth-child(5)', path: pathStockScreenDns + 'table3' + '.png' })
                .wait(1000)
        })                                                                                     
        .then(function () {
            nightmare.end(function () {
                console.log('done');                
            });
        })        
}

captureSmtpMxToolBox = async (host, pathStockScreenSmtp, pathStockScreenshotDns) => {
    pathStockScreenshotDns = pathStockScreenshotDns || 'Default';

    if (Number(screenshotTestType) == 3) {
        console.log("calling captureDnsMxToolBox")
        await captureDnsMxToolBox(domainName, pathStockScreenshotDns);
    }            
    nightmare2    
        .useragent("Mozilla/72.0.2 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36")
        .goto('https://mxtoolbox.com/domain/' + host)

        .wait(function () { const a = document.querySelector('#spanTestsRemaining'); return (a.innerHTML === 'Complete') })
        
        
        .click('div.col-xs-4:nth-child(4) > a:nth-child(1)')
        
        .evaluate(() => {
            document.querySelector('#aspnetForm > div:nth-child(8) > footer').remove()

            const selectorElement = [];
            const smtpResults = document.querySelector('#smtpResults');
            const smtpResultsChildNodes = smtpResults.childNodes;

            for (var j = 0; j < smtpResultsChildNodes.length; j++) {

                for (var k = 0; k < smtpResultsChildNodes[j].children.length; k++) {

                    const typeOfSmtpElement = smtpResultsChildNodes[j].children[k].localName;

                    initialPosition = k;                    

                    if (typeOfSmtpElement == "table") {

                        k = k + 1;
                        selectorElement.push("#" + smtpResultsChildNodes[j].id + " > table:nth-child(" + k.toString() + ")");
                    }                                        
                    
                    if (typeOfSmtpElement == "div") {
                        k = k + 1;
                        selectorElement.push("#" + smtpResultsChildNodes[j].id + " > div:nth-child(" + k.toString() + ")");
                    }

                    k = initialPosition;
                }
            }

            return {
                smtp: selectorElement,
            };
        })
        .then(function (selector) {

            const selectorSmtpElements = selector.smtp;  
            console.log(selectorSmtpElements);

            var i = 0;    
            function take_screenshot(selectorSmtpElements) {
                console.log ("loop iteration number :"+ selectorSmtpElements[i]);
                var selectorElementSmtp = selectorSmtpElements[i];                
                
                nightmare2                    
                    .evaluate((selectorElementSmtp) => {
                        return new Promise(function(resolve) {
                            setTimeout(() => {
                                const captureElement = document.querySelector(selectorElementSmtp); // Find the HTML element to be captured in the DOM.
                                captureElement.scrollIntoView();                                                            
                                resolve();
                            }, 3000)
                        });                        
                    }, selectorElementSmtp)    
                    .then(function(){
                        nightmare2
                            .screenshotSelector({ selector: selectorElementSmtp, path: pathStockScreenSmtp + i.toString() + '.png'})                            
                            .wait(3000)
                        i++;
                        if (i < selectorSmtpElements.length)
                        {
                            take_screenshot(selectorSmtpElements);
                        }
                    })                                                                                                               
            }
            take_screenshot(selectorSmtpElements);
        })
}

const domainName = prompt(" What is the domain name you want to search for : ");
const screenshotTestType = prompt(" To collect dns screenshots tap ( 1 ), smtp screenshots tap ( 2 ), both tap ( 3 ) ? ");

if (Number(screenshotTestType) == 1) {
    
    const pathStockScreensDns = prompt(" You choose to collect only DNS screenshots. Where do you want to stock them ? " );
    
    captureDnsMxToolBox(domainName, pathStockScreensDns);

} else if (Number(screenshotTestType) == 2) {
    
    const pathStockScreensSmtp = prompt(" You choose to collect only SMTP screenshots. Where do you want to stock them ? " );
    
    captureSmtpMxToolBox(domainName, pathStockScreensSmtp);

} else if (Number(screenshotTestType) == 3) {
    
    const pathStockScreensDns = prompt(" You choose to collect DNS & SMTP screenshots. Where do you want to stock DNS screenshots ? " );
    
    const pathStockScreensSmtp = prompt("Where do you want to stock SMTP screenshots ? ");

    captureSmtpMxToolBox(domainName, pathStockScreensSmtp, pathStockScreensDns);    
}
