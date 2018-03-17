import { async } from "@angular/core/testing";
import { SpecializationsService } from "../specializations/specializations.service";
import { CombatEvent } from "../combat-events/combat-event";
import { RaidFactory } from "../raid/raid";

describe("RaidFactory", () => {

    it("should return a raid", async(() => {
        var data = require("../testing/data/xyMd2kwb3W9zNrJF-13.json");
        
        const combatEvents = [].concat.apply([], data.combatEvents.map(x => x.events)) as CombatEvent[];
        const specializationsService = new SpecializationsService();

        const raid = RaidFactory.Get(
            combatEvents.filter(x => x.type === "combatantinfo"),
            data.report.friendlies,
            specializationsService);

        // Re-parse so that Jasmine compares properly
        const actual = JSON.parse(JSON.stringify(raid.players));

        expect(actual).toEqual(data.raid.players);

        // TODO: Check - is this supposed to return NPCs and Pets?
    }));
});
