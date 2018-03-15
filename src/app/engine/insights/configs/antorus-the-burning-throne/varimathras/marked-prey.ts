import { InsightConfig } from "../../insight-config";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { InsightContext } from "../../../models/insight-context";
import { Timestamp } from "app/helpers/timestamp-helper";
import { DebuffEvent } from "app/fight-events/models/debuff-event";

export class MarkedPrey extends InsightConfig {

    constructor(id: string) {

        super(id, 2069, "Intercepted {abilities} {totalFrequency} time{plural}.", "<p>{interceptorsAndFrequencies}</p> {targetsAndInterceptorsTable}", null);
    }

    getProperties(context: InsightContext): any {
        let damageEvents = context.events
            .filter(x => x.config)
            .filter(x => x.config.name == "Shadow Hunter" && x.config.eventType == "damage")
            .map(x => <DamageEvent>x);

        if (damageEvents.length == 0) {
            return null;
        }

        let debuffEvents = context.events
            .filter(x => x.config)
            .filter(x => x.config.name == "Marked Prey" && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x)
            .sort((x, y) => y.timestamp - x.timestamp);

        let abilities = this.getAbilitiesIfTheyExist(debuffEvents, [244042]);

        let interceptors = damageEvents.map(x => x.target).filter((x, index, array) => array.findIndex(y => y.id === x.id) === index);
        let interceptorsAndFrequencies = interceptors.map(player => <any>{ player: player, frequency: damageEvents.filter(x => x.target.id === player.id).length }).sort((x, y) => y.frequency - x.frequency);
        let totalFrequency = damageEvents.length;

        let targetsAndInterceptors = damageEvents.map(x => <any>{
            timestamp: x.timestamp,
            target: debuffEvents.find(y => y.timestamp < x.timestamp).target,
            interceptor: x.target
        });

        let targetsAndInterceptorsTable =
            new MarkupHelper.Table(targetsAndInterceptors.map(x =>
                new MarkupHelper.TableRow([
                    new MarkupHelper.TableCell(Timestamp.ToMinutesAndSeconds(x.timestamp)),
                    new MarkupHelper.TableCell(MarkupHelper.Actor(x.target)),
                    new MarkupHelper.TableCell(MarkupHelper.Actor(x.interceptor))])),
                new MarkupHelper.TableRow([
                    new MarkupHelper.TableCell("Time"),
                    new MarkupHelper.TableCell("Target"),
                    new MarkupHelper.TableCell("Interceptor")]),
                "table table-hover markup-table-details");

        return {
            abilities: MarkupHelper.AbilitiesWithIcons(abilities),
            abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
            targetsAndInterceptorsTable: targetsAndInterceptorsTable.parse(),
            totalFrequency: totalFrequency,
            plural: this.getPlural(totalFrequency),
            interceptorsAndFrequencies: MarkupHelper.PlayersAndFrequencies(interceptorsAndFrequencies)
        }
    }

}
