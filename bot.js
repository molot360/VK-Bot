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
        next.send(`${u.name} получает предупреждение за нарушение мута и исключается из беседы`)
        vk.api.messages.removeChatUser({ chat_id: next.chatId, user_id: user.id })
        return
      }
      user.warns++
      next.send(`${u.name} получает предупреждение за нарушение мута`)
    }
    return context()
  }
  users.push({
    id: next.senderId,
    name: "Пользователь", 
    nick: "Пользователь",
    clan: {
      name: "Нет",
      id: 0
    },
    description: "Нет",
    warns: 0,
    role: 1,
    ban: false,
    mute: 0,
    messages: 0
})
  user.messages++
  return context()
})

const clans = [
  {
    name: 'League of Legends',
    id: 1,
  },
  {
    name: 'Genshin Impact',
    id: 2,
  },
  {
    name: 'Mobile Legends',
    id: 3,
  }
]

vk.updates.hear(/^Кланы$/i, msg => {
  user = users.filter(x => x.id === msg.senderId)[0]
  msg.send(`${user.nick}, вот все существующие кланы:\n1. League of Legends\n2. Genshin Impact\n3. Mobile Legends\n\nЧтобы вступить в клан, введи: "!клан [номер клана]"`)
})

vk.updates.hear(/^!клан ([0-9]+)/i, msg => {
  user = users.filter(x => x.id === msg.senderId)[0]
  num = Number(msg.$match[1])
  if(num > 3 || num < 1) return msg.send(`Клана с таким номером не существует`)
  clan = clans.filter(x => x.id === num)[0]
  user.clan.name = clan.name
  user.clan.id = clan.id
  msg.send(`${user.nick}, теперь ты в клане "${clan.name}"`)
})

vk.updates.hear(/^!описание (.*)$/i, msg => {
  user = users.filter(x => x.id === msg.senderId)[0]
  description = msg.$match[1]
  if(description.length > 100) return msg.send(`Описание не может быть длиннее 100 символов`)
  user.description = description
  msg.send(`Описание обновлено`)
})

vk.updates.hear(/^!ник (.*)/i, msg => {
  user = users.filter(x => x.id === msg.senderId)[0]
  nick = msg.$match[1]
  if(nick.length > 15) return msg.send(`Ник не может быть длиннее 15 символов`)
  user.nick = nick
  msg.send(`Вы сменили никнейм на "${nick}"`)
})

vk.updates.hear(/^проф/i, msg => {
  user = users.filter(x => x.id === msg.senderId)[0]
    if(msg.hasReplyMessage) {
      user = users.filter(x => x.id === msg.senderId)[0]
      const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
      var achieve1 = ''
      if(u.messages > 10000) achieve1 += `🏅Активный собеседник (написать 10 000 сообщений)`
      var text = ''
      if(u.role > 7) text += `✅Администратор`
      msg.send(`📋Профиль ${u.nick}:\n⭐Ранг: ${u.role}\n🛡Клан: ${u.clan.name}\n🖋Количество отправленных сообщений: ${u.messages}\n📝Описание: ${u.description}\n🏆Достижения:\n${achieve1}\n\n${text}`)
      return context()
  }
  var achieve1 = ''
  if(user.messages > 10000) achieve1 += `🏅Активный собеседник (написать 10 000 сообщений)`
  var text = ''
  if(user.role > 7) text += `✅Администратор`
  msg.send(`📋Профиль ${user.nick}:\n⭐Ранг: ${user.role}\n🛡Клан: ${user.clan.name}\n🖋Количество отправленных сообщений: ${user.messages}\n📝Описание: ${user.description}\n🏆Достижения:\n${achieve1}\n\n${text}`)
})

vk.updates.hear(/^Пригласить на чай "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *пригласил(а) на чай*☕ ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Пригласить на чай$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *пригласил(а) на чай*☕ ${u.nick}`)
})

vk.updates.hear(/^Обнять "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *обнял(а)*🤗 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Обнять$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *обнял(а)*🤗 ${u.nick}`)
})

