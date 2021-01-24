const { VK } = require('vk-io');
const vk = new VK();
const users = require('./users.json');
const fs = require('fs');
const { HearManager } = require('@vk-io/hear');
const { SSL_OP_NETSCAPE_CA_DN_BUG } = require('constants');
vk.setOptions({
token:"484323f2e45a35108681ee49a2183369c15c409f7c0e98908f69d2877cfba0e681c056dd1a3ca7aefc366"
})
const bot = new HearManager()

vk.updates.on('message_new', bot.middleware)

bot.hear(/привет/i, msg => {
    msg.send(`Привет, твой id - ${msg.senderId}`)
})

setInterval(async () => {
  fs.writeFileSync("./users.json", JSON.stringify(users, null, "\t"))
}, 500);

vk.updates.on('message', (next, context) => {
  const user = users.filter(x => x.id === next.senderId)[0]
  if(user) {
    if(user.mute > Date.now()){
      if(user.warns+1 == 3) {
        next.send(`${u.Name} получает предупреждение за нарушение мута и исключается из беседы`)
        vk.api.messages.removeChatUser({ chat_id: next.chatId, user_id: user.id })
        return
      }
      user.warns++
      next.send(`${u.Name} получает предупреждение за нарушение мута`)
    }
    return context()
  }
  users.push({
    id: next.senderId,
    name: "Текст",
    nick: "Пользователь",
    warns: 0,
    role: 1,
    ban: false,
    mute: 0
  })
  return context()
})

vk.updates.hear(/^!ник (.*)/i, msg => {
  user = users.filter(x => x.id === msg.senderId)[0]
  nick = msg.$match[1]
  if(nick.length > 15) return msg.send(`Ник не может быть длиннее 15 символов`)
  user.nick = nick
  msg.send(`Вы сменили никнейм на "${nick}"`)
})

vk.updates.hear(/^Пригласить на чай$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *пригласил(а) на чай*☕ ${u.nick}`)
})

vk.updates.hear(/^Обнять$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *обнял(а)*🤗 ${u.nick}`)
})

vk.updates.hear(/^Пнуть$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *пнул(а)*👟 ${u.nick}`)
})

vk.updates.hear(/^Выебать$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *принудил(а) к интиму*👉🏻👌🏻 ${u.nick}`)
})

vk.updates.hear(/^Кусь$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *сделал(а) кусь*😸 ${u.nick}`)
})

vk.updates.hear(/^Уебать$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *сильно ударил(а)*👊🏻 ${u.nick}`)
})

vk.updates.hear(/^Показать бицуху$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *показал(а) бицуху*💪🏻 ${u.nick}`)
})

vk.updates.hear(/^Погладить$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *погладил(а)*👋🏻 ${u.nick}`)
})

vk.updates.hear(/^Убить$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *убил(а)*🔪 ${u.nick}`)
})

vk.updates.hear(/^Поцеловать$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *поцеловал(а)*💋 ${u.nick}`)
})

vk.updates.hear(/^Покормить$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *покормил(а)*🥣 ${u.nick}`)
})

vk.updates.hear(/^Связать$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *связал(а)*😵 ${u.nick}`)
})

vk.updates.hear(/^Попустить$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *попустил(а)*🐽 ${u.nick}`)
})

vk.updates.hear(/^Похвалить$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *похвалил(а)*😊 ${u.nick}`)
})

vk.updates.hear(/^Рассмешить$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *рассмешил(а)*🤣 ${u.nick}`)
})

vk.updates.hear(/^Схватить$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *схватил(а)*😋 ${u.nick}`)
})

vk.updates.hear(/^Растрепать волосы$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *испортил(а) причёску*😠 ${u.nick}`)
})

vk.updates.hear(/^Толкнуть$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *толкнул(а)*🤕 ${u.nick}`)
})

vk.updates.hear(/^Накинуть шарф$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *накинул(а) шарф*🤗 на ${u.nick}`)
})

vk.updates.hear(/^Делать секс$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`*было много cum*😨`)
})

vk.updates.hear(/^Завести ребёнка$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`*знакомьтесь, Антон*🙂`)
})

vk.updates.hear(/^❄ ([0-9]+)$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 5) return msg.send('Не хватает прав')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя заморозить самого себя')
  if(u.role >= user.role) return msg.send('Нельзя заморозить пользователя: не хватает прав')
  const seconds = Number(msg.$match[1]) * 1000
  u.mute = Date.now() + seconds
  msg.send(`${u.Name} заморожен(а) на ${msg.$match[1]} сек.⌛`)
})

vk.updates.hear(/^🔥$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 5) return msg.send('Не хватает прав')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send(`Нельзя разморозить самого себя`)
  if(u.role >= user.role) return msg.send(`Нельзя разморозить пользователя: не хватает прав`)
  if(u.mute == 0) return msg.send(`${u.Name} не заморожен(а)`)
  u.mute = 0
  msg.send(`${u.Name} разморожен(а)`)
})

vk.updates.on('chat_invite_user', (next, context) => {
  const user = users.filter(x => x.id === next.eventMemberId)[0]
  console.log(next);
  if(user.ban) {
    next.send('В беседу был приглашен забаненый пользователь!\nОн будет исключён')
    vk.api.messages.removeChatUser({ chat_id: next.chatId, user_id: user.id })
  }
  return context()
})

vk.updates.hear(/^⚰$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 8) return msg.send('Не хватает прав')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя выдать бан самому себе')
  if(u.role >= user.role) return msg.send('Нельзя выдать бан пользователю: не хватает прав.')
  u.ban = true
  msg.send(`${u.Name} забанен(а)`)
  vk.api.messages.removeChatUser({ chat_id: msg.chatId, user_id: u.id })
})

vk.updates.hear(/^✨$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 8) return msg.send('Не хватает прав')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(u.role >= user.role) return msg.send('Нельзя разбанить пользователя: не хватает прав')
  if(u.ban == 0) return msg.send(`${u.Name} не забанен(а)`)
  u.ban = false
  msg.send(`${u.Name} разбанен(а)`)
})

vk.updates.hear(/^🔪$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 6) return msg.send('Не хватает прав')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя выдать предупреждение самому себе')
  if(u.role >= user.role) return msg.send('Нельзя выдать предупреждение пользователю: не хватает прав')
  if(u.warns+1 == 3) {
    msg.send(`${u.Name} получает третье предупреждение и исключается из беседы`)
    vk.api.messages.removeChatUser({ chat_id: msg.chatId, user_id: u.id })
    return
  }
  u.warns++
  msg.send(`${u.Name} получил(а) ${u.warns}/3 предупреждений`)
})

vk.updates.hear(/^🍪$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 6) return msg.send('Не хватает прав')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(u.role >= user.role) return msg.send('Нельзя снять предупреждение с пользователя: не хватает прав')
  if(u.warns == 0) return msg.send('У пользователя нет предупреждений')
  u.warns -= 1
  msg.send(`У пользователя осталось ${u.warns}/3 предупреждений`)
})

vk.updates.hear(/^❌$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 7) return msg.send('Не хватает прав')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя кикнуть самого себя')
  if(u.role >= user.role) return msg.send('Нельзя кикнуть пользователя: не хватает прав')
  msg.send(`${u.Name} кикнут(а) из беседы`)
  vk.api.messages.removeChatUser({ chat_id: msg.chatId, user_id: u.id })
})

console.log("Бот запущен!");
vk.updates.start().catch(console.error)