const Monitor = require('ping-monitor');
const { getAllDomain } = require('./../services/db.service');
const db = require('./../services/db.service')
const email = require('./../services/email.service')
var CronJob = require('cron').CronJob;
var request = require('request-promise');
const STATUS_PING = true

var job = new CronJob('* * * * *', async function () {
    var domains = await db.getAllDomain()
    let newDomains = domains.filter(item => item.domainType == 'static' || item.domainType == 'journey')
    // console.log(newDomains);
    if (STATUS_PING === true) {
        for (var i = 0; i < newDomains.length; i++) {
            const myMonitor = new Monitor({
                website: `${newDomains[i].dataValues.domainName}`,
                interval: 1, // minutes
                config: {
                    intervalUnits: 'minutes' // seconds, milliseconds, minutes {default}, hours
                },
                expect: {
                    statusCode: 200
                }
            });

            myMonitor.on('up', function (res, state) {
                db.updateStatus(res.website, 'up')
                myMonitor.stop()
            });
            myMonitor.on('down', async function (res) {
                let row = await db.getDomain(res.website)
                if (await row) {
                    db.updateStatus(res.website, 'down')
                    db.insertError(row.id, res.statusCode, res.statusMessage, row.domainName)
                    let errRec = await db.countError(row.id)
                    if (await errRec.length >= 5) {
                        email.sendEmail(row.domainName, res.statusCode, res.statusMessage)
                        console.log('Email Triggered');
                    }
                }
                myMonitor.stop()
            });


            myMonitor.on('stop', function (website) {
            });

            myMonitor.on('error', async function (res, error) {
                let row = await db.getDomain(error.website)
                if (await row) {
                    db.updateStatus(error.website, 'down')
                    db.insertError(row.id, error.statusCode, error.statusMessage, row.domainName)
                    let errRec = await db.countError(row.id)
                    if (await errRec.length >= 5) {
                        email.sendEmail(row.domainName, error.statusCode, error.statusMessage)
                        console.log('Email Triggered');
                    }
                }
                myMonitor.stop()
            });

        }
    }
}, null, true, 'Asia/Kolkata');




module.exports = {
    job
}
job.start();
