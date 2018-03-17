import { async } from "@angular/core/testing";
import { InsightService } from "./insight.service";
import { InsightContext } from "./models/insight-context";
import { Raid, Player } from "../raid/raid";
import { FightEvent } from "app/fight-events/models/fight-event";

describe("InsightService", () => {

    it("should return insights", async(() => {
        var data = require("../testing/data/xyMd2kwb3W9zNrJF-13.json");
        
        const fightInfo = data.report.fights.find(x => x.id === 13);
        const context = new InsightContext(
            data.report,
            fightInfo,
            new Raid(data.raid.players.map(x => new Player(x.name, x.className, x.specialization, x.itemLevel))),
            data.events);

        const service = new InsightService();
        
        const insights = service.getInsights(fightInfo.boss, context);
        
        // Re-parse so that Jasmine compares properly
        const actual = JSON.parse(JSON.stringify(insights));
        
        expect(actual).toEqual(data.insights);

        // TODO: Check that these insights line up with current live behaviour
    }));
});
