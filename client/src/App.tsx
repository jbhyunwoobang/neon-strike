/**
 * App.tsx — Application shell + screen router.
 *
 * Holds the WebGL canvas and every overlay screen. Owns the imperative Game and
 * Net instances (via refs) and translates UI intent into engine lifecycle:
 *   - Single Player  → new Game, start co-op-solo waves (no server).
 *   - Multiplayer    → connect Net, create/join room, lobby, then start the
 *                      Game when the server broadcasts `game:started`.
 *
 * The canvas is remounted (keyed) per match so each match gets a fresh WebGL
 * context, avoiding "context already in use" issues on restart.
 */

import { useEffect, useRef, useState } from 'react';
import { useStore, store } from './store';
import { Game, type StartOptions } from './engine/Game';
import { Net } from './engine/Net';
import type { GameMode } from './shared/protocol';
import { Intro } from './ui/Intro';
import { MainMenu } from './ui/MainMenu';
import { Loadout } from './ui/Loadout';
import { SettingsScreen } from './ui/Settings';
import { MultiplayerMenu } from './ui/MultiplayerMenu';
import { Lobby } from './ui/Lobby';
import { Hud } from './ui/HUD';
import { PauseMenu } from './ui/Pause';
import { GameOver } from './ui/GameOver';
import { Credits } from './ui/Credits';

const SERVER_URL =
  (import.meta as any).env?.VITE_SERVER_URL || `${location.protocol}//${location.hostname}:8080`;

