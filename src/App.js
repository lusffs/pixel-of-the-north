import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import Papa from "papaparse";

function App() {
  const [gameList, setGameList] = useState([]);
  const [selectedSystems, setSelectedSystems] = useState([]);

  useEffect(() => {
    Papa.parse("/data/game-list.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setGameList(results.data);
      },
    });
  }, []);

  const systemKeys = () => {
    if (!gameList.length) {
      return [];
    }

    let systems = [];
    for (let i = 0; i < gameList.length; i++) {
      const game = gameList[i];

      if (!game["Platform"]) {
        continue;
      }

      if (systems.indexOf(game["Platform"]) === -1) {
        systems.push(game["Platform"]);
      }
    }
    return systems;
  };

  const handleSystemSelect = (e) => {
    const systems = JSON.parse(JSON.stringify(selectedSystems));

    if (selectedSystems.indexOf(e.target.value) === -1) {
      systems.push(e.target.value);
    } else {
      systems.splice(systems.indexOf(e.target.value), 1);
    }

    setSelectedSystems(systems);
  };

  const selectAll = () => {
    setSelectedSystems(systemKeys());
  };

  const deselectAll = () => {
    setSelectedSystems([]);
  };

  const randomPick = () => {
    if (selectedSystems.length === 0) {
      alert("No systems selected");
      return;
    }
    const filteredGames = gameList.filter((game) => {
      return selectedSystems.indexOf(game["Platform"]) > -1;
    });

    if (filteredGames.length === 0) {
      alert("No games for the selected platform");
      return;
    }

    const randomIndex = Math.floor(Math.random() * filteredGames.length);
    const randomGame = filteredGames[randomIndex];
    alert(`${randomGame["Title"]} (${randomGame["Platform"]})`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{`Total games: ${gameList.length} on ${
          systemKeys().length
        } number of systems`}</p>
      </header>
      <div>
        {systemKeys()
          .sort()
          .map((system, index) => {
            return (
              <label key={system + index}>
                <input
                  value={system}
                  checked={selectedSystems.includes(system)}
                  onChange={handleSystemSelect}
                  type="checkbox"
                />
                {system}
              </label>
            );
          })}
      </div>
      <div>
        {/* <select>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select> */}
        <button onClick={selectAll}>Select all</button>
        <button onClick={deselectAll}>Deselect all</button>
        <button onClick={randomPick}>Random pick</button>
      </div>
    </div>
  );
}

export default App;
