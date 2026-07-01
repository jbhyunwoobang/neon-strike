/**
 * RoomManager.ts — Registry of active rooms + unique code generation.
 *
 * Responsible only for lifecycle: create, look up, dispose. All in-match logic
 * lives on the Room. Codes are drawn from an unambiguous alphabet and retried
 * on the (astronomically unlikely) collision.
 */

import { Room } from './Room';
import { ROOM_ALPHABET, ROOM_CODE_LEN, RoomCode } from './protocol';

export class RoomManager {
  private rooms = new Map<RoomCode, Room>();

  /** Create a fresh room with a guaranteed-unique code. */
  create(): Room {
    let code = this.generateCode();
    let guard = 0;
    while (this.rooms.has(code) && guard++ < 1000) code = this.generateCode();
    const room = new Room(code);
    this.rooms.set(code, room);
    return room;
  }

  get(code: RoomCode): Room | undefined {
    return this.rooms.get(code.toUpperCase());
  }

  dispose(code: RoomCode) {
    this.rooms.delete(code.toUpperCase());
  }

  /** Remove empty rooms; called periodically as a janitor. */
  reap(): number {
    let n = 0;
    for (const [code, room] of this.rooms) {
      if (room.isEmpty) { this.rooms.delete(code); n++; }
    }
    return n;
  }

  get count() { return this.rooms.size; }
  all(): Room[] { return [...this.rooms.values()]; }

  private generateCode(): RoomCode {
    let s = '';
    for (let i = 0; i < ROOM_CODE_LEN; i++) {
      s += ROOM_ALPHABET[Math.floor(Math.random() * ROOM_ALPHABET.length)];
    }
    return s;
  }
}
