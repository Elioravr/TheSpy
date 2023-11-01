import { useState, useEffect } from 'react';

import data from './places.json';
import './App.scss';

const HOW_MANY_STAGE = 'how_many';
const GAME_STAGE = 'game';

let placesUsed = [];

function App() {
  const [stage, setStage] = useState(null);
  const [numberOfPlayers, setNumberOfPlayers] = useState('');
  const [players, setPlayers] = useState([]);
  const [spyIndex, setSpyIndex] = useState(null);
  const [openedIndexes, setOpenedIndexes] = useState([]);
  const [isPlaceModalOpen, setIsPlacesModalOpen] = useState(false);
  const [currentPlayerWatching, setCurrentPlayerWatching] = useState(null);
  const [currentPlace, setCurrentPlace] = useState('');
  const { places } = data;

  useEffect(() => {
    setTimeout(() => setStage(HOW_MANY_STAGE), 200);
  }, [setStage]);

  const handleNumberOfPlayersChamge = (e) => {
    setNumberOfPlayers(e.target.value);
  };

  const handleStartGameClick = () => {
    const playersAccordingToRequest = [];

    for (let i = 0; i < numberOfPlayers; i++) {
      playersAccordingToRequest.push(`שחקן ${i + 1}`);
    }

    const randomSpyIndex = Math.ceil(Math.random() * numberOfPlayers);
    setSpyIndex(randomSpyIndex - 1);
    setPlayers(playersAccordingToRequest);

    const place = getNewPlace();
    setCurrentPlace(place);

    setStage(GAME_STAGE);
  };

  const getNewPlace = () => {
    const randomPlaceIndex = Math.ceil(Math.random() * places.length);
    let place = places[randomPlaceIndex - 1];

    if (placesUsed.includes(place)) {
      place = getNewPlace();
    }

    placesUsed.push(place);

    if (placesUsed.length === places.length) {
      placesUsed = [];
    }
    return place;
  };

  const createHandlePlayerClicked = (playerIndex) => {
    return () => {
      setOpenedIndexes([...openedIndexes, playerIndex]);
      setIsPlacesModalOpen(true);
      setCurrentPlayerWatching(playerIndex);
    };
  };

  const closeModal = () => {
    setIsPlacesModalOpen(false);
  };

  const startNewGame = () => {
    const randomSpyIndex = Math.ceil(Math.random() * numberOfPlayers);
    setSpyIndex(randomSpyIndex - 1);

    const place = getNewPlace();
    setCurrentPlace(place);

    setOpenedIndexes([]);
  };

  const changeNumberOfPlayers = () => {
    setStage(HOW_MANY_STAGE);
    setNumberOfPlayers('');
    startNewGame();
  };

  return (
    <div className='App'>
      <div className='header'>
        <span className='icon rotate-icon'>👀</span> המרגל{' '}
        <span className='icon'>👀</span>
      </div>

      <Stage currentStage={stage} stage={HOW_MANY_STAGE} title='כמה שחקנים?'>
        <input
          value={numberOfPlayers}
          onChange={handleNumberOfPlayersChamge}
          className='players-input'
          type='number'
        />
        <div
          className={`start-game-button ${
            numberOfPlayers !== '' ? 'visible' : ''
          }`}
          onClick={handleStartGameClick}
        >
          התחל משחק
        </div>
      </Stage>

      <Stage currentStage={stage} stage={GAME_STAGE} title='בחר שחקן'>
        <>
          {players.map((player, index) => {
            return (
              <div
                className={`player-button ${
                  openedIndexes.includes(index) ? 'clicked' : ''
                }`}
                onClick={createHandlePlayerClicked(index)}
              >
                {player}
              </div>
            );
          })}
          <div className='game-button new-game-button' onClick={startNewGame}>
            משחק חדש
          </div>
          <div
            className='game-button change-number-of-players-container'
            onClick={changeNumberOfPlayers}
          >
            שנה כמות שחקנים
          </div>
        </>
      </Stage>

      <div
        className={`places-modal-overlay ${isPlaceModalOpen ? 'visible' : ''}`}
        onClick={closeModal}
      >
        <div className='modal'>
          <div className='title'>המקום הוא:</div>
          <div className='place'>
            {currentPlayerWatching === spyIndex ? '????????' : currentPlace}
          </div>
          <div className='close-button' onClick={closeModal}>
            ראיתי, אפשר לסגור
          </div>
          <div className='spy spy-1'>{'🕵️‍♀️'}</div>
          <div className='spy spy-2'>{'🕵️‍♀️'}</div>
          <div className='spy spy-3'>{'🕵️‍♀️'}</div>
          <div className='spy spy-4'>{'🕵️‍♀️'}</div>
        </div>
      </div>

      <div className='copyrights-container'>Elior Abramoviz ©</div>
    </div>
  );
}

const Stage = ({ title, children, stage, currentStage }) => {
  return (
    <div className={`section ${currentStage === stage ? 'visible' : ''}`}>
      <div className='title'>{title}</div>
      {children}
    </div>
  );
};

export default App;
