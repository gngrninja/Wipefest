import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { Fight, Report } from "app/warcraft-logs/report";
import { InsightContext } from "app/insights/models/insight-context";
import { TimestampAndPlayers } from "app/insights/models/timestamp-and-players";
import { Timestamp } from "app/helpers/timestamp-helper";
import { SortRaid } from "app/raid/raid";
import { DebuffEvent } from "app/fight-events/models/debuff-event";

export class MarkedPrey extends InsightConfig {

  constructor() {

    super(2069, "Intercepted {abilities} {totalFrequency} time{plural}.", "<p>{interceptorsAndFrequencies}</p> {targetsAndInterceptorsTable}", null);
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

    let interceptors = damageEvents.map(x => x.target).filter((x, index, array) => array.indexOf(x) == index);
    let interceptorsAndFrequencies = interceptors.map(player => <any>{ player: player, frequency: damageEvents.filter(x => x.target == player).length }).sort((x, y) => y.frequency - x.frequency);
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
