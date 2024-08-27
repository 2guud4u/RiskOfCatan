import { socket } from './socket';
import React from 'react';
export function joinRoom(room, name) {
  socket.emit('joinRoom', {room, name});
}

export function ListenForEvent( eventName ,callback) {
    React.useEffect(() => {
        socket.on(eventName, callback);
        return () => {
          socket.off(eventName, callback);
        };
      }, [callback, eventName]);
    
}