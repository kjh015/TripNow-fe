import React, { useState, useEffect } from 'react'
import ViewItem from './ViewItem';

const SseSubscriber = () => {
    const [messages, setMessages] = useState([]);
    const [items, setItems] = useState([]);
    const [view, setView] = useState('');
    const [test, setTest] = useState("not connect");
    const [test2, settest2] = useState("not send");

    useEffect(() => {
        const eventSource = new EventSource("http://localhost:8000/sse/subscribe");
        eventSource.onopen = () => {
            setTest("connected!!");
        };
        eventSource.addEventListener("connect", (event) => {
            console.log(event.data);
        });
        eventSource.addEventListener("kafka-message", (event) => {
            settest2("sended!");
            try {
                setMessages((prev) => [...prev, event.data]);
                const parsed = JSON.parse(event.data);
                setItems((prev) => [...prev, parsed]);
            } catch (e) {
                console.error("JSON parse error:", e);
            }
        });

        eventSource.onerror = (err) => {
            console.error("SSE error:", err);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div className='container'>
            <div className='row'>
                <h2>Kafka Messages</h2>
                <p>{test}</p>
                <p>{test2}</p>
                {messages.map((msg, idx) => (
                    <div key={idx}>
                        <a href="#" onClick={(e) => {e.preventDefault(); setView(idx);}}>{msg}</a>
                    </div>
                ))}

                {view !== '' && (
                    <ViewItem query={items[view].query} onClose={() => setView('')} />
                )}
            </div>
        </div>
    );
};

export default SseSubscriber;