
import type { GitHubEvent } from '../utils/githubApi';
import { formatActivity } from '../utils/analyzer';

interface Props {
  events: GitHubEvent[];
}

export default function ActivityList({ events }: Props) {
  return (
    <div className="app-card">
      <h2 className="section-title">Recent activity</h2>
      <ul className="app-list">
        {events.slice(0, 10).map(ev => (
          <li key={ev.id}>{formatActivity(ev)}</li>
        ))}
      </ul>
    </div>
  );
}
