import { useState } from 'react';
import { fetchUserActivity } from './utils/githubApi';
import { analyzeActivityStats, generatePersonalityProfile } from './utils/analyzer';
import Profile from './components/Profile';
import ActivityList from './components/ActivityList';
import Stars from './components/Stars';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const evs = await fetchUserActivity(username);
      setEvents(evs);
      const st = analyzeActivityStats(evs);
      setStats(st);
      setProfile(generatePersonalityProfile(st));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <>
  <Stars />
  <div className="app-container">
    
    <h1 className="app-title">Github Personality analyzer</h1>

    <div>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Enter Github username"
        className="app-input"
      />
      <button
        onClick={handleFetch}
        disabled={loading || !username}
        className="app-button"
      >
        {loading ? 'Loading...' : 'Analyze'}
      </button>
    </div>

    {error && <p className="app-error">{error}</p>}
    {profile && stats && <Profile profile={profile} stats={stats} />}
    {events.length > 0 && <ActivityList events={events} />}
      <footer className="signature">
  <a 
    href="https://github.com/delaklo/github-personality" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    <span className="sig-mark">⌘</span> Source on Github
  </a>
      </footer>
  </div>
  </>
);

}

export default App;
