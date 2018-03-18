import { Injectable } from "@angular/core";
import { Report, FightInfo } from "../reports/report";
import { EventConfig } from "app/event-config/event-config";
import { CombatEvent } from "../combat-events/combat-event";
import { Raid, Player } from "../raid/raid";
import { FightEvent } from "app/fight-events/models/fight-event";
import { Insight } from "../insights/models/insight";
import { Death } from "../deaths/death";
import { Ability } from "app/fight-events/models/ability-event";
import { Specialization } from "../specializations/specialization";
import { CombatEventPage } from "../warcraft-logs/warcraft-logs-combat-event.service";

@Injectable()
export class TestDataService {

    get(fileName: string): TestData {
        const json = require(`./data/${fileName}.json`);

        const data = Object.create(TestData.prototype);
        Object.assign(data, json);

        data.report = Object.create(Report.prototype);
        Object.assign(data.report, json.report);

        data.fightInfo = Object.create(FightInfo.prototype);
        Object.assign(data.fightInfo, json.fightInfo);

        data.deaths = Object.create(TestDataDeaths.prototype);
        Object.assign(data.deaths, json.deaths);
        data.deaths.entries = json.deaths.entries.map(x => {
            const death = Object.create(Death.prototype);
            Object.assign(death, x);
            return death;
        });

        data.eventConfigs = json.eventConfigs.map(x => {
            const eventConfig = Object.create(EventConfig.prototype);
            Object.assign(eventConfig, x);
            return eventConfig;
        });

        data.combatEventPages = json.combatEventPages.map(x => {
            const page = Object.create(CombatEventPage.prototype);
            Object.assign(page, x);
            page.events = x.events.map(y => {
                const combatEvent = Object.create(CombatEvent.prototype);
                Object.assign(combatEvent, y);
                return y;
            });
            return page;
        });

        data.raid = Object.create(Raid.prototype);
        Object.assign(data.raid, json.raid);
        data.raid.players = json.raid.players.map(x => {
            const player = Object.create(Player.prototype);
            Object.assign(player, x);
            if (player.specialization) {
                player.specialization = Object.create(Specialization.prototype);
                Object.assign(player.specialization, x.specialization);
            }
            return player;
        });

        data.events = json.events.map(x => {
            const event = Object.create(FightEvent.prototype);
            Object.assign(event, x);
            if (event.hasOwnProperty("ability")) {
                event.ability = Object.create(Ability.prototype);
                Object.assign(event.ability, x.ability);
            }
            return event;
        });

        data.insights = json.insights.map(x => {
            const insight = Object.create(Insight.prototype);
            Object.assign(insight, x);
            return insight;
        });

        return data;
    }

}

export class TestData {
    report: Report;
    fightInfo: FightInfo;
    deaths: TestDataDeaths;
    eventConfigs: EventConfig[];
    combatEventPages: CombatEventPage[];
    get combatEvents(): CombatEvent[] {
        return [].concat.apply([], this.combatEventPages.map(x => x.events));
    }
    raid: Raid;
    events: FightEvent[];
    insights: Insight[];
}

export class TestDataDeaths {
    entries: Death[];
}
