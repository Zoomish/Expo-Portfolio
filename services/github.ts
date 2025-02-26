import axios from 'axios';

const GITHUB_API = 'https://api.github.com';
const USERNAME = 'Zoomish';

export interface GithubUser {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  html_url: string;
}

export interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  topics: string[];
  stargazers_count: number;
  language: string;
  updated_at: string;
  license: {
    name: string;
  } | null;
}

const githubToken = process.env.EXPO_PUBLIC_GITHUB_TOKEN;

export const getUser = async (): Promise<GithubUser> => {
  const { data } = await axios.get(`${GITHUB_API}/users/${USERNAME}`, {
    headers: {
      Authorization: `token ${githubToken}`,
    },
  });
  return data;
};

export const getRepositories = async (): Promise<Repository[]> => {
  const { data } = await axios.get(
    `${GITHUB_API}/users/${USERNAME}/repos?sort=updated&direction=desc`,
    {
      headers: {
        Authorization: `token ${githubToken}`,
      },
    }
  );
  return data;
};

export const getRepository = async (name: string): Promise<Repository> => {
  const { data } = await axios.get(`${GITHUB_API}/repos/${USERNAME}/${name}`, {
    headers: {
      Authorization: `token ${githubToken}`,
    },
  });
  return data;
};

export const getReadme = async (name: string): Promise<string> => {
  try {
    const { data } = await axios.get(
      `${GITHUB_API}/repos/${USERNAME}/${name}/readme`,
      {
        headers: {
          Accept: 'application/vnd.github.raw',
          Authorization: `token ${githubToken}`,
        },
      }
    );
    return data;
  } catch (error) {
    return '';
  }
};

export const getLanguages = async (
  name: string
): Promise<Record<string, number>> => {
  const { data } = await axios.get(
    `${GITHUB_API}/repos/${USERNAME}/${name}/languages`,
    {
      headers: {
        Authorization: `token ${githubToken}`,
      },
    }
  );
  return data;
};

export const getContributors = async (name: string): Promise<any[]> => {
  const { data } = await axios.get(
    `${GITHUB_API}/repos/${USERNAME}/${name}/contributors`,
    {
      headers: {
        Authorization: `token ${githubToken}`,
      },
    }
  );
  return data;
};
