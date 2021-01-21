const { VK } = require('vk-io');
const vk = new VK();
const users = require('./users.json');
const fs = require('fs');
const { HearManager } = require('@vk-io/hear')
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
        next.send('Пользователь получает предупреждение за нарушение мута и исключается из беседы')
        vk.api.messages.removeChatUser({ chat_id: next.chatId, user_id: user.id })
        return
      }
      user.warns++
      next.send(`@id${u.id}(Пользователь) получает предупреждение за нарушение мута`)
    }
    return context()
  }
  users.push({
    id: next.senderId,
    warns: 0,
    role: 1,
    ban: false,
    mute: 0
  })
  return context()
})

vk.updates.hear(/^❄ ([0-9]+)$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 3) return msg.send('У тебя не хватает прав.')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение.')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя заморозить самого себя.')
  if(u.role > user.role) return msg.send('Нельзя заморозить пользователя. Не хватает прав.')
  const seconds = Number(msg.$match[1]) * 1000
  u.mute = Date.now() + seconds
  msg.send(`Пользователя заморозили на ${msg.$match[1]} сек.⌛`)
})

vk.updates.hear(/^🔥$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 3) return msg.send('У тебя нехватает прав.')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение.')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя разморозить самого себя.')
  if(u.role > user.role) return msg.send('Нельзя разморозить пользователя. Не хватает прав.')
  if(u.mute == 0) return msg.send('Пользователь не заморожен')
  u.mute = 0
  msg.send(`Пользователь был разморожен.`)
})

vk.updates.on('chat_invite_user', (next, context) => {
  const user = users.filter(x => x.id === next.eventMemberId)[0]
  console.log(next);
  if(user.ban) {
    next.send('В беседу был приглашен забаненый пользователь!\nОн будет исключён.')
    vk.api.messages.removeChatUser({ chat_id: next.chatId, user_id: user.id })
  }
  return context()
})

vk.updates.hear(/^⚰$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 4) return msg.send('У тебя нехватает прав.')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение.')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя выдать бан самому себе.')
  if(u.role > user.role) return msg.send('Нельзя выдать бан пользователю. Не хватает прав.')
  u.ban = true
  msg.send(`Пользователь был забанен.`)
  vk.api.messages.removeChatUser({ chat_id: msg.chatId, user_id: u.id })
})

vk.updates.hear(/^✨$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 4) return msg.send('У тебя нехватает прав.')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение.')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(u.role > user.role) return msg.send('Нельзя разбанить пользователя. Не хватает прав.')
  if(u.ban == 0) return msg.send('Пользователь не забанен.')
  u.ban = false
  msg.send(`Пользователь был разбанен.`)
})

vk.updates.hear(/^🔪$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 3) return msg.send('У тебя нехватает прав.')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение.')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя выдать предупреждение самому себе.')
  if(u.role > user.role) return msg.send('Нельзя выдать предупреждение пользователю. Не хватает прав.')
  if(u.warns+1 == 3) {
    msg.send('Пользователь получает третье предупреждение и исключается из беседы')
    vk.api.messages.removeChatUser({ chat_id: msg.chatId, user_id: u.id })
    return
  }
  u.warns++
  msg.send('Пользователь получил 1 предупреждение')
})

vk.updates.hear(/^🍪$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 3) return msg.send('У тебя нехватает прав.')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение.')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(u.role > user.role) return msg.send('Нельзя снять предупреждение с пользователя. Не хвататет прав.')
  if(u.warns == 0) return msg.send('У пользователя нет предупреждений.')
  u.warns -= 1
  msg.send(`У пользователя осталось ${u.warns}/3 предупреждений`)
})

vk.updates.hear(/^❌$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 4) return msg.send('У тебя нехватает прав.')
  if(!msg.hasReplyMessage) return msg.send('Нужно переслать сообщение.')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя кикнуть самого себя.')
  if(u.role > user.role) return msg.send('Нельзя кикнуть пользователя. Не хватает прав.')
  msg.send(`Пользователь был кикнут из беседы`)
  vk.api.messages.removeChatUser({ chat_id: msg.chatId, user_id: u.id })
})

console.log("Бот запущен!");
vk.updates.start().catch(console.error)