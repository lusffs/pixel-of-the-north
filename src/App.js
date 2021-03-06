import "./App.css";
import { useEffect, useState } from "react";
import Papa from "papaparse";

function App() {
  const [gameList, setGameList] = useState([]);
  const [selectedSystems, setSelectedSystems] = useState([]);
  const [randomGame, setRandomGame] = useState(null);
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

    setRandomGame(`${randomGame["Title"]} (${randomGame["Platform"]})`);
    //alert(`${randomGame["Title"]} (${randomGame["Platform"]})`);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pixels of the North</h1>
        <img id={"logo"} src={"/avatar.png"} className="App-logo" alt="logo" />
        <p>{`${gameList.length} games spread out on ${
          systemKeys().length
        } different systems!`}</p>
        <button className="random-button" onClick={randomPick}>
          RANDOMIZE!
        </button>
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

      {randomGame && (
        <div
          className="game-overlay"
          onClick={() => {
            setRandomGame(null);
          }}
        >
          <div className="game-popup">
            <p className="game-title">{randomGame}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
