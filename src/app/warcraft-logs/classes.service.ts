import { Injectable } from '@angular/core';

@Injectable()
export class ClassesService {

    getSpecialization(specializationId: number) {
        let specialization = this.specializations.find(x => x.id == specializationId);

        if (specialization == undefined) {
            throw `"No specialization could be found with id ${specializationId}`;
        }

        return specialization;
    }

    private specializations: Specialization[] = [
        new Specialization(62, "Mage", "Arcane", "Ranged"),
        new Specialization(63, "Mage", "Fire", "Ranged"),
        new Specialization(64, "Mage", "Frost", "Ranged"),
        new Specialization(65, "Paladin", "Holy", "Healer"),
        new Specialization(66, "Paladin", "Protection", "Tank"),
        new Specialization(70, "Paladin", "Retribution", "Melee"),
        new Specialization(71, "Warrior", "Arms", "Melee"),
        new Specialization(72, "Warrior", "Fury", "Melee"),
        new Specialization(73, "Warrior", "Protection", "Tank"),
        new Specialization(102, "Druid", "Balance", "Ranged"),
        new Specialization(103, "Druid", "Feral", "Melee"),
        new Specialization(104, "Druid", "Guardian", "Tank"),
        new Specialization(105, "Druid", "Restoration", "Healer"),
        new Specialization(250, "Death Knight", "Blood", "Tank"),
        new Specialization(251, "Death Knight", "Frost", "Melee"),
        new Specialization(252, "Death Knight", "Unholy", "Melee"),
        new Specialization(253, "Hunter", "Beast Mastery", "Ranged"),
        new Specialization(254, "Hunter", "Marksmanship", "Ranged"),
        new Specialization(255, "Hunter", "Survival", "Damage"),
        new Specialization(256, "Priest", "Discipline", "Healer"),
        new Specialization(257, "Priest", "Holy", "Healer"),
        new Specialization(258, "Priest", "Shadow", "Ranged"),
        new Specialization(259, "Rogue", "Assassination", "Melee"),
        new Specialization(260, "Rogue", "Combat", "Melee"),
        new Specialization(261, "Rogue", "Subtlety", "Melee"),
        new Specialization(262, "Shaman", "Elemental", "Ranged"),
        new Specialization(263, "Shaman", "Enhancement", "Melee"),
        new Specialization(264, "Shaman", "Restoration", "Healer"),
        new Specialization(265, "Warlock", "Affliction", "Ranged"),
        new Specialization(266, "Warlock", "Demonology", "Ranged"),
        new Specialization(267, "Warlock", "Destruction", "Ranged"),
        new Specialization(268, "Monk", "Brewmaster", "Tank"),
        new Specialization(269, "Monk", "Windwalker", "Melee"),
        new Specialization(270, "Monk", "Mistweaver", "Healer"),
        new Specialization(577, "Demon Hunter", "Havoc", "Melee"),
        new Specialization(581, "Demon Hunter", "Vengeance", "Tank")
    ];
}

export class Specialization {

    get icon() {
        return `https://www.warcraftlogs.com/img/icons/${this.className.replace(' ', '')}-${this.name.replace(' ', '')}.jpg`;
    }

    constructor(
        public id: number,
        public className: string,
        public name: string,
        public role: string) { }

}