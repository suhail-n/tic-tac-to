import React, { createContext, forwardRef, FC, useRef, useContext } from 'react';
import io, { Socket } from 'socket.io-client';


const SocketContext = createContext<SocketIOClient.Socket>(
  null as unknown as typeof Socket
);

export const SocketProvider: FC = ({ children }) => {
  const socket = useRef(io('/'));
  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;
