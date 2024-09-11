import { useParams, useLocation } from 'react-router-dom';
import React from 'react';
import { socket } from '../socket/socket';
import { MyForm } from '../components/MyForm';

export default function GameRoom() {
  const { roomId } = useParams();
  const location = useLocation();
  const { prop } = location.state || {};
  const [playerList, setPlayerList] = React.useState([]);
  const [name, setName] = React.useState('');

  const updatePlayerList = React.useCallback((payload) => {
    console.log("updatePlayerList", payload);
    setPlayerList(payload.players);
  }
  , []);

  const addPlayer = (name) => {
    socket.emit("addPlayer", {name: name, room: roomId});
    setName(name);
  }
  //on mount
  React.useEffect(() => {
    
    socket.on("updatePlayerList", updatePlayerList);

    return () => {
      socket.off("updatePlayerList", updatePlayerList);
    };

  }, []);

  return (
    <div className="GameRoom">
      
      {
        name ? (
          <>
      <h1>Game Room</h1>
      <div>{roomId}</div>
      <div>PlayerList</div>
      <div>
        {playerList.map((player) => (
          <div>{player.name}</div>
        ))}
      </div>
      </>
        ) : (<>
          <>Enter Name:</>
          <MyForm submitAction={addPlayer} />
        </>)
}
      
     
    </div>
  );
}