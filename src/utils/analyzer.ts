
import type { GitHubEvent } from './githubApi';

export interface ActivityStats {
  totalEvents: number;
  eventTypes: { [key: string]: number };
  timeDistribution: { [hour: number]: number };
  repositories: Set<string>;
}

export interface PersonalityProfile {
  primaryType: string;
  secondaryType: string;
  score: number;
  traits: string[];
}

export function analyzeActivityStats(events: GitHubEvent[]): ActivityStats {
  const stats: ActivityStats = {
    totalEvents: events.length,
    eventTypes: {},
    timeDistribution: {},
    repositories: new Set(),
  };

  events.forEach(event => {
    stats.eventTypes[event.type] = (stats.eventTypes[event.type] || 0) + 1;
    stats.repositories.add(event.repo.name);

    const hour = new Date(event.created_at).getHours();
    stats.timeDistribution[hour] = (stats.timeDistribution[hour] || 0) + 1;
  });

  return stats;
}

export function generatePersonalityProfile(stats: ActivityStats): PersonalityProfile {
  const profiles = [
    {
      type: 'Night Coder',
      check: () => {
        const nightHours = [22, 23, 0, 1, 2, 3, 4, 5];
        const nightActivity = nightHours.reduce((s, h) => s + (stats.timeDistribution[h] || 0), 0);
        return nightActivity / stats.totalEvents > 0.3;
      },
      traits: ['Night owl', 'Coffee dependent', 'Deep focus sessions'],
    },
    {
      type: 'Commit Machine',
      check: () => (stats.eventTypes['PushEvent'] || 0) / stats.totalEvents > 0.4,
      traits: ['Productive coder', 'Consistent contributor', 'Fast developer'],
    },
    {
      type: 'PR Maestro',
      check: () => (stats.eventTypes['PullRequestEvent'] || 0) / stats.totalEvents > 0.25,
      traits: ['Collaboration expert', 'Code reviewer', 'Feature driver'],
    },
  ];

  const matches = profiles.filter(p => p.check());
  if (matches.length === 0) {
    return {
      primaryType: 'Balanced Developer',
      secondaryType: '',
      score: 0.5,
      traits: ['Balanced approach', 'Versatile', 'Adaptive'],
    };
  }
  return {
    primaryType: matches[0].type,
    secondaryType: matches[1]?.type || '',
    score: 0.8,
    traits: matches[0].traits,
  };
}
export function formatActivity(event: GitHubEvent): string {
  const repo = event.repo.name;
  switch (event.type) {
    case 'PushEvent':
      const commits = event.payload.commits?.length || 0;
      return `Pushed ${commits} commit(s) to ${repo}`;
    case 'IssuesEvent':
      return `Worked on issues in ${repo}`;
    case 'PullRequestEvent':
      return `Worked on PRs in ${repo}`;
    case 'WatchEvent':
      return `Starred ${repo}`;
    case 'ForkEvent':
      return `Forked ${repo}`;
    default:
      return `${event.type.replace('Event', '')} in ${repo}`;
  }
}
