require("dotenv").config();
require("colors");
require("./src/bot")
process.on("unhandledRejection", (err) => {
    console.log("АНТИ-краш: тут должна быть ошибка но я её не вставил")
})