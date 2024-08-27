import { useParams } from 'react-router-dom';

export default function GameRoom() {
  const { gameId } = useParams();
  return (
    <div className="GameRoom">
      <h1>Game Room</h1>
      <div>{gameId}</div>
    </div>
  );
}