import { Actor } from 'app/warcraft-logs/report';
import { Ability } from '../../fight-events/models/ability-event';

export class PlayerAndAbility {
  constructor(public player: Actor, public ability: Ability) {}
}
