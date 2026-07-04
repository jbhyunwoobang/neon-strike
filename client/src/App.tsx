/**
 * App.tsx — Application shell + screen router (single-player).
 *
 * Holds the WebGL canvas and every overlay screen. Owns the imperative Game
 * instance (via ref) and translates UI intent into engine lifecycle. The canvas
 * is remounted (keyed) per match so each match gets a fresh WebGL context,
 * avoiding "context already in use" issues on restart.
 */

import { useEffect, useRef, useState } from 'react';
import { useStore, store } from './store';
import { Game, type StartOptions } from './engine/Game';
import { ProvingGame } from './content/proving/ProvingGame';
import { Intro } from './ui/Intro';
import { MainMenu } from './ui/MainMenu';
import { Loadout } from './ui/Loadout';
import { SettingsScreen } from './ui/Settings';
import { Hud } from './ui/HUD';
import { PauseMenu } from './ui/Pause';
import { GameOver } from './ui/GameOver';
import { Credits } from './ui/Credits';

export function App() {
  const screen = useStore((s) => s.screen);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const provingRef = useRef<ProvingGame | null>(null);
  const pendingRef = useRef<StartOptions | null>(null);
  const pendingProvingRef = useRef(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const [paused, setPaused] = useState(false);
  // In-match settings render as an overlay (switching screens would unmount
  // the canvas and kill the running match).
  const [showSettings, setShowSettings] = useState(false);

  /* Start a match once the (re)mounted canvas is available. */
  useEffect(() => {
    if (!canvasRef.current) return;
    if (pendingProvingRef.current) {
      pendingProvingRef.current = false;
      const pg = new ProvingGame(canvasRef.current);
      provingRef.current = pg;
      setPaused(false);
      pg.start(() => backToMenu());
      return;
    }
    if (!pendingRef.current) return;
    const opts = pendingRef.current;
    pendingRef.current = null;
    const game = new Game(canvasRef.current);
    gameRef.current = game;
    setPaused(false);
    game.start(opts, () => store.get().setScreen('gameover'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasKey]);

  /* Esc toggles the pause menu during play. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && store.get().screen === 'playing') {
        const g = gameRef.current ?? provingRef.current;
        if (!g) return;
        if (g.paused) { g.resume(); setPaused(false); }
        else { g.pause(); setPaused(true); }
      }
      if (e.code === 'Tab' && store.get().screen === 'playing') e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function disposeAll() {
    gameRef.current?.dispose();
    gameRef.current = null;
    provingRef.current?.dispose();
    provingRef.current = null;
  }

  function beginMatch(opts: StartOptions) {
    disposeAll();
    pendingRef.current = opts;
    setCanvasKey((k) => k + 1);
    store.get().setScreen('playing');
  }

  function startProving() {
    disposeAll();
    pendingProvingRef.current = true;
    setCanvasKey((k) => k + 1);
    store.get().setScreen('playing');
  }

  function startSolo() {
    const { weapon, grenade, map } = store.get().loadout;
    beginMatch({ seed: (Math.random() * 1e9) | 0, startWeapon: weapon, grenade, theme: map });
  }

  function backToMenu() {
    disposeAll();
    store.get().setScreen('menu');
  }

  function resumeGame() { (gameRef.current ?? provingRef.current)?.resume(); setPaused(false); setShowSettings(false); }
  function quitToMenu() { setPaused(false); setShowSettings(false); backToMenu(); }

  /* HUD top-right buttons (⚙ / EXIT) signal via window events — the HUD has
   * no handle on the game instance. */
  useEffect(() => {
    const onSettings = () => {
      if (store.get().screen !== 'playing') return;
      (gameRef.current ?? provingRef.current)?.pause(); setPaused(true); setShowSettings(true);
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
          onProving={startProving}
          onSettings={() => store.get().setScreen('settings')}
          onCredits={() => store.get().setScreen('credits')}
        />
      )}

      {screen === 'loadout' && (
        <Loadout onDeploy={startSolo} onBack={() => store.get().setScreen('menu')} />
      )}

      {screen === 'settings' && <SettingsScreen onBack={() => store.get().setScreen('menu')} />}
      {screen === 'credits' && <Credits onBack={() => store.get().setScreen('menu')} />}

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
          onRestart={startSolo}
          onMenu={backToMenu}
        />
      )}
    </>
  );
}
