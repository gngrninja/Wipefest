import { Injectable } from '@angular/core';
import { Insight } from "app/insights/models/insight";
//import { AvoidableDamageInsight } from "app/insights/models/avoidable-damage-insight";
import { FightEvent } from "app/fight-events/models/fight-event";
//import { InsightConfig, AvoidableDamageInsightConfig, CustomInsightConfig } from "app/insights/models/insight-config";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { MaidenOfVigilanceInsightConfigs } from "app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/all";
import { InsightConfig } from "app/insights/configs/insight-config";
//import { SistersOfTheMoonInsights } from "app/insights/custom/tomb-of-sargeras/sisters-of-the-moon-insights";
//import { MaidenOfVigilanceInsights } from "app/insights/custom/tomb-of-sargeras/maiden-of-vigilance-insights";

@Injectable()
export class InsightService {

    private getInsightConfigs(): InsightConfig[] {
        return [...MaidenOfVigilanceInsightConfigs.All()];
    }

    getInsights(boss: number, events: FightEvent[]): Insight[] {
        return this.getInsightConfigs()
            .filter(x => x.boss == boss)
            .map(x => x.getInsight(events))
            .filter(x => x != null);
    }

    //getInsight(config: InsightConfig, events: FightEvent[]): Insight {
    //    switch (config.type) {
    //        case "custom":
    //            return this.getCustomInsight(<CustomInsightConfig>config, events);
    //        case "avoidableDamage":
    //            return this.getAvoidableDamageInsight(<AvoidableDamageInsightConfig>config, events);
    //        default: {
    //            throw new Error(`'${config.type}' is an unsupported insight type`);
    //        }
    //    }
    //}

    //private getAvoidableDamageInsight(config: AvoidableDamageInsightConfig, events: FightEvent[]): AvoidableDamageInsight {
    //    let damageEvents = events
    //        .filter(x => x.config)
    //        .filter(x => x.config.name == config.eventConfigName && x.config.eventType == "damage")
    //        .map(x => <DamageEvent>x);

    //    if (damageEvents.length == 0) {
    //        return null;
    //    }
        
    //    let players = damageEvents.map(x => x.target).filter((x, index, array) => array.indexOf(x) == index);
    //    let playersAndHits = players.map(player => <any>{ player: player, frequency: damageEvents.filter(x => x.target == player).length });

    //    return new AvoidableDamageInsight(damageEvents[0].ability, playersAndHits, config.tip);
    //}

    //private getCustomInsight(config: CustomInsightConfig, events: FightEvent[]): Insight {
    //    switch (config.handler) {
    //        case "Twilight Glaive":
    //            return SistersOfTheMoonInsights.TwilightGlaive(events);
    //        case "Astral Vulnerability":
    //            return SistersOfTheMoonInsights.AstralVulnerability(events);
    //        case "Moon Burn":
    //            return SistersOfTheMoonInsights.MoonBurn(events);
    //        case "Unstable Soul Gains":
    //            return MaidenOfVigilanceInsights.UnstableSoulGains(events);
    //        case "Unstable Soul Full Expiration Explosion":
    //            return MaidenOfVigilanceInsights.UnstableSoulFullExpirationExplosion(events);
    //        case "Unstable Soul Early Expiration Explosion":
    //            return MaidenOfVigilanceInsights.UnstableSoulEarlyExpirationExplosion(events);
    //        case "Echoes":
    //            return MaidenOfVigilanceInsights.Echoes(events);
    //        case "Unstable Soul Gains From Echoes":
    //            return MaidenOfVigilanceInsights.UnstableSoulGainsFromEchoes(events);
    //        case "Creator's Grace":
    //            return MaidenOfVigilanceInsights.CreatorsGrace(events);
    //        case "Orbs":
    //            return MaidenOfVigilanceInsights.Orbs(events);
    //        case "Died From Falling":
    //            return MaidenOfVigilanceInsights.DiedFromFalling(events);
    //        case "Phase Two Duration":
    //            return MaidenOfVigilanceInsights.PhaseTwoDuration(events);
    //        default: {
    //            throw new Error(`${config.handler} is an unsupported custom insight handler`);
    //        }
    //    }
    //}

}
