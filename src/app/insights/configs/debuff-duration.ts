import { DebuffEvent } from 'app/fight-events/models/debuff-event';
import { RemoveDebuffEvent } from 'app/fight-events/models/remove-debuff-event';
import { MarkupHelper } from 'app/helpers/markup-helper';
import { Timestamp } from 'app/helpers/timestamp-helper';
import { InsightConfig } from 'app/insights/configs/insight-config';
import { InsightContext } from 'app/insights/models/insight-context';
import { PlayerAndDuration } from 'app/insights/models/player-and-duration';
import { PlayerAndTimestamp } from 'app/insights/models/player-and-timestamp';

export class DebuffDuration extends InsightConfig {
  constructor(
    id: string,
    boss: number,
    private appliedEventConfigName: string,
    private removedEventConfigName: string,
    private threshold: number = 0,
    insightTemplate: string = null,
    detailsTemplate: string = null,
    tipTemplate: string = null
  ) {
    super(id, boss, insightTemplate, detailsTemplate, tipTemplate);

    if (insightTemplate == null) {
      if (this.threshold > 0) {
        this.insightTemplate =
          'Had an average {ability} duration of {averageDuration}, with {totalFrequencyOverThreshold} lasting longer than {threshold}.';
      } else {
        this.insightTemplate =
          'Had an average {ability} duration of {averageDuration}.';
      }
    }
    if (detailsTemplate == null) {
      this.detailsTemplate = '{playersAndDurationsOverThreshold}';
    }
  }

  getProperties(context: InsightContext): any {
    const debuffEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          x.config.name == this.appliedEventConfigName &&
          x.config.eventType == 'debuff'
      )
      .map(x => x as DebuffEvent)
      .sort((x, y) => x.timestamp - y.timestamp);

    const removeDebuffEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          x.config.name == this.removedEventConfigName &&
          x.config.eventType == 'removedebuff'
      )
      .map(x => x as RemoveDebuffEvent)
      .sort((x, y) => x.timestamp - y.timestamp);

    const playersAndDurations = debuffEvents
      .map(gained => {
        const removeDebuffEvent = removeDebuffEvents.find(
          lost =>
            gained.target.id == lost.target.id &&
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

    const playersWithDurationsOverThresholdAndTimestamps = debuffEvents
      .map(gained => {
        const removeDebuffEvent = removeDebuffEvents.find(
          lost =>
            gained.target.id == lost.target.id &&
            gained.ability.guid == lost.ability.guid &&
            lost.timestamp > gained.timestamp
        );
        if (!removeDebuffEvent) {
          const duration =
            context.fight.end_time -
            context.fight.start_time -
            gained.timestamp;
          if (duration < this.threshold) {
            return null;
          }

          return new PlayerAndTimestamp(
            gained.target,
            context.fight.end_time - context.fight.start_time
          );
        }

        const duration = removeDebuffEvent.timestamp - gained.timestamp;
        if (duration < this.threshold) {
          return null;
        }

        return new PlayerAndTimestamp(
          removeDebuffEvent.target,
          removeDebuffEvent.timestamp
        );
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
      x => x.duration >= this.threshold
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
      possesivePronoun: totalFrequencyOverThreshold == 1 ? 'its' : 'their',
      playersAndDurationsOverThreshold: MarkupHelper.PlayersAndDurations(
        playersAndDurationsOverThreshold
      ),
      playersWithDurationsOverThresholdAndTimestamps: MarkupHelper.PlayersAndTimestamps(
        playersWithDurationsOverThresholdAndTimestamps
      ),
      threshold: MarkupHelper.Info(Timestamp.ToSeconds(this.threshold))
    };
  }
}