vk.updates.hear(/^Пнуть "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *пнул(а)*👟 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Пнуть$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *пнул(а)*👟 ${u.nick}`)
})

vk.updates.hear(/^Выебать "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *принудил(а) к интиму*👉🏻👌🏻 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Выебать$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *принудил(а) к интиму*👉🏻👌🏻 ${u.nick}`)
})

vk.updates.hear(/^Кусь "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *сделал(а) кусь*😸 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Кусь$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *сделал(а) кусь*😸 ${u.nick}`)
})

vk.updates.hear(/^Уебать "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *сильно ударил(а)*👊🏻 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Уебать$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *сильно ударил(а)*👊🏻 ${u.nick}`)
})

vk.updates.hear(/^Показать бицуху "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *показал(а) бицуху*💪🏻 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Показать бицуху$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *показал(а) бицуху*💪🏻 ${u.nick}`)
})

vk.updates.hear(/^Погладить "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *погладил(а)*👋🏻 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Погладить$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *погладил(а)*👋🏻 ${u.nick}`)
})

vk.updates.hear(/^Убить "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *убил(а)*🔪 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Убить$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *убил(а)*🔪 ${u.nick}`)
})

vk.updates.hear(/^Поцеловать "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *поцеловал(а)*💋 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Поцеловать$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *поцеловал(а)*💋 ${u.nick}`)
})

vk.updates.hear(/^Покормить "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *покормил(а)*🥣 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Покормить$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *покормил(а)*🥣 ${u.nick}`)
})

vk.updates.hear(/^Связать "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *связал(а)*😵 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Связать$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *связал(а)*😵 ${u.nick}`)
})

vk.updates.hear(/^Попустить "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *попустил(а)*🐽 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Попустить$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *попустил(а)*🐽 ${u.nick}`)
})

vk.updates.hear(/^Похвалить "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *похвалил(а)*😊 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Похвалить$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *похвалил(а)*😊 ${u.nick}`)
})

vk.updates.hear(/^Рассмешить "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *рассмешил(а)*🤣 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Рассмешить$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *рассмешил(а)*🤣 ${u.nick}`)
})


vk.updates.hear(/^Схватить "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *схватил(а)*😋 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Схватить$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *схватил(а)*😋 ${u.nick}`)
})

vk.updates.hear(/^Растрепать волосы "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *испортил(а) причёску*😠 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Растрепать волосы$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *испортил(а) причёску*😠 ${u.nick}`)
})

vk.updates.hear(/^Толкнуть "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *толкнул(а)*🤕 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Толкнуть$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *толкнул(а)*🤕 ${u.nick}`)
})

vk.updates.hear(/^Накинуть шарф "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *накинул(а) шарф*🤗 на ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Накинуть шарф$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *накинул(а) шарф*🤗 на ${u.nick}`)
})


vk.updates.hear(/^Делать секс "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`*сделал(а) много cum*😨\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Делать секс$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`*сделал(а) много cum*😨`)
})

vk.updates.hear(/^Завести ребёнка$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`*знакомьтесь, Антон*🙂`)
})

vk.updates.hear(/^Включить обогреватель$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав.')
  if (Math.random() * 100 < 40) {
    msg.send('*произошло замыкание и вас ударило током*❌');
    }
    else if (Math.random() * 100 < 60) {
    msg.send('*повеяло тёплым воздухом*✅')
    }
})

vk.updates.hear(/^Покормить кота$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав.')
  if (Math.random() * 100 < 60) {
    msg.send('*кот доволен*✅');
    }
    else if (Math.random() * 100 < 40) {
    msg.send('*ваш кот умер ещё неделю назад*❌')
    }
})

vk.updates.hear(/^Заварить чай$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав.')
  if (Math.random() * 100 < 40) {
    msg.send('*чайник с грохотом упал вам на ногу*❌');
    }
    else if (Math.random() * 100 < 60) {
    msg.send('*получился отличный чай*✅')
    }
})

vk.updates.hear(/^Сварить поесть$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав.')
  if (Math.random() * 100 < 33) {
    msg.send('*сварил(а) пельмени*🥣');
    }
    else if (Math.random() * 100 < 33) {
    msg.send('*сварил(а) борщ*🍛')
    }
    else if (Math.random() * 100 < 33) {
    msg.send('*кастрюля сварила вас*😨👍')
    }
})

