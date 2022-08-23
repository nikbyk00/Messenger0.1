/**
 * импортируем: express, cors, events
 * указываем порт
 */
const express = require('express');
const cors = require('cors');
const events = require('events')
const PORT = 9000;
const id = "1234"; // id чата
/**
 * С помощью emitter мы можем регистрировать события, подписываться на них и вызывать
 * @type {module:events.EventEmitter}
 */
const emitter = new events.EventEmitter();

const app = express(); // экземпляр приложения из express
app.use(cors()) // добавляем cors
app.use(express.json())

/**
 * get запрос на получение сообщений
 * первым параметром указываем маршрут, вторым callback
 */
app.get('/connect', (req, res) => {
    res.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
    })
    emitter.on('newMessage', (message) => {
            res.write(`data: ${JSON.stringify(message)} \n\n`)
    })
})

/**
 * post запрос на отправку сообщений
 * первым параметром указываем маршрут, вторым callback
 */

app.post('/new-messages', ((req, res) => {
    const message = req.body;
    if (message.chatId === id) {
        emitter.emit('newMessage', message)
        res.status(200)
    }
}))


/**
 * прослушиваем 9000 порт и выводим в логи старт
 */
app.listen(PORT, () => console.log(`server started on port ${PORT}`))