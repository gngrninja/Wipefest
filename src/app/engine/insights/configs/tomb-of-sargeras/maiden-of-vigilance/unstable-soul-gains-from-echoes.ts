import { InsightConfig } from "../../insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { DebuffEvent } from "app/fight-events/models/debuff-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { Actor } from "app/warcraft-logs/report";
import { InsightContext } from "../../../models/insight-context";

export class UnstableSoulGainsFromEchoes extends InsightConfig {

    constructor(id: string) {
        super(id, 2052,
            "{totalHits} hit{plural} of {abilities} resulted in {ability:243276:Unstable Soul:fire}.",
            "{playersAndHits}",
            `Moving out of {ability:238037:Light Echoes:holy} or {ability:238420:Fel Echoes:fire}
is particularly important if the player has the opposite infusion to the ability,
as getting hit will cause an unnecessary {ability:243276:Unstable Soul:fire}.`);
    }

    getProperties(context: InsightContext): any {
        let damageEvents = context.events
            .filter(x => x.config)
            .filter(x => (x.config.name == "Light Echoes" || x.config.name == "Fel Echoes") && x.config.eventType == "damage")
            .map(x => <DamageEvent>x)
            .filter(x => {
                let infusion = this.getPlayerInfusion(context.events, x.target, x.timestamp);

                let infusionDoesNotMatchEchoes =
                    (infusion.ability.guid == 235213 && x.ability.guid == 238420) ||
                    (infusion.ability.guid == 235240 && x.ability.guid == 238037)

                return infusionDoesNotMatchEchoes;
            });

        if (damageEvents.length == 0) {
            return;
        }

        let players = damageEvents.map(x => x.target).filter((x, index, array) => array.findIndex(y => y.id === x.id) === index);
        let playersAndHits = players.map(player => <any>{ player: player, frequency: damageEvents.filter(x => x.target.id === player.id).length })
            .sort((x, y) => y.frequency - x.frequency);
        let totalHits = playersAndHits.map(x => x.frequency).reduce((x, y) => x + y);
        let abilities = this.getAbilitiesIfTheyExist(damageEvents, [238037, 238420]);

        return {
            totalHits: MarkupHelper.Info(totalHits),
            plural: this.getPlural(totalHits),
            abilities: MarkupHelper.AbilitiesWithIcons(abilities),
            playersAndHits: MarkupHelper.PlayersAndFrequencies(playersAndHits)
        };
    }

    private getPlayerInfusion(events: FightEvent[], player: Actor, timestamp: number): DebuffEvent {
        let infusions = events
            .filter(x => x.config)
            .filter(x => (x.config.name == "Light Infusion" || x.config.name == "Fel Infusion") && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x)
            .sort((x, y) => y.timestamp - x.timestamp);

        return infusions.find(x => x.target.id == player.id && x.timestamp < timestamp);
    }

}
