import { Actor } from 'app/warcraft-logs/report';

export class PlayerAndDamage {
  constructor(
    public player: Actor,
    public damage: number,
    public absorbed: number,
    public overkill: number
  ) {}
}
