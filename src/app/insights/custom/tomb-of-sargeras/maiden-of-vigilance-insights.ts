import { FightEvent } from "app/fight-events/models/fight-event";
import { Insight } from "app/insights/models/insight";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { Ability } from "app/fight-events/models/ability-event";

export module MaidenOfVigilanceInsights {

    export function Echoes(events: FightEvent[]): Insight {
        let damageEvents = events
            .filter(x => x.config)
            .filter(x => (x.config.name == "Light Echoes" || x.config.name == "Fel Echoes") && x.config.eventType == "damage")
            .map(x => <DamageEvent>x);

        if (damageEvents.length == 0) {
            return null;
        }

        let players = damageEvents.map(x => x.target).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndHits = players.map(player => <any>{ player: player, frequency: damageEvents.filter(x => x.target == player).length })
            .sort((x, y) => y.frequency - x.frequency);

        let totalHits = playersAndHits.map(x => x.frequency).reduce((x, y) => x + y);

        let abilities: Ability[] = [];

        let lightEchoes = damageEvents.find(x => x.config.name == "Light Echoes");
        if (lightEchoes) abilities.push(lightEchoes.ability);
        
        let felEchoes = damageEvents.find(x => x.config.name == "Fel Echoes");
        if (felEchoes) abilities.push(felEchoes.ability);

        let insight = `Hit by ${abilities.map(x => MarkupHelper.AbilityWithIcon(x)).join(" / ")} ${MarkupHelper.Info(totalHits)} times.`;
        let details = MarkupHelper.PlayersAndFrequency(playersAndHits);
        let tip = null;

        return new Insight(insight, details, tip);
    }

}
