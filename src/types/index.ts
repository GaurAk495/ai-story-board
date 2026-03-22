export type Character = {
  id: string;
  name: string;
  description: string;
  appearance: string;
  personality: string;
};

export type Scene = {
  id: string;
  title: string;
  description: string;
  scriptLine: string;
  location: string;
  time: string;
  characters: string[];
  emotion: string;
  camera: string;
  visualStyle?: string;
  imagePrompt: string;
  imageUrl?: string;
  audioText?: string;
};

export type Story = {
  title: string;
  genre: string;
  tone: string;
  content: string;
};
