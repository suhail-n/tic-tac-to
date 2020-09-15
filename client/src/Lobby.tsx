import React, { useEffect, useState, useCallback } from 'react';
import { useSocket, SocketProvider } from './context/SocketProvider';
import Events from 'game-events';

type Rooms = {
  [key: string]: {
    sockets: {
      [socketId: string]: boolean
    }
  }
};

enum Display {
  Lobby,
  Room,
}

const Lobby = () => {
  const socket = useSocket();
  const [rooms, setRooms] = useState<Rooms | null>(null);
  const [display, setDisplay] = useState(Display.Lobby);
  const [room, setRoom] = useState<string | null>(null);
  useEffect(() => {
    socket.on(Events.ListRooms, (rooms: Rooms) => {
      setRooms(rooms);
    });
    socket.on(Events.RoomCreated, (roomId: string) => {
      setDisplay(Display.Room);
      setRoom(roomId);
    });
    socket.on(Events.RoomJoined, (roomId: string) => {
      setDisplay(Display.Room);
      setRoom(roomId);
    });
    return () => {
      socket.off(Events.ListRooms);
      socket.off(Events.RoomCreated);
      socket.off(Events.RoomJoined);
    }
  }, [socket, setRooms]);

  const createRoom = useCallback(() => {
    socket.emit(Events.CreateRoom);
  }, [socket]);
  const leaveRoom = useCallback(() => {
    if (room === null)
      return;
    socket.emit(Events.LeaveRoom, room);
    setDisplay(Display.Lobby);
  }, [socket, room]);
  const joinRoom = useCallback((roomId: string) => () => {
    socket.emit(Events.JoinRoom, roomId);
  }, [socket]);

  switch (display) {
    case Display.Room: return (
      <div>
        <h1>Room</h1>
        <h2>ID: {room!}</h2>
        <button onClick={leaveRoom}>Leave Room</button>
      </div>
    );
    case Display.Lobby: return (
      <div>
        <h1>Lobby</h1>
        <h2>Rooms Available:</h2>
        <ul>
          {rooms && Object.keys(rooms).map(roomId => 
            <li key={roomId}>
              <p>{roomId}</p>
              <button onClick={joinRoom(roomId)}>Join</button>
            </li>
          )}
        </ul>
        <button onClick={createRoom}>Create Room</button>
      </div>
    );
    default: return <></>;
  }
};

export default () => <SocketProvider><Lobby /></SocketProvider>;
