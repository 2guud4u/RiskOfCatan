import React from 'react';
import { MyForm } from '../components/MyForm';
import {joinRoom, ListenForEvent} from '../socket/events';
import { socket } from '../socket/socket';
export default function StartMenu() {
    const [name, setName] = React.useState('');
    const [room, setRoom] = React.useState('');
    
    React.useEffect(() => {
        function onJoinedRoom(payload){
            console.log("recieved", payload);
            setRoom(payload.room);
        }
        socket.on("joinedRoom", onJoinedRoom);
        return () => {
          socket.off("joinedRoom", onJoinedRoom);
        };
      }, []);

    return (
        
        <div className="StartMenu">
        <div>Room: {room}</div>
        <h1>Start Menu</h1>
        <div>
        Join a room:
        </div>
        <MyForm submitAction={(room)=>{
            if(name){
                
                joinRoom(room, name)
            }
        }
            } />
        <div>
        name:
        </div>
        <MyForm submitAction={setName} />
        </div>
    );
}