const { domain } = require('process');
const { error } = require('protractor');
const { where } = require('sequelize')
const Sequelize = require('sequelize')
const MODELS = require('./../models/model')
const {
    fn,
    col,
    Op
} = Sequelize;
let {
    Domains,
    Users,
    Token,
    Error
} = MODELS

module.exports = {
    getAllDomain: () => {
        try {
            return Domains.findAll()
        }
        catch (error) {
            console.log(error);
        }
    },

    insertDomain: (data) => {
        try {
            return Domains.create(data).then((result) => {
                return result
            }
            )
        } catch (error) {
            console.log(error);
        }
    },
    updateStatus: (data, status) => {
        try {
            return Domains.findAll({ where: { domainName: data } })
                .then(function (domain) {
                    if (domain) {
                        return Domains.update({
                            domainStatus: status
                        }, {
                            where: {
                                domainName: {
                                    [Op.like]: data
                                }
                            }
                        })
                    }
                })
        } catch (error) {
            console.log(error);
        }

    },
    getUser: (userEmail) => {
        try {
            return Users.findOne({ where: { email: userEmail } }).then(
                result => {
                    return result
                }
            )
        } catch (error) {
            console.log(error);
        }

    },
    createUser: (email, password) => {
        try {
            return Users.create({
                email: email,
                password: password
            })
        } catch (error) {
            console.log(error);
        }

    },
    saveToken: (id, token) => {
        try {
            return Token.create({
                userId: id,
                token: token
            })
        } catch (error) {
            console.log(error);
        }
    },
    getDomain: (name) => {
        try {
            return Domains.findOne({
                where: {
                    domainName: {
                        [Op.like]: name
                    }
                }
            })
        } catch (error) {
            console.log(error);
        }
    },
    insertError: (id, status, message, domain) => {
        try {
            return Error.create({
                domainId: id,
                errorStatus: status,
                errorMessage: message,
                domainName: domain,
                emailTriggered: false
            })
        } catch (error) {
            console.log(error);
        }
    },
    countError: (id) => {
        try {
            return Error.findAll({
                where: {
                    emailTriggered: false,
                    domainId: id,
                    createdAt: {
                        [Op.gte]: Sequelize.literal('NOW() - INTERVAL \'15min\''),
                    }
                },
            })
        } catch (error) {
            console.log(error);
        }

    },
    getLatestError: () => {
        try {
            return Error.findAll({
                order: [['createdAt', 'DESC']]
            })
        } catch (error) {
            console.log(error);
        }
    }
}