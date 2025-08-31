
import type { PersonalityProfile, ActivityStats } from '../utils/analyzer';

interface Props {
  profile: PersonalityProfile;
  stats: ActivityStats;
}

export default function Profile({ profile, stats }: Props) {
return (
    <div className="app-card">
      <h2 className="section-title">Developer personality profile</h2>
      <p><strong>Primary:</strong> {profile.primaryType}</p>
      {profile.secondaryType && <p><strong>Secondary:</strong> {profile.secondaryType}</p>}
      <p><strong>Confidence:</strong> {(profile.score * 100).toFixed(1)}%</p>

      <h3 className="section-title">Traits</h3>
      <ul className="app-list">
        {profile.traits.map((t, i) => <li key={i}>{t}</li>)}
      </ul>

      <h3 className="section-title">Top Activities</h3>
      <ul className="app-list">
        {Object.entries(stats.eventTypes).slice(0, 5).map(([k, v]) => (
          <li key={k}>{k.replace('Event', '')}: {v}</li>
        ))}
      </ul>
    </div>
  );
}
