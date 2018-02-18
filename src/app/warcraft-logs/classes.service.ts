import { Injectable } from '@angular/core';

@Injectable()
export class ClassesService {

    getSpecialization(specializationId: number): Specialization {
        return this.specializations.find(x => x.id == specializationId);
    }

    getSpecializationByName(className: string, specialization: string): Specialization {
        return this.specializations.find(x => x.className.replace(" ", "") == className.replace(" ", "") && x.name.replace(" ", "") == specialization.replace(" ", ""));
    }

    public specializations: Specialization[] = [
        new Specialization(62, "Mage", "Mage", "Arcane", "Ranged"),
        new Specialization(63, "Mage", "Mage", "Fire", "Ranged"),
        new Specialization(64, "Mage", "Mage", "Frost", "Ranged"),
        new Specialization(65, "Paladin", "Paladin", "Holy", "Healer"),
        new Specialization(66, "Paladin", "Paladin", "Protection", "Tank"),
        new Specialization(70, "Paladin", "Paladin", "Retribution", "Melee"),
        new Specialization(71, "Warrior", "Warrior", "Arms", "Melee", true),
        new Specialization(72, "Warrior", "Warrior", "Fury", "Melee", true),
        new Specialization(73, "Warrior", "Warrior", "Protection", "Tank", true),
        new Specialization(102, "Druid", "Druid", "Balance", "Ranged"),
        new Specialization(103, "Druid", "Druid", "Feral", "Melee"),
        new Specialization(104, "Druid", "Druid", "Guardian", "Tank"),
        new Specialization(105, "Druid", "Druid", "Restoration", "Healer"),
        new Specialization(250, "DeathKnight", "Death Knight", "Blood", "Tank", true),
        new Specialization(251, "DeathKnight", "Death Knight", "Frost", "Melee"),
        new Specialization(252, "DeathKnight", "Death Knight", "Unholy", "Melee"),
        new Specialization(253, "Hunter", "Hunter", "Beast Mastery", "Ranged"),
        new Specialization(254, "Hunter", "Hunter", "Marksmanship", "Ranged"),
        new Specialization(255, "Hunter", "Hunter", "Survival", "Damage"),
        new Specialization(256, "Priest", "Priest", "Discipline", "Healer"),
        new Specialization(257, "Priest", "Priest", "Holy", "Healer", true),
        new Specialization(258, "Priest", "Priest", "Shadow", "Ranged"),
        new Specialization(259, "Rogue", "Rogue", "Assassination", "Melee"),
        new Specialization(260, "Rogue", "Rogue", "Combat", "Melee"),
        new Specialization(261, "Rogue", "Rogue", "Subtlety", "Melee"),
        new Specialization(262, "Shaman", "Shaman", "Elemental", "Ranged"),
        new Specialization(263, "Shaman", "Shaman", "Enhancement", "Melee"),
        new Specialization(264, "Shaman", "Shaman", "Restoration", "Healer"),
        new Specialization(265, "Warlock", "Warlock", "Affliction", "Ranged"),
        new Specialization(266, "Warlock", "Warlock", "Demonology", "Ranged"),
        new Specialization(267, "Warlock", "Warlock", "Destruction", "Ranged"),
        new Specialization(268, "Monk", "Monk", "Brewmaster", "Tank"),
        new Specialization(269, "Monk", "Monk", "Windwalker", "Melee"),
        new Specialization(270, "Monk", "Monk", "Mistweaver", "Healer"),
        new Specialization(577, "DemonHunter", "Demon Hunter", "Havoc", "Melee"),
        new Specialization(581, "DemonHunter", "Demon Hunter", "Vengeance", "Tank")
    ];
}

export class Specialization {

    get icon() {
        return `https://www.warcraftlogs.com/img/icons/${this.className.replace(' ', '')}-${this.name.replace(' ', '')}.jpg`;
    }

    get include(): string {
        return `${this.className.split(" ").join("-").toLowerCase()}/${this.name.split(" ").join("-").toLowerCase()}`;
    }

    get group(): string {
        return `${this.className.substr(0, 2).toUpperCase()}${this.name.substr(0, 2).toUpperCase()}`;
    }

    get generalInclude(): string {
        return `${this.className.split(" ").join("-").toLowerCase()}/${this.className.split(" ").join("-").toLowerCase()}`;
    }

    get generalGroup(): string {
        return `${this.className.substr(0, 4).toUpperCase()}`;
    }

    constructor(
        public id: number,
        public type: string,
        public className: string,
        public name: string,
        public role: string,
        public focusEnabled: boolean = false) { }

}
