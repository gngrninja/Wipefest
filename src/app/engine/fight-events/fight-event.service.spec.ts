import { async } from "@angular/core/testing";
import { FightEventService } from "./fight-event.service";
import { CombatEvent } from "../combat-events/combat-event";

describe("FightEventService", () => {

    it("should return fight events", async(() => {
        var data = require("../testing/data/xyMd2kwb3W9zNrJF-13.json");
        data.report.id = "xyMd2kwb3W9zNrJF";

        const fight = data.report.fights.find(x => x.id === 13);
        const combatEvents = [].concat.apply([], data.combatEvents.map(x => x.events)) as CombatEvent[];

        const service = new FightEventService();
        
        const events = service.getEvents(data.report, fight, data.eventConfigs, combatEvents, data.deaths.entries);
        
        // Re-parse so that Jasmine compares properly
        const actual = JSON.parse(JSON.stringify(events));

        //document.body.innerText = JSON.stringify(events);

        expect(actual).toEqual(data.events);

        // TODO: Check that these events line up with current live behaviour
    }));
});
