import { Component, Input, OnChanges } from '@angular/core';
import { CombatEvent } from "app/warcraft-logs/combat-event";
import { Specialization, ClassesService } from "app/warcraft-logs/classes.service";
import { Friendly } from "app/warcraft-logs/report";

@Component({
    selector: 'fight-summary-raid',
    templateUrl: './fight-summary-raid.component.html',
    styleUrls: ['./fight-summary-raid.component.css']
})
export class FightSummaryRaidComponent implements OnChanges {

    @Input() combatantInfo: CombatEvent[];
    @Input() friendlies: Friendly[];
    raid: Player[] = [];
    get raidItemLevel() {
        return this.raid.map(x => x.itemLevel).reduce((x, y) => x + y) / this.raid.length;
    }
    get tanks() {
        return this.raid.filter(x => x.specialization.role == "Tank");
    }
    get healers() {
        return this.raid.filter(x => x.specialization.role == "Healer");
    }
    get ranged() {
        return this.raid.filter(x => x.specialization.role == "Ranged");
    }
    get melee() {
        return this.raid.filter(x => x.specialization.role == "Melee");
    }
    get roles(): RoleWithPlayers[] {
        return [
            new RoleWithPlayers("Tanks", this.tanks),
            new RoleWithPlayers("Healers", this.healers),
            new RoleWithPlayers("Ranged", this.ranged),
            new RoleWithPlayers("Melee", this.melee),
        ]
    }

    constructor(private classesService: ClassesService) { }

    ngOnChanges() {
        this.raid = this.friendlies.map(x => {
            let combatantInfo = this.combatantInfo.find(y => x.id == y.sourceID);
            let gear = combatantInfo.gear
                .filter((x, index, array) => x.id != 0 && index != 3 && index != 17); // Remove shirt, tabard, and "invisible off-hand" when using two-hand
            let itemLevel = gear
                .map(x => x.itemLevel)
                .reduce((x, y) => x + y)
                / gear.length;

            return new Player(x.name, this.classesService.getSpecialization(combatantInfo.specID), itemLevel);
        });
    }
}

export class Player {
    constructor(public name: string, public specialization: Specialization, public itemLevel: number) { }
}

export class RoleWithPlayers {
    constructor(public name: string, public players: Player[]) { }
}