vk.updates.hear(/^Думать$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав.')
  if (Math.random() * 100 < 50) {
    msg.send('Было бы чем...🤧');
    }
    else if (Math.random() * 100 < 50) {
    msg.send('*Задумался(ась)*🤔')
    }
})

vk.updates.hear(/^Посмотреть в зеркало$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав.')
  if (Math.random() * 100 < 33) {
    msg.send('Вах какой красавчик😏');
    }
    else if (Math.random() * 100 < 33) {
    msg.send('Зеркало: *треснуло*😕')
    }
    else if (Math.random() * 100 < 33) {
    msg.send('Вах какая красавица😏')
    }
})

vk.updates.hear(/^Напоить "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *напоил(а)*😝🍻 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Напоить$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *напоил(а)*😝🍻 ${u.nick}`)
})


vk.updates.hear(/^Воскресить$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`Оно живое!😨`)
})

vk.updates.hear(/^Съесть "(.*)"$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  var replik = msg.$match[1]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick} *съел(а)*😲 ${u.nick}\n💬С репликой: "${replik}"`)
})

vk.updates.hear(/^Съесть$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Для выполнения рп-команды нужно переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать рп-команды на себя')
  msg.send(`${user.nick}*съел(а)*😲 ${u.nick}`)
})

vk.updates.hear(/^Техника теневого клонирования$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  msg.send(`Даттебайо!`)
})

vk.updates.hear(/^Cпкнч$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 1) return msg.send('У тебя нехватает прав')
  msg.send(`${user.nick} пожелал спокойной ночи💤`)
})

vk.updates.hear(/^👺$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 6) return msg.send('У тебя нехватает прав')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя использовать на себя')
  msg.send(`Осторожнее! Вы злите админа!`)
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
  msg.send(`${u.name} заморожен(а) на ${msg.$match[1]} сек.⌛`)
})

vk.updates.hear(/^🔥$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 5) return msg.send('Не хватает прав')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send(`Нельзя разморозить самого себя`)
  if(u.role >= user.role) return msg.send(`Нельзя разморозить пользователя: не хватает прав`)
  if(u.mute == 0) return msg.send(`${u.name} не заморожен(а)`)
  u.mute = 0
  msg.send(`${u.name} разморожен(а)`)
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
  msg.send(`${u.name} забанен(а)`)
  vk.api.messages.removeChatUser({ chat_id: msg.chatId, user_id: u.id })
})

vk.updates.hear(/^✨$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 8) return msg.send('Не хватает прав')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(u.role >= user.role) return msg.send('Нельзя разбанить пользователя: не хватает прав')
  if(u.ban == 0) return msg.send(`${u.name} не забанен(а)`)
  u.ban = false
  msg.send(`${u.name} разбанен(а)`)
})

vk.updates.hear(/^🔪$/i, msg => {
  const user = users.filter(x => x.id === msg.senderId)[0]
  if(user.role < 6) return msg.send('Не хватает прав')
  if(!msg.hasReplyMessage) return msg.send('Необходимо переслать сообщение')
  const u = users.filter(x => x.id === msg.replyMessage.senderId)[0]
  if(user.id == u.id) return msg.send('Нельзя выдать предупреждение самому себе')
  if(u.role >= user.role) return msg.send('Нельзя выдать предупреждение пользователю: не хватает прав')
  if(u.warns+1 == 3) {
    msg.send(`${u.name} получает третье предупреждение и исключается из беседы`)
    vk.api.messages.removeChatUser({ chat_id: msg.chatId, user_id: u.id })
    return
  }
  u.warns++
  msg.send(`${u.name} получил(а) ${u.warns}/3 предупреждений`)
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
  msg.send(`${u.name} кикнут(а) из беседы`)
  vk.api.messages.removeChatUser({ chat_id: msg.chatId, user_id: u.id })
})

console.log("Бот запущен!");
vk.updates.start().catch(console.error)