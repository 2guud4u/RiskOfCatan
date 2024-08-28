import React, { useState, useEffect } from 'react';
import { socket } from './socket/socket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { Events } from "./components/Events";
import { MyForm } from './components/MyForm';
import StartMenu from './views/StartMenu';

export default function App() {

  

  return (
    <div className="App">
      
      <StartMenu />
    </div>
  );
}