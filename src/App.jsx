import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [mode, setMode] = useState('pomodoro');
  const [customDurations, setCustomDurations] = useState({
    pomodoro: 25,
    break: 5,
    longBreak: 10,
    custom: 5,
  });
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSound, setSelectedSound] = useState('https://www.soundjay.com/button/beep-07.wav');
  const [booting, setBooting] = useState(true);
  const [showStartMenu, setShowStartMenu] = useState(false);

  const audio = new Audio(selectedSound);

  useEffect(() => {
    const timeout = setTimeout(() => setBooting(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setPomodoroCount((prev) => prev + 1);
      audio.play();
      alert('Timer complete!');
      setTimeLeft(customDurations[mode] * 60);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, customDurations, selectedSound]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleModeChange = (m) => {
    setMode(m);
    setIsRunning(false);
    const duration = customDurations[m] > 0 ? customDurations[m] : 1;
    setTimeLeft(duration * 60);
  };

  const applySettings = () => {
    setShowSettings(false);
    setTimeLeft(customDurations[mode] * 60);
  };

  if (booting) {
    return (
      <div className="boot-screen">
        <div className="boot-text">Booting Pomowave ...</div>
      </div>
    );
  }

  return (
    <div className="retro-ui">
      <header className="title-bar">
        <h1 className="title-text">Pomowave</h1>
      </header>

      <div className="window main-window">
        <div className="window-header">
          <div className="window-title">🖥️ Pomodoro Timer</div>
          <div className="window-controls">
            <button className="settings-btn" onClick={() => setShowSettings(true)}>⚙️</button>
          </div>
        </div>

        <div className="window-body">
          <div className="center-section">
            <div className="modes center-modes">
              {['pomodoro', 'break', 'longBreak', 'custom'].map((m) => (
                <button
                  key={m}
                  className={`mode-btn ${mode === m ? 'active' : ''}`}
                  onClick={() => handleModeChange(m)}
                >
                  {m === 'pomodoro' ? '🍅 Pomodoro' : m === 'break' ? '☕ Break' : m === 'longBreak' ? '🎮 Long Break' : '⏲️ Custom'}
                </button>
              ))}
            </div>

            <div className="timer-display">{formatTime(timeLeft)}</div>

            <div className="controls">
              <button onClick={() => setIsRunning(true)}>▶ Start</button>
              <button onClick={() => setIsRunning(false)}>⏸ Pause</button>
              <button onClick={() => handleModeChange(mode)}>🔁 Reset</button>
            </div>

            <p className="pomodoro-count">🍅 Pomodoros completed: {pomodoroCount}</p>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="popup">
          <div className="popup-window">
            <div className="popup-header">
              <span>🛠 Settings</span>
              <button onClick={() => setShowSettings(false)}>❌</button>
            </div>

            <div className="popup-body">
              <label>🔔 Notification Sound</label>
              <select
                value={selectedSound}
                onChange={(e) => setSelectedSound(e.target.value)}
              >
                <option value="https://www.soundjay.com/button/beep-07.wav">Beep</option>
                <option value="https://www.soundjay.com/button/beep-08b.wav">Click</option>
                <option value="https://www.soundjay.com/button/button-3.wav">Ding</option>
              </select>

              {['pomodoro', 'break', 'longBreak', 'custom'].map((type) => (
                <div key={type}>
                  <label>{type} duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={customDurations[type]}
                    onChange={(e) =>
                      setCustomDurations((prev) => ({
                        ...prev,
                        [type]: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              ))}
              <button className="save-btn" onClick={applySettings}>💾 Save</button>
            </div>
          </div>
        </div>
      )}

      <footer className="taskbar">
        <div className="taskbar-time">🕒 {formatTime(timeLeft)}</div>
      </footer>
    </div>
  );
}

export default App;
