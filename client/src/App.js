import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';
import Chart from './component/Chart';

const socket = io.connect("http://localhost:3001");

function App() {
  const [userName, Setusername] = useState("");
  const [room, Setroom] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const joinRoom = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  }

  return (
    <div className="App flex justify-center items-center w-full h-dvh">
      {!showChat ?
        (<div className="room-socket flex justify-center flex-col items-center gap-2 w-[200px]">
          <h2>
           Let's chart
          </h2>
          <input className='p-2 border border-indigo-500' type="text" placeholder="name" onChange={(e) => { Setusername(e.target.value) }} />

          <input className='p-2 border border-indigo-500' type="text" placeholder="room" onChange={(e) => { Setroom(e.target.value) }}  ></input>
          <button className='bg-indigo-300 px-3 py-2 w-full rounded' onClick={joinRoom}  >submit</button>
        </div>) : (
          <Chart socket={socket} userName={userName} room={room} />
        )
      }

    </div>
  );
}

export default App;
