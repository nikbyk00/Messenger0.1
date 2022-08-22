// импортируем пакет "ws"
const ws = require('ws');
//todo
// const {Sequelize} = require("sequelize");
// const Seq = new Sequelize()

const wss = new ws.Server({ // Создаём webSocket сервер
    port: 9000, // параметром передаём объект порта
}, () => console.log(`Server started on 9000`))

/**
 обращаемся к серверу и подписываемся на событие подключения,
 когда клиент подключается к webSocket серверу будет отрабатывать это событие,
 вторым параметром передаём callBack который на это событие будет отробатывать
 */
wss.on('connection', function connection(ws) {
    ws.on('message', function (message) { // вещаем слушатель события message и вторым параметром передаём callBack
        message = JSON.parse(message) // парсим строку в json объект
        // Seq.col('massage')
        /**
         делаем switch-case который будет отрабатывать по разному в зависимости от event который мы передали
         в сообщении
         */
        switch (message.event) {
            case 'message':
                broadcastMessage(message)
                break;
            case 'connection':
                broadcastMessage(message)
                break;
        }
    })
})


/**
 функция отправляет сообщение всем подключённым на данный момент пользователям
 */
function broadcastMessage(message) {
    /**
     обращемся к webSocket серверу у которого есть поле clients (это и есть все пользователи у которых
     установленно подключение) и с помощью forEach итерируемся по коллекции клиентов и выполняем отправления сообщений
     */

    wss.clients.forEach(client => {
        client.send(JSON.stringify(message))// отправляем не одному пользователю, а всем кто подключены
    })
}
