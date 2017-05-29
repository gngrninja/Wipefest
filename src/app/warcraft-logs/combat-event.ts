﻿export class CombatEvent {

    ability: CombatAbility;
    timestamp: number;
    attackPower: number;
    classResources: ClassResource[];
    hitPoints: number;
    itemLevel: number;
    maxHitPoints: number;
    pin: string;
    resolve: number;
    resourceActor: number;
    sourceID: number;
    sourceIsFriendly: boolean;
    sourceInstance: number;
    spellPower: number;
    target: Target;
    targetIsFriendly: boolean;
    type: string;
    x: number;
    y: number;

}

export class CombatAbility {

    name: string;
    type: number;
    guid: number;
    abilityIcon: string;

}

export class ClassResource {

    amount: number;
    cost: number;
    max: number;
    type: number;

}

export class Target {

    guid: number;
    icon: string;
    id: number;
    name: string;
    type: string;

}