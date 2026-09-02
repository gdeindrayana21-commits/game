export type CharacterId = 'dracula' | 'zombie' | 'hantu' | 'skeleton';

export interface Character {
  id: CharacterId;
  name: string;
  title: string;
  emoji: string;
  quote: string;
  color: string;
  accentColor: string;
}

export interface PlayerProfile {
  name: string;
  characterId: CharacterId;
}

export interface GameState {
  player: PlayerProfile | null;
  currentScreen: 
    | 'home'
    | 'identity'
    | 'mission_select'
    | 'mission_1'
    | 'mission_2'
    | 'mission_3'
    | 'mission_4'
    | 'mission_5'
    | 'victory'
    | 'certificate';
  unlockedMission: number; // 1 to 5
  completedMissions: number[];
  score: number;
  stars: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  jumpscareEnabled: boolean;
  completionDate?: string;
}
