import { Specialization, ClassesService } from "app/warcraft-logs/classes.service";
import { CombatEvent } from "app/warcraft-logs/combat-event";
import { Actor } from "app/warcraft-logs/report";

export module RaidFactory {

    export function Get(combatantInfos: CombatEvent[], friendlies: Actor[], classesService: ClassesService): Raid {
        if (!friendlies || !combatantInfos) {
            return new Raid([]);
        }

        let players = friendlies.map(x => {
            let combatantInfo = combatantInfos.find(y => x.id == y.sourceID);

            let itemLevel: number = null;
            let specialization: Specialization = null;
            if (combatantInfo) {
                let gear = combatantInfo.gear
                    .filter((x, index, array) => x.id != 0 && index != 3 && index != 17); // Remove shirt, tabard, and "invisible off-hand" when using two-hand
                itemLevel = gear
                    .map(x => x.itemLevel)
                    .reduce((x, y) => x + y)
                    / gear.length;

                specialization = classesService.getSpecialization(combatantInfo.specID);
            }

            return new Player(x.name, x.type, specialization, itemLevel);
        }).sort(SortRaid.ByClassThenSpecializationThenName);

        return new Raid(players);
    }

}

export module SortRaid {

    export function ByClassThenSpecializationThenName(a: Player, b: Player) {
        if (a.className == b.className) {
            if (!a.specialization || !b.specialization || a.specialization.name == b.specialization.name) {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                if (a.name.toLowerCase() == b.name.toLowerCase()) return 0;
            }
            if (a.specialization && b.specialization) {
                if (a.specialization.name.toLowerCase() < b.specialization.name.toLowerCase()) return -1;
                if (a.specialization.name.toLowerCase() > b.specialization.name.toLowerCase()) return 1;
                if (a.specialization.name.toLowerCase() == b.specialization.name.toLowerCase()) return 0;
            }
        }
        if (a.className.toLowerCase() < b.className.toLowerCase()) return -1;
        if (a.className.toLowerCase() > b.className.toLowerCase()) return 1;
        if (a.className.toLowerCase() == b.className.toLowerCase()) return 0;
    };

}

export class Raid {

    constructor(public players: Player[]) { }

    get itemLevel() {
        return this.players.map(x => x.itemLevel).reduce((x, y) => x + y, 0) / this.players.length;
    }
    get tanks() {
        return this.players.filter(x => x.specialization && x.specialization.role == "Tank");
    }
    get healers() {
        return this.players.filter(x => x.specialization && x.specialization.role == "Healer");
    }
    get ranged() {
        return this.players.filter(x => x.specialization && x.specialization.role == "Ranged");
    }
    get melee() {
        return this.players.filter(x => x.specialization && x.specialization.role == "Melee");
    }
    get roles(): RoleWithPlayers[] {
        return [
            new RoleWithPlayers("Tanks", this.tanks),
            new RoleWithPlayers("Healers", this.healers),
            new RoleWithPlayers("Ranged", this.ranged),
            new RoleWithPlayers("Melee", this.melee),
        ]
    }
}

export class Player {
    constructor(public name: string, public className: string, public specialization: Specialization, public itemLevel: number) { }

    toActor(): Actor {
        return new Actor(this.name, this.className);
    }
}

export class RoleWithPlayers {
    constructor(public name: string, public players: Player[]) { }
}