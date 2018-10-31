const redis = require('redis')
const config = require('../dbConfig')
const { LogMessage } = require('../common')
var redisClient = redis.createClient(config.redis.port, config.redis.host, config.redis.ops)
redisClient.on('ready', () => {
    LogMessage('', 'redis is ready')
})
redisClient.on('error', (error) => {
    LogMessage(error, 'connect redis fail: ' + error)
})
module.exports = class {
    constructor() {

    }
    mapToObj(map){
        const obj = {}
        for(let[key, value] of map)
        {
            obj[key] = value
        }
        return obj
    }
    set(key, value, next) {
        
        redisClient.set(key, JSON.stringify(this.mapToObj(value)), next)
    }

    objToMap(obj){
        var mapObj = new Map()
        for(var property in obj)
        {
            mapObj.set(parseInt(property), obj[property])
        }
        return mapObj
    }
    get(key, next) {
        redisClient.get(key, (error, rs)=>{
            if(error || !rs)
                next(error, rs)
            else{                
                var mapObj = this.objToMap(JSON.parse(rs))
                next(error, mapObj)
            }
        })
    }

    has(key, next) {
        redisClient.exists(key, next)
    }

    remove(key, next) {
        redisClient.del(key, next)
    }

    update(key, value, next) {
        this.set(key, value, next)
    }
}