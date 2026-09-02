import React, { useState, useEffect } from 'react';
import { GameState, PlayerProfile } from './types';
import { SpookyEnvironment } from './components/SpookyEnvironment';
import { GameHeader } from './components/GameHeader';
import { HomeScreen } from './components/HomeScreen';
import { IdentityScreen } from './components/IdentityScreen';
import { MissionSelectScreen } from './components/MissionSelectScreen';
import { Mission1Pairs } from './components/missions/Mission1Pairs';
import { Mission2Maze } from './components/missions/Mission2Maze';
import { Mission3Tracing } from './components/missions/Mission3Tracing';
import { Mission4LetterTracing } from './components/missions/Mission4LetterTracing';
import { Mission5Reading } from './components/missions/Mission5Reading';
import { VictoryCertificate } from './components/VictoryCertificate';
import { sound } from './utils/audio';

const STORAGE_KEY = 'kids_horror_adventure_state_v1';

const INITIAL_STATE: GameState = {
  player: null,
  currentScreen: 'home',
  unlockedMission: 1,
  completedMissions: [],
  score: 0,
  stars: 0,
  soundEnabled: true,
  musicEnabled: true,
  jumpscareEnabled: true,
};

export default function App() {
  const [state, setState] = useState<GameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
          currentScreen: parsed.player ? 'mission_select' : 'home',
        };
      }
    } catch {
      // ignore
    }
    return INITIAL_STATE;
  });

  const [triggerBoo, setTriggerBoo] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  // Sync sound settings
  useEffect(() => {
    sound.toggleSound(state.soundEnabled);
  }, [state.soundEnabled]);

  useEffect(() => {
    sound.toggleMusic(state.musicEnabled);
  }, [state.musicEnabled]);

  const handleToggleSound = () => {
    setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const handleToggleMusic = () => {
    setState((prev) => ({ ...prev, musicEnabled: !prev.musicEnabled }));
  };

  const handleToggleJumpscare = () => {
    setState((prev) => ({ ...prev, jumpscareEnabled: !prev.jumpscareEnabled }));
  };

  const handleSaveProfile = (profile: PlayerProfile) => {
    setState((prev) => ({
      ...prev,
      player: profile,
      currentScreen: 'mission_select',
    }));
  };

  const handleSelectMission = (missionNum: number) => {
    setState((prev) => ({
      ...prev,
      currentScreen: `mission_${missionNum}` as GameState['currentScreen'],
    }));
  };

  const handleMissionComplete = (missionNum: number, starsEarned: number, scoreEarned: number) => {
    setState((prev) => {
      const newCompleted = prev.completedMissions.includes(missionNum)
        ? prev.completedMissions
        : [...prev.completedMissions, missionNum];

      const nextUnlocked = Math.max(prev.unlockedMission, Math.min(5, missionNum + 1));
      const newScore = prev.score + scoreEarned;
      const newStars = prev.stars + starsEarned;

      const allDone = newCompleted.length >= 5;

      return {
        ...prev,
        completedMissions: newCompleted,
        unlockedMission: nextUnlocked,
        score: allDone && !prev.completionDate ? newScore + 100 : newScore,
        stars: newStars,
        completionDate: allDone && !prev.completionDate
          ? new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
          : prev.completionDate,
      };
    });
  };

  const handleTriggerJumpscare = () => {
    if (state.jumpscareEnabled) {
      sound.playJumpscare();
      setTriggerBoo(true);
    }
  };

  const handleResetAdventure = () => {
    setState((prev) => ({
      ...prev,
      unlockedMission: 1,
      completedMissions: [],
      score: 0,
      stars: 0,
      currentScreen: 'mission_select',
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-x-hidden selection:bg-purple-600 selection:text-white">
      {/* Ambient Spooky Environment Layer */}
      <SpookyEnvironment
        triggerJumpscare={triggerBoo}
        onJumpscareEnd={() => setTriggerBoo(false)}
        jumpscareEnabled={state.jumpscareEnabled}
      />

      {/* Game Header (visible when not on Home Screen) */}
      {state.currentScreen !== 'home' && (
        <GameHeader
          state={state}
          onNavigateHome={() => setState((p) => ({ ...p, currentScreen: 'home' }))}
          onNavigateBack={() => {
            if (state.currentScreen.startsWith('mission_') && state.currentScreen !== 'mission_select') {
              setState((p) => ({ ...p, currentScreen: 'mission_select' }));
            } else if (state.currentScreen === 'victory' || state.currentScreen === 'certificate') {
              setState((p) => ({ ...p, currentScreen: 'mission_select' }));
            } else if (state.currentScreen === 'identity') {
              setState((p) => ({ ...p, currentScreen: 'home' }));
            }
          }}
          onToggleSound={handleToggleSound}
          onToggleMusic={handleToggleMusic}
          onToggleJumpscare={handleToggleJumpscare}
          showBack={state.currentScreen !== 'mission_select' && state.currentScreen !== 'home'}
        />
      )}

      {/* Screen Views */}
      <main className="flex-1 flex flex-col justify-center">
        {state.currentScreen === 'home' && (
          <HomeScreen
            onStart={() => {
              if (state.player) {
                setState((p) => ({ ...p, currentScreen: 'mission_select' }));
              } else {
                setState((p) => ({ ...p, currentScreen: 'identity' }));
              }
            }}
            soundEnabled={state.soundEnabled}
            musicEnabled={state.musicEnabled}
            onToggleSound={handleToggleSound}
            onToggleMusic={handleToggleMusic}
          />
        )}

        {state.currentScreen === 'identity' && (
          <IdentityScreen
            initialName={state.player?.name}
            initialCharacter={state.player?.characterId}
            onSaveProfile={handleSaveProfile}
          />
        )}

        {state.currentScreen === 'mission_select' && (
          <MissionSelectScreen
            state={state}
            onSelectMission={handleSelectMission}
            onViewCertificate={() => setState((p) => ({ ...p, currentScreen: 'victory' }))}
          />
        )}

        {state.currentScreen === 'mission_1' && (
          <Mission1Pairs
            onComplete={(stars, score) => handleMissionComplete(1, stars, score)}
            onNextMission={() => handleSelectMission(2)}
            triggerJumpscare={handleTriggerJumpscare}
          />
        )}

        {state.currentScreen === 'mission_2' && (
          <Mission2Maze
            onComplete={(stars, score) => handleMissionComplete(2, stars, score)}
            onNextMission={() => handleSelectMission(3)}
          />
        )}

        {state.currentScreen === 'mission_3' && (
          <Mission3Tracing
            onComplete={(stars, score) => handleMissionComplete(3, stars, score)}
            onNextMission={() => handleSelectMission(4)}
          />
        )}

        {state.currentScreen === 'mission_4' && (
          <Mission4LetterTracing
            onComplete={(stars, score) => handleMissionComplete(4, stars, score)}
            onNextMission={() => handleSelectMission(5)}
          />
        )}

        {state.currentScreen === 'mission_5' && (
          <Mission5Reading
            onComplete={(stars, score) => handleMissionComplete(5, stars, score)}
            onFinishAdventure={() => setState((p) => ({ ...p, currentScreen: 'victory' }))}
          />
        )}

        {state.currentScreen === 'victory' && (
          <VictoryCertificate
            state={state}
            onPlayAgain={handleResetAdventure}
            onGoHome={() => setState((p) => ({ ...p, currentScreen: 'home' }))}
          />
        )}
      </main>
    </div>
  );
}
