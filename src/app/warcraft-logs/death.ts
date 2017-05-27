import { CombatEvent } from "app/warcraft-logs/combat-event";

export class Death {

    name: string;
    timestamp: number;
    events: CombatEvent[];

}