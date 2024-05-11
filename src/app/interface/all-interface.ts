export interface Users {
  avatar_url: string;
  events_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  gravatar_id: string;
  html_url: string;
  id: number;
  login: string;
  node_id: string;
  organizations_url: string;
  received_events_url: string;
  repos_url: string;
  score: number;
  site_admin: boolean;
  starred_url: string;
  subscriptions_url: string;
  type: string;
  url: string;
}

export interface GitHubUserInterface {
  public_repos: number;
  followers: number;
  location: string;
  html_url: string;
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
}

export interface ApiResponse<data> {
  incomplete_results: boolean;
  items: data;
  total_count: number;
}

export interface DataConfig {
  userName: string;
  perPage: number | null;
  page: number | null;
}

export interface Repos {
  html_url: string;
  name: string;
  description: string;
}
