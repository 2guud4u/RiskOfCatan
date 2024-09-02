import React, { useState, useEffect } from 'react';
import { socket } from './socket/socket';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { Events } from "./components/Events";
import { MyForm } from './components/MyForm';
import StartMenu from './views/StartMenu';
import Canvas from './components/Canvas';
export default function App() {
  let hexes = [
    { x: -3, y: 0, z: 3 },  { x: -3, y: 1, z: 2 },
    { x: -3, y: 2, z: 1 },  { x: -3, y: 3, z: 0 },
    { x: -2, y: -1, z: 3 }, { x: -2, y: 0, z: 2 },
    { x: -2, y: 1, z: 1 },  { x: -2, y: 2, z: 0 },
    { x: -2, y: 3, z: -1 }, { x: -1, y: -2, z: 3 },
    { x: -1, y: -1, z: 2 }, { x: -1, y: 0, z: 1 },
    { x: -1, y: 1, z: 0 },  { x: -1, y: 2, z: -1 },
    { x: -1, y: 3, z: -2 }, { x: 0, y: -3, z: 3 },
    { x: 0, y: -2, z: 2 },  { x: 0, y: -1, z: 1 },
    { x: 0, y: 0, z: -0 },  { x: 0, y: 1, z: -1 },
    { x: 0, y: 2, z: -2 },  { x: 0, y: 3, z: -3 },
    { x: 1, y: -3, z: 2 },  { x: 1, y: -2, z: 1 },
    { x: 1, y: -1, z: 0 },  { x: 1, y: 0, z: -1 },
    { x: 1, y: 1, z: -2 },  { x: 1, y: 2, z: -3 },
    { x: 2, y: -3, z: 1 },  { x: 2, y: -2, z: 0 },
    { x: 2, y: -1, z: -1 }, { x: 2, y: 0, z: -2 },
    { x: 2, y: 1, z: -3 },  { x: 3, y: -3, z: 0 },
    { x: 3, y: -2, z: -1 }, { x: 3, y: -1, z: -2 },
    { x: 3, y: 0, z: -3 }
  ];
  

  return (
    <div className="App">
      
      <StartMenu />
     
    </div>
  );
}