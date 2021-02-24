var express = require('express');
var router = express.Router();
var db=require('./../services/db.service')
var ping= require('./../script/ping')
var auth =  require('./../services/middleware.service')


/* GET home page. */
router.get('/', auth.tokenAuth ,async function(req, res, next) {
  let row = await db.getAllDomain()
  return res.status(200).send({
    'allDomains': row
  })
  
});

router.post('/add-domain',  auth.tokenAuth, async function(req , res, next){
  let data = req.body
  await db.insertDomain(data)
  return res.status(200).send({
    'message':"Domain inserted"
  })

})

router.get('/get-latest-error', auth.tokenAuth, async function(req , res, next){
  let data = await db.getLatestError()
  return res.status(200).send({
    data
  })
})

router.get('/refresh', async function(req, res){
  try{
    await ping.job.stop()
  await ping.job.start()
  return res.status(200).send('List refreshed')
    }catch{((error)=>{
    console.log(error);
    return res.status(500).send(error)
  })
}
})

module.exports = router;
