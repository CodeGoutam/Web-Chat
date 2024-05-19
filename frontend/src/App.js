import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

const App = () => {
    const socket = useMemo(
        () =>
            io("http://localhost:5000"),
        []
    );

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState("");
    const [socketID, setSocketId] = useState("");
    const [roomName, setRoomName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("message", { message, room });
        setMessage("");
    };

    const joinRoomHandler = (e) => {
        e.preventDefault();
        socket.emit("join-room", roomName);
        setRoomName("");
    };

    useEffect(() => {
        socket.on("connect", () => {
            setSocketId(socket.id);
            console.log("connected", socket.id);
        });
        socket.on("receive-message", (data) => {
            console.log(data);
            setMessages((messages) => [...messages, data]);
        });
        socket.on("welcome", (s) => {
            console.log(s);
        });
    }, [socket]);

    return (
        <>
            <p>My Id: {socketID}</p>

            <form onSubmit={joinRoomHandler}>
                <h5>Join Room</h5>

                <label>Group Name</label> <input
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <button type="submit" >
                    Join
                </button>
            </form>

            <form onSubmit={handleSubmit}>
                <label>Write message :-</label>
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                /><br />
                <label>Send To :-</label>
                <input
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                />
                <button type="submit" >
                    Send
                </button>
            </form>


            {messages.map((m, i) => (
                <p key={i}>
                    {i} {m}</p>
            ))}
        </>
    );
};

export default App;