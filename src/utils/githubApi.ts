
export interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string; url: string };
  payload: any;
  created_at: string;
}

export async function fetchUserActivity(username: string): Promise<GitHubEvent[]> {
  const response = await fetch(`https://api.github.com/users/${username}/events`, {
    headers: {
      'User-Agent': 'github-personality-web',
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (response.status === 404) {
    throw new Error(`User '${username}' not found`);
  }
  if (!response.ok) {
    throw new Error(`GitHub API returned status ${response.status}`);
  }

  return await response.json();
}//easier
