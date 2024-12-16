import { Story } from "../types";

const url = "https://api.app.shortcut.com/api/v3/";

export class ShortcutService {
  private token: string;
    private headers: any;
  constructor(token: string) {
    this.token = token;
    this.headers = {
        'Content-Type': 'application/json',
        'Shortcut-Token': `${this.token}`
        };
  }

  async getStory(storyId: string): Promise<Story> {
    const response = await fetch(`${url}stories/${storyId}`, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      throw new Error(`Error fetching story: ${response.statusText}`);
    }

    return response.json() as Promise<Story>;
  }
}