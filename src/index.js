import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
import { FetchData } from "./utils/postgres.js";
import { findUser, newUser } from "./queries/query.js";
config()

const bot = new TelegramBot(process.env.TOKEN, {polling: true})

bot.setMyCommands([
    {
        command: "/start",
        description: "start working"
    },
    {
        command: "/send",
        description: "send message to channel"
    }
])


bot.onText(/\/start/, async function(msg){
    const getUser = await FetchData(findUser, msg.chat.id)
    .catch(err => console.log(err))

    console.log(getUser);
    
    if(!getUser.length){
        await bot.sendMessage(msg.chat.id, "Siz ro'yxatdan o'tmagansiz. \n Ro'yxatdan o'tmoqchimisiz ?", {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: "Yes",
                        callback_data: 'yes'
                    }],
                    [{
                        text: "No",
                        callback_data: 'no'
                    }]
                ]
            }
        })
    }else {
        await bot.sendMessage(msg.chat.id, 'Welcome')
    }
})


bot.onText(/\/send/, async function(msg){
    bot.sendMessage(msg.chat.id, "Matn Kiriting. Yuborgan matningiz birinchi bo'lib admin tomonidan tekshiriladi. Keyin Kanalga yuboriladi.")
})

bot.on("text", async function(msg){
    const checkUser =await FetchData(findUser, msg.chat.id)

    
    if(!checkUser.length){
        if(msg.text !== '/start' && msg.text !== '/send')
        bot.sendMessage(msg.chat.id, "siz ro'yxatdan o'tmagansiz ")
        return;
    }

    if(msg.text !== '/start' && msg.text !== '/send'){
        bot.sendMessage(process.env.ADMIN_ID, msg.text, {
            reply_markup: {
            inline_keyboard: [
                [{
                    text: "Tasdiqlash",
                    callback_data: 'accept'
                }],
                [{
                    text: "Bekor Qilish",
                    callback_data: "decline"
                }]
            ]
        }
    })
    }
})

bot.on("callback_query", async function(msg){
    const chatdata = msg.message.chat
    if(msg.data == 'yes'){
        await FetchData(newUser, chatdata.id, chatdata.username)
        bot.sendMessage(chatdata.id, "muvaffaqiyatli ro'yxatdan o'tdingiz ✅")
    }else if (msg.data == 'no'){
        bot.sendMessage(chatdata.id, 'OK siz royxatdan otmadingiz')
    }

    if(msg.data == 'accept'){
        bot.sendMessage(process.env.CHANNEL_ID, msg.message.text)
    }
    else if (msg.data == 'decline'){
        bot.sendMessage(msg.message.chat.id, "Yozgan matningiz admin tomonidan bekor qilindi")
    }
})
