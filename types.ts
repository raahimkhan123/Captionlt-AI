
export enum Screen {
  Home = 'Home',
  History = 'History',
  Profile = 'Profile',
  Pricing = 'Pricing',
}

export interface GeminiResponse {
  captions: string[];
  hashtags: string[];
}

export interface CaptionResult extends GeminiResponse {
  historyId: string;
  inputDetails: {
    topic: string;
    tone: string;
    platform: string;
  };
}

export interface User {
    name: string;
    email: string;
    avatar: string;
}
