export interface User {
  id: number;
  name: string;
  about: string | null;
  points: number;
}

export interface UserCreationData {
  name: string;
  about?: string;
  points?: number;
}
