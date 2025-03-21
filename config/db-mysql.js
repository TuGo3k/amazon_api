const Sequelize = require('sequelize')

var db = {}

const sequelize = new Sequelize(
    process.env.SEQUELIZE_DATABASE,
    process.env.SEQUELIZE_USER,
    process.env.SEQUELIZE_PASSWORD, 
    {
    host: process.env.SEQUELIZE_HOST,
    port: process.env.SEQUELIZE_PORT,
    dialect: process.env.SEQUELIZE_DIALECT,
    define: {
        freezeTableName: true,
    },
    pool: {
        max: 10,
        min: 0,
        /// connection хийх хугацаа дээд талдаа 60 секунд
        acquire: 60000,
        // хэн ч ашиглахгүй байгаа үед 10 секунд болвол зайлуулах нь байна
        idle: 10000,
    },
    //op.gt // хакердуулахаас сэргийлэхийн тулд
    operatorAliases: false,
})

// db-тэй холбох процесс
const models = [
    require('../models/sequelize/book'),
    require('../models/sequelize/user'),
    require('../models/sequelize/category'),
    require('../models/sequelize/comment'),
]
// давталт
models.forEach(model => {
    // model нь sequelize болон Sequelize-г параметр болгон авна
    // modelд орж буй параметрүүд нь teacher course дотор module.exports = function (sequelize, DataTypes) хэлбэрээр орж байгаа 
    // Эхнийх нь database руу холбож өгдөг object
    // Хоёр дахь нь model доторх table-ийг тодорхойлж өгдөг object
    const seqModel = model(sequelize, Sequelize)
    // db object-ийн утгаас model нэртэй key-ээр хадгална
    //жишээ нь return sequelize.define('course',<=== course нэрээр нь бас return sequelize.define('teacher', <=== teacher нэрээр нь хадгална
    db[seqModel.name] = seqModel; 
})
// өөр газр луу хандахын тулд db-д хийж өгнө
db.sequelize = sequelize

module.exports = db