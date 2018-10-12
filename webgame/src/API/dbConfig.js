module.exports = {
    db: {
        database: process.env.DB_NAME || 'webgame',
        user: process.env.DB_USER || 'webgameuser',
        password: process.env.DB_PASSWORD || 'root',
        options: {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            dialect: process.env.DB_DIALECT || 'mysql',
            operatorsAliases: false,
            insecureAuth: true 
        }
    },
    Bcrypt: {
        salt: 10 //bcryptjs 
    },
    JwtToken: {
        JwtSecret: process.env.JWT_SECRET || 'secret'
    },
    CookieOption: {
        maxAge: 1000 * 300, 
        httpOnly: false
    }
}