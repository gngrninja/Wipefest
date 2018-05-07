import { DebuffEvent } from 'app/fight-events/models/debuff-event';
import { RemoveDebuffEvent } from 'app/fight-events/models/remove-debuff-event';
import { MarkupHelper } from 'app/helpers/markup-helper';
import { Timestamp } from 'app/helpers/timestamp-helper';
import { InsightConfig } from 'app/insights/configs/insight-config';
import { InsightContext } from 'app/insights/models/insight-context';
import { PlayerAndDuration } from 'app/insights/models/player-and-duration';

export class SargerasBlessingDuration extends InsightConfig {
  constructor(id: string) {
    super(
      id,
      2074,
      'Had a total {ability} duration of {totalDuration}.',
      '{playersAndDurationsOverThreshold}',
      `
Whenever ${MarkupHelper.Style('boss', "F'Harg")} and ${MarkupHelper.Style(
        'boss',
        'Shatug'
      )} are within 40 yards of one another,
they gain {ability:246057:Sargeras' Blessing:shadow},
which massively increases their damage done.
Prevent them from gaining this debuff by tanking them at least 40 yards apart.
Ranged players can stay between the two bosses, so that everything is within their range.`
    );
  }

  getProperties(context: InsightContext): any {
    const debuffEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          x.config.name == "Sargeras' Blessing" &&
          x.config.eventType == 'debuff'
      )
      .map(x => x as DebuffEvent)
      .sort((x, y) => x.timestamp - y.timestamp);

    const removeDebuffEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          x.config.name == "Sargeras' Blessing (Removed)" &&
          x.config.eventType == 'removedebuff'
      )
      .map(x => x as RemoveDebuffEvent)
      .sort((x, y) => x.timestamp - y.timestamp);

    const playersAndDurations = debuffEvents
      .map(gained => {
        const removeDebuffEvent = removeDebuffEvents.find(
          lost =>
            gained.ability.guid == lost.ability.guid &&
            lost.timestamp > gained.timestamp
        );
        if (!removeDebuffEvent) {
          return new PlayerAndDuration(
            gained.target,
            context.fight.end_time - context.fight.start_time - gained.timestamp
          );
        }

        const duration = removeDebuffEvent.timestamp - gained.timestamp;

        return new PlayerAndDuration(removeDebuffEvent.target, duration);
      })
      .filter(x => x != null);

    if (playersAndDurations.length == 0) {
      return null;
    }

    const totalDuration = playersAndDurations
      .map(x => x.duration)
      .reduce((x, y) => x + y);
    const averageDuration = totalDuration / playersAndDurations.length;
    const playersAndDurationsOverThreshold = playersAndDurations.filter(
      x => x.duration >= 0
    );
    const totalFrequencyOverThreshold = playersAndDurationsOverThreshold.length;
    const ability = debuffEvents[0].ability;

    return {
      ability: MarkupHelper.AbilityWithIcon(ability),
      abilityTooltip: MarkupHelper.AbilityWithTooltip(ability),
      averageDuration: MarkupHelper.Info(Timestamp.ToSeconds(averageDuration)),
      totalDuration: MarkupHelper.Info(Timestamp.ToSeconds(totalDuration)),
      totalFrequencyOverThreshold: MarkupHelper.Info(
        totalFrequencyOverThreshold
      ),
      plural: this.getPlural(totalFrequencyOverThreshold),
      playersAndDurationsOverThreshold: MarkupHelper.PlayersAndDurations(
        playersAndDurationsOverThreshold
      )
    };
  }
}
