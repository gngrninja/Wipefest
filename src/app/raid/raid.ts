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
            if (!combatantInfo) {
                // This was happening for Pets that for some reason were listed under friendlies instead of friendlyPets
                // Leaving this here in case there are any other peculiarities
                console.log(`No combatant info could be found for ${x.name} of type ${x.type} with source ID ${x.id}`);
                return null;
            }
            let gear = combatantInfo.gear
                .filter((x, index, array) => x.id != 0 && index != 3 && index != 17); // Remove shirt, tabard, and "invisible off-hand" when using two-hand
            let itemLevel = gear
                .map(x => x.itemLevel)
                .reduce((x, y) => x + y)
                / gear.length;

            return new Player(x.name, this.classesService.getSpecialization(combatantInfo.specID), itemLevel);
        }).filter(x => x != null);

        return new Raid(players);
    }

}

export class Raid {

    constructor(public players: Player[]) { }

    get itemLevel() {
        return this.players.map(x => x.itemLevel).reduce((x, y) => x + y, 0) / this.players.length;
    }
    get tanks() {
        return this.players.filter(x => x.specialization.role == "Tank").sort(this.byClassThenSpecializationThenName);
    }
    get healers() {
        return this.players.filter(x => x.specialization.role == "Healer").sort(this.byClassThenSpecializationThenName);
    }
    get ranged() {
        return this.players.filter(x => x.specialization.role == "Ranged").sort(this.byClassThenSpecializationThenName);
    }
    get melee() {
        return this.players.filter(x => x.specialization.role == "Melee").sort(this.byClassThenSpecializationThenName);
    }
    get roles(): RoleWithPlayers[] {
        return [
            new RoleWithPlayers("Tanks", this.tanks),
            new RoleWithPlayers("Healers", this.healers),
            new RoleWithPlayers("Ranged", this.ranged),
            new RoleWithPlayers("Melee", this.melee),
        ]
    }

    private byClassThenSpecializationThenName = (a: Player, b: Player) => {
        if (a.specialization.className == b.specialization.className) {
            if (a.specialization.name == b.specialization.name) {
                if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                if (a.name.toLowerCase() == b.name.toLowerCase()) return 0;
            }
            if (a.specialization.name.toLowerCase() < b.specialization.name.toLowerCase()) return -1;
            if (a.specialization.name.toLowerCase() > b.specialization.name.toLowerCase()) return 1;
            if (a.specialization.name.toLowerCase() == b.specialization.name.toLowerCase()) return 0;
        }
        if (a.specialization.className.toLowerCase() < b.specialization.className.toLowerCase()) return -1;
        if (a.specialization.className.toLowerCase() > b.specialization.className.toLowerCase()) return 1;
        if (a.specialization.className.toLowerCase() == b.specialization.className.toLowerCase()) return 0;
    };
}

export class Player {
    constructor(public name: string, public specialization: Specialization, public itemLevel: number) { }
}

export class RoleWithPlayers {
    constructor(public name: string, public players: Player[]) { }
}
