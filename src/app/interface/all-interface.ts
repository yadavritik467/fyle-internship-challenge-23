export interface Users {
  avatar_url: string;
  login:string
  
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
