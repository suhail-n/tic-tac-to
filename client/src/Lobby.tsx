import React, { useEffect, useState } from 'react';
import { useSocket, SocketProvider } from './context/SocketProvider';
import Events from 'game-events';

type Rooms = {
  [key: string]: {
    sockets: {
      [socketId: string]: boolean
    }
  }
};

const Lobby = () => {
  const socket = useSocket();
  const [rooms, setRooms] = useState<Rooms | null>(null);

  useEffect(() => {
    socket.on(Events.ListRooms, (rooms: Rooms) => {
      setRooms(rooms);
    });
  }, [socket, setRooms]);
  return (
    <div>
      <h1>Lobby</h1>
      <h2>Rooms Available:</h2>
      <ul>
        {rooms && Object.keys(rooms).map(roomId => <li>{roomId}</li>)}
      </ul>
    </div>
  );
};

export default () => <SocketProvider><Lobby /></SocketProvider>;
