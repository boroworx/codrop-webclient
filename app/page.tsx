"use client"
import React, { useEffect, useState } from 'react';
import { ServerState } from './util';
import { Scanner } from '@yudiel/react-qr-scanner';

const WebSocketClient = () => {
  const [message, setMessage] = useState('');
  const [value, setValue] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const [address, setAddress] = useState('');
  const [serverState, setServerState] = useState<ServerState>(ServerState.Disconnected);

  useEffect(() => {
    if(socket == null)
      return;
        // Set up event listeners
        socket.onopen = () => {
          setServerState(ServerState.Connected);
        };

        socket.onerror = (event: any) => {
          setMessage(JSON.stringify(event));
          setServerState(ServerState.Disconnected);
        }
    
        socket.onmessage = (event: any) => {
          setMessage(`${message}\n${event.data}`);
        };
    
        socket.onclose = () => {
          setServerState(ServerState.Disconnected);
        };
    
        // Clean up function
        return () => {
          socket.close();
        };
  }, [socket]);

  function connect() {
    setSocket(new WebSocket(address));
  }

  function disconnect() {
    if(socket == null)
      return;

    socket.close();
    setSocket(null);
  }

  function sendMessage() {
    socket.send(value);
  }

  return (
    <div>
      <h1>WebSocket Client</h1>
      {serverState == ServerState.Disconnected ? 
      (
        <>
      <h1><br/>Disconnected</h1>
      <input onChange={(e) => setAddress(e.currentTarget.value)} placeholder='Server address'></input>
      <button onClick={() => connect()}>Connect</button>
      </>
      ) : 
      (
        <>
        <p>Received message: {message}</p>
        <input onChange={(e) => setValue(e.currentTarget.value)}></input>
        <button onClick={(e) => sendMessage()}>Send</button>
        <button onClick={(e) => disconnect()}>Disconnect</button>
        </>
      )
      }
    </div>
  );
};

export default WebSocketClient;