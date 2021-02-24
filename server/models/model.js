const { Domain } = require('domain');
const Sequelize = require('sequelize')
const parse = require('sequelize-parse-url');
const { flatMap } = require('tslint/lib/utils');
require('dotenv').config

const dbConfig = parse(process.env.DATABASE_URL ? process.env.DATABASE_URL : 'postgres://postgres:root@127.0.0.1:5432');
const _dialectOptions = {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
}
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: 'postgres',
  dialectOptions: process.env.DATABASE_URL ? _dialectOptions : {},
  logging: false
})

var Domains = sequelize.define('domains', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  domainName: Sequelize.STRING,
  domainType: Sequelize.STRING,
  domainStatus: Sequelize.STRING,
  createdAt: {
    type: 'TIMESTAMP'
  },
  updatedAt: {
    type: 'TIMESTAMP'
  }

})

const Users = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  email: Sequelize.STRING,
  password: Sequelize.STRING
})
const Token = sequelize.define('token', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  userId: {
    type: Sequelize.INTEGER,
       references: {
          model: 'users', // 'fathers' refers to table name
          key: 'id', // 'id' refers to column name in fathers table
       }
  },
  token: Sequelize.STRING
})

const Error= sequelize.define('errors',{
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  domainId: {
    type: Sequelize.INTEGER,
       references: {
          model: 'domains', // 'fathers' refers to table name
          key: 'id', // 'id' refers to column name in fathers table
       }
  },
  errorMessage: Sequelize.STRING,
  errorStatus: Sequelize.STRING,
  domainName : Sequelize.STRING,
  emailTriggered: Sequelize.BOOLEAN
})
Users.hasOne(Token)
Domains.hasMany(Error)


Domains.sync({ force: false })
Users.sync({ force: false })
Token.sync({ force: false })
Error.sync({force : false})

module.exports = {
  Domains,
  Users,
  Token,
  Error
};
