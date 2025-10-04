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
  historyId?: string; // Will be assigned by Firestore upon saving
  inputDetails: {
    topic: string;
    tone: string;
    platform: string;
  };
}

export interface User {
    uid: string;
    name: string;
    email: string;
    avatar: string;
}