const jwt = require('jsonwebtoken')
const service = require('./db.service')

const tokenAuth = ( req, res, next) => {
    const authHeader =  req.headers.authorization;
    console.log('token auth');
    if (authHeader){
        const token= authHeader.split(' ')[1]
        jwt.verify( token, 'secretkey' , async (err , user)=>{
            if (err){
                // console.log(err)
                return res.status(401).send({
                    'Message': 'Unauthorized'
                })
            }

            let row = await service.getUser(user.email)
                if (!row){
                    return res.status(401).send({
                        'Message': 'Unauthorized'
                    })
                }

            req.user= row
            next()
        })

    }else{
        res.sendStatus(401)
    }
}

module.exports= {
    tokenAuth
}