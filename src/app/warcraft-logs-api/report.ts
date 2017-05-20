export class Report {

    friendlies: Friendly[];
    enemies: Enemy[];
    fights: Fight[];

}

export class Friendly {

    id: number;
    guid: number;
    name: string;
    type: string;

}

export class Enemy {

    id: number;
    guid: number;
    name: string;
    type: string;

}

export class Fight {

    boss: number;
    bossPercentage: number;
    difficulty: number;
    end_time: number;
    fightPercentage: number;
    id: number;
    kill: boolean;
    lastPhaseForPercentageDisplay: number;
    name: string;
    partial: number;
    size: number;
    start_time: number;

}