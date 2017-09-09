import { CombatEvent } from "app/warcraft-logs/combat-event";

export class Death {

    deathWindow: number;
    damage: DeathDamage;
    healing: DeathHealing;
    name: string;
    timestamp: number;
    events: CombatEvent[];

}

export class DeathDamage {

    total: number;

}

export class DeathHealing {

    total: number;

}
