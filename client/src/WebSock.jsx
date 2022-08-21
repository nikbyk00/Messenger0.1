import React, {useRef, useState} from 'react';


const WebSock = () => {
    const [messages, setMessages] = useState([]);
    const [value, setValue] = useState('');
    const socket = useRef() // создаём reference
    const [connected, setConnected] = useState(false); // состояние которое будет отображать подключение
    const [username, setUsername] = useState('') // имя пользователя

    function connect() {
        socket.current = new WebSocket('ws://localhost:9000') // в поле current создаём объект сокета
        /**
         * вешаем слушателей на сокет
         * onopen - отработает в момент подключения
         */
        socket.current.onopen = () => {
            setConnected(true) // после того как подключение установилось меняем состояние на true
            // в момент подключения сразу отправляем сообщение
            const message = {
                event: 'connection',
                username,
                id: Math.random()
            }
            socket.current.send(JSON.stringify(message)) // отправляем сообщение на сервер
        }
        /**
         * onmessage - отработает при получении сообщения
         * @param event
         */
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        /**
         * onClose - отработает когда подключение закрылось
         */
        socket.current.onclose= () => {
            console.log('Socket закрыт')
        }
        /**
         * onerror - отработает при ошибках
         */
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка')
        }
    }

    const sendMessage = async () => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current.send(JSON.stringify(message));
        setValue('')
    }

    /**
     * если подключение не установленно будем возвращать эту разметку
     */
    if (!connected) {
        return (
            <div className="center">
                <div className="form">
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        type="text"
                        placeholder="Введите ваше имя"/>
                    <button onClick={connect}>Войти</button>
                </div>
            </div>
        )
    }


    return (
        <div className="center">
            <div>
                <div className="form">
                    <input value={value} onChange={e => setValue(e.target.value)} type="text"/>
                    <button onClick={sendMessage}>Отправить</button>
                </div>
                <div className="messages">
                    {messages.map(mess =>
                        <div key={mess.id}>
                            {mess.event === 'connection'
                                ? <div className="connection_message">
                                     {mess.username}: ВСУПИЛ В ЧАТ
                                </div>
                                : <div className="message">
                                    {mess.username}: {mess.message}
                                </div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebSock;