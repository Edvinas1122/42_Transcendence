import { useContext, useEffect } from 'react';
import SocketContext from './socket';

const useSocket = (eventName :string, callback) => {
  const socket = useContext(SocketContext);
  
  useEffect(() => {
    const handler = (data) => {
      callback(data);
    };

    socket.on(eventName, handler);

    return () => {
      socket.off(eventName, handler);
    };
  }, [eventName, callback, socket]);
}

export default useSocket;