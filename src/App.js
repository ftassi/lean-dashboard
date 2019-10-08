import React from 'react';
import './App.css';
import Trello from 'components/Trello';
import repository from "trello/repository";
import TimeToMarket from "./components/charts/TimeToMarket";

function App() {

  return <Trello fetch={t => repository(t).getTimeToMarket()}>
    {(data) => <TimeToMarket/>}
  </Trello>
}

export default App;
