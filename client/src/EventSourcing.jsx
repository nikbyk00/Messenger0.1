import React, {useEffect, useState} from 'react';
import axios from "axios";

const EventSourcing = () => {
    const [messages, setMessages] = useState([]); // сообщение и функция которая их изменяет
    const [value, setValue] = useState(''); // Input
    const [connected, setConnected] = useState(false); // состояние которое будет отображать подключение
    const [username, setUsername] = useState('') // имя пользователя
    const [chatId, setChatId] = useState('')

    useEffect(() => {
        subscribe()
    }, [])

    function connect() {
        setConnected(true)
    }

    // получение сообщения
    const subscribe = async () => {
        const eventSource = new EventSource(`http://localhost:9000/connect`)
        eventSource.onmessage = function (event) {
            const message = JSON.parse(event.data);
            setMessages(prev => [message, ...prev]);
        }
    }

    /**
     * функция отправки сообщений
     */
    const sendMessage = async () => {
        setValue('')
        await axios.post('http://localhost:9000/new-messages', {
            chatId,
            username,
            message: value,
            id: Date.now(),
        })

    }

    if (!connected) {
        return (
            <div className="center">
                <div className="form">
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        type="text"
                        placeholder="Введите ваше имя"/>
                    <input
                        value={chatId}
                        onChange={e => setChatId(e.target.value)}
                        type="text"
                        placeholder="Введите id чата"/>
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
                                    {mess.username.toUpperCase()} - {mess.message}:
                                </div>
                            }
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default EventSourcing;