export function App() {
  const screen = useStore((s) => s.screen);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const netRef = useRef<Net | null>(null);
  const pendingRef = useRef<StartOptions | null>(null);
  const [canvasKey, setCanvasKey] = useState(0);
  const [paused, setPaused] = useState(false);
  // In-match settings render as an overlay (switching screens would unmount
  // the canvas and kill the running match).
  const [showSettings, setShowSettings] = useState(false);

  // Deep-link support: /room/CODE prefills the join flow.
  const [deepCode] = useState(() => location.pathname.match(/\/room\/([A-Za-z0-9]+)/)?.[1]?.toUpperCase() ?? null);

  /* Start a match once the (re)mounted canvas is available. */
  useEffect(() => {
    if (!pendingRef.current || !canvasRef.current) return;
    const opts = pendingRef.current;
    pendingRef.current = null;
    const game = new Game(canvasRef.current);
    gameRef.current = game;
    setPaused(false);
    game.start(opts, () => store.get().setScreen('gameover'));
  }, [canvasKey]);

  /* Esc toggles the pause menu during play. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && store.get().screen === 'playing') {
        const g = gameRef.current;
        if (!g) return;
        if (g.paused) { g.resume(); setPaused(false); }
        else { g.pause(); setPaused(true); }
      }
      if (e.code === 'Tab' && store.get().screen === 'playing') e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function beginMatch(opts: StartOptions) {
    gameRef.current?.dispose();
    gameRef.current = null;
    pendingRef.current = opts;
    setCanvasKey((k) => k + 1);
    store.get().setScreen('playing');
  }

  /* ------------------------------ solo ------------------------------ */
  function startSolo() {
    store.get().setMode('coop');
    const { weapon, grenade, map } = store.get().loadout;
    beginMatch({ mode: 'coop', seed: (Math.random() * 1e9) | 0, startWeapon: weapon, grenade, theme: map });
  }

  /* --------------------------- multiplayer -------------------------- */
  async function ensureNet(): Promise<Net> {
    if (netRef.current?.connected) return netRef.current;
    const net = new Net(SERVER_URL);
    netRef.current = net;
    await net.connect();
    bindLobbyEvents(net);
    return net;
  }

  function bindLobbyEvents(net: Net) {
    net.on('room:snapshot', (snap) => {
      store.get().setMp({
        snapshot: snap, players: snap.players, roomCode: snap.code,
        isHost: snap.hostId === net.id,
      });
    });
    net.on('chat:line', (line) => store.get().pushChat(line));
    net.on('room:closed', () => { store.get().setMp({ error: 'Room closed' }); store.get().setScreen('mp-menu'); });
    net.on('game:started', ({ mode, seed, spawn }) => {
      beginMatch({ mode, seed, spawn, net });
    });
  }

  async function hostRoom(name: string, mode: GameMode) {
    try {
      const net = await ensureNet();
      store.get().setUsername(name);
      const code = await net.createRoom(name, mode);
      history.pushState({}, '', `/room/${code}`);
      store.get().setMp({ roomCode: code, isHost: true, error: null });
      store.get().setScreen('lobby');
    } catch (e: any) {
      store.get().setMp({ error: e?.message ?? 'Connection failed' });
    }
  }

  async function joinRoom(name: string, code: string) {
    try {
      const net = await ensureNet();
      store.get().setUsername(name);
      const snap = await net.joinRoom(name, code);
      history.pushState({}, '', `/room/${snap.code}`);
      store.get().setMp({ snapshot: snap, players: snap.players, roomCode: snap.code, isHost: snap.hostId === net.id, error: null });
      store.get().setScreen('lobby');
    } catch (e: any) {
      store.get().setMp({ error: e?.message ?? 'Could not join' });
    }
  }

  function leaveRoom() {
    netRef.current?.leaveRoom();
    store.get().resetMp();
    history.pushState({}, '', '/');
    store.get().setScreen('menu');
  }

  function backToMenu() {
    gameRef.current?.dispose();
    gameRef.current = null;
    netRef.current?.leaveRoom();
    store.get().resetMp();
    history.pushState({}, '', '/');
    store.get().setScreen('menu');
  }

  function resumeGame() { gameRef.current?.resume(); setPaused(false); setShowSettings(false); }
  function quitToMenu() { setPaused(false); setShowSettings(false); backToMenu(); }

  /* HUD top-right buttons (⚙ / EXIT) signal via window events — the HUD has
   * no handle on the game instance. */
  useEffect(() => {
    const onSettings = () => {
      if (store.get().screen !== 'playing') return;
      gameRef.current?.pause(); setPaused(true); setShowSettings(true);
    };
    const onQuit = () => { if (store.get().screen === 'playing') quitToMenu(); };
    window.addEventListener('ns:settings', onSettings);
    window.addEventListener('ns:quit', onQuit);
    return () => { window.removeEventListener('ns:settings', onSettings); window.removeEventListener('ns:quit', onQuit); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inGame = screen === 'playing' || screen === 'gameover';

  return (
    <>
      {inGame && <canvas key={canvasKey} ref={canvasRef} className="game" />}
      {screen === 'playing' && <div className="game-grain" />}

      {screen === 'intro' && <Intro onEnter={() => store.get().setScreen('menu')} />}

      {screen === 'menu' && (
        <MainMenu
          onSolo={() => store.get().setScreen('loadout')}
          onMultiplayer={() => store.get().setScreen('mp-menu')}
          onSettings={() => store.get().setScreen('settings')}
          onCredits={() => store.get().setScreen('credits')}
        />
      )}

      {screen === 'loadout' && (
        <Loadout onDeploy={startSolo} onBack={() => store.get().setScreen('menu')} />
      )}

      {screen === 'settings' && <SettingsScreen onBack={() => store.get().setScreen('menu')} />}
      {screen === 'credits' && <Credits onBack={() => store.get().setScreen('menu')} />}

      {screen === 'mp-menu' && (
        <MultiplayerMenu
          serverUrl={SERVER_URL}
          deepCode={deepCode}
          onHost={hostRoom}
          onJoin={joinRoom}
          onBack={() => store.get().setScreen('menu')}
        />
      )}

      {screen === 'lobby' && (
        <Lobby
          net={netRef.current}
          onStart={() => netRef.current?.startGame()}
          onLeave={leaveRoom}
        />
      )}

      {screen === 'playing' && (
        <>
          <Hud />
          {paused && !showSettings && <PauseMenu onResume={resumeGame} onSettings={() => setShowSettings(true)} onQuit={quitToMenu} />}
          {paused && showSettings && <SettingsScreen onBack={() => setShowSettings(false)} />}
        </>
      )}

      {screen === 'gameover' && (
        <GameOver
          game={gameRef.current}
          mode={store.get().mode}
          onRestart={() => { store.get().mode === 'coop' && !netRef.current?.connected ? startSolo() : backToMenu(); }}
          onMenu={backToMenu}
        />
      )}
    </>
  );
}
