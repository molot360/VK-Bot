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
    Name: "Текст",
    warns: 0,
    role: 1,
    ban: false,
    mute: 0
  })
  return context()
})

vk.updates.hear(/^❄ ([0-9]+)$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 5) return msg.send('Не хватает прав')
  if(user.role == u.role) return msg.send('Нельзя заморозить пользователя с таким же рангом')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя заморозить самого себя')
  if(u.role > user.role) return msg.send('Нельзя заморозить пользователя: не хватает прав')
  const seconds = Number(msg.$match[1]) * 1000
  u.mute = Date.now() + seconds
  msg.send(`${u.Name} заморожен на ${msg.$match[1]} сек.⌛`)
})

vk.updates.hear(/^🔥$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 5) return msg.send('Не хватает прав')
  if(user.role == u.role) return msg.send('Нельзя разморозить пользователя с таким же рангом')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send(`Нельзя разморозить самого себя`)
  if(u.role > user.role) return msg.send(`Нельзя разморозить пользователя: не хватает прав`)
  if(u.mute == 0) return msg.send(`${u.Name} не заморожен`)
  u.mute = 0
  msg.send(`${u.Name} был разморожен.`)
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
  if(user.role == u.role) return msg.send('Нельзя забанить пользователя с таким же рангом')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя выдать бан самому себе')
  if(u.role > user.role) return msg.send('Нельзя выдать бан пользователю: не хватает прав.')
  u.ban = true
  msg.send(`${u.Name} был забанен.`)
  vk.api.messages.removeChatUser({ chat_id: msg.chatId, user_id: u.id })
})

vk.updates.hear(/^✨$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 8) return msg.send('Не хватает прав')
  if(user.role == u.role) return msg.send('Нельзя разбанить пользователя с таким же рангом')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(u.role > user.role) return msg.send('Нельзя разбанить пользователя: не хватает прав')
  if(u.ban == 0) return msg.send(`${u.Name} не забанен`)
  u.ban = false
  msg.send(`${u.Name} был разбанен.`)
})

vk.updates.hear(/^🔪$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 6) return msg.send('Не хватает прав')
  if(user.role == u.role) return msg.send('Нельзя выдать предупреждение пользователю с таким же рангом')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя выдать предупреждение самому себе')
  if(u.role > user.role) return msg.send('Нельзя выдать предупреждение пользователю: не хватает прав')
  if(u.warns+1 == 3) {
    msg.send(`${u.Name} получает третье предупреждение и исключается из беседы`)
    vk.api.messages.removeChatUser({ chat_id: msg.chatId, user_id: u.id })
    return
  }
  u.warns++
  msg.send(`${u.Name} получил ${u.warns}/3 предупреждений`)
})

vk.updates.hear(/^🍪$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 6) return msg.send('Не хватает прав')
  if(user.role == u.role) return msg.send('Нельзя снять предупреждение с пользователя с таким же рангом')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(u.role > user.role) return msg.send('Нельзя снять предупреждение с пользователя: не хватает прав')
  if(u.warns == 0) return msg.send('У пользователя нет предупреждений')
  u.warns -= 1
  msg.send(`У пользователя осталось ${u.warns}/3 предупреждений`)
})

vk.updates.hear(/^❌$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 7) return msg.send('Не хватает прав')
  if(user.role == u.role) return msg.send('Нельзя кикнуть пользователя с таким же рангом')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя кикнуть самого себя')
  if(u.role > user.role) return msg.send('Нельзя кикнуть пользователя: не хватает прав')
  msg.send(`${u.Name} был кикнут из беседы`)
  vk.api.messages.removeChatUser({ chat_id: msg.chatId, user_id: u.id })
})

console.log("Бот запущен!");
vk.updates.start().catch(console.error)