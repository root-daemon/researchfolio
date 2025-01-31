// Basic language details for repositories
interface Language {
  name: string;
  color: string;
}

interface LanguageEdge {
  size: number;
  node: Language;
}

interface LanguageConnection {
  totalSize: number;
  edges: LanguageEdge[];
}

// User's social accounts
interface SocialAccount {
  provider: string;
  displayName: string;
  url: string;
}

interface SocialAccountConnection {
  nodes: SocialAccount[];
}

// Contribution details
interface ContributionsCollection {
  totalCommitContributions: number;
  totalPullRequestContributions: number;
  totalIssueContributions: number;
  contributionCalendar: {
    totalContributions: number;
  };
  totalRepositoriesWithContributedCommits: number;
}

// Repository details
export interface Repository {
  name: string;
  stargazerCount: number;
  stargazers: {
    totalCount: number;
  };
  openGraphImageUrl: string;
  forkCount: number;
  updatedAt: string;
  url: string;
  description: string;
  languages: LanguageConnection;
}

// Followers, issues, and pull requests count
interface Count {
  totalCount: number;
}

// Main User interface
interface User {
  name: string;
  bio: string;
  socialAccounts: SocialAccountConnection;
  contributionsCollection: ContributionsCollection;
  issues: Count;
  pullRequests: Count;
  followers: Count;
  repositories: {
    edges: Array<RepoEdges>;
    nodes: Repository[];
  };
}

export interface RepoEdges {
    node: {
      languages: LanguageConnection;
    };
  }

// Main query result interface
export interface GitHubQueryResponse {
  data: { user: User };
}
