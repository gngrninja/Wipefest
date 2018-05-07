import { AbilityEvent } from 'app/fight-events/models/ability-event';
import { InterruptEvent } from 'app/fight-events/models/interrupt-event';
import { MarkupHelper } from 'app/helpers/markup-helper';
import { InsightConfig } from 'app/insights/configs/insight-config';
import { InsightContext } from 'app/insights/models/insight-context';
import { PlayerAndTimestamp } from 'app/insights/models/player-and-timestamp';

export class Interrupt extends InsightConfig {
  constructor(
    id: string,
    boss: number,
    private eventConfigNames: string[],
    private abilityIds: number[],
    insightTemplate: string = null,
    detailsTemplate: string = null,
    tipTemplate: string = null
  ) {
    super(id, boss, insightTemplate, detailsTemplate, tipTemplate);

    if (insightTemplate == null) {
      this.insightTemplate =
        'Interrupted {abilities} {totalInterrupts}/{totalCastAttempts} time{plural}.';
    }
    if (detailsTemplate == null) {
      this.detailsTemplate =
        '{playersSection}{interruptsSection}{castsSection}';
    }
  }

  getProperties(context: InsightContext): any {
    const interruptEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          this.eventConfigNames.indexOf(x.config.name) != -1 &&
          x.config.eventType == 'interrupt'
      )
      .map(x => x as InterruptEvent)
      .filter(x => x.isFriendly);

    const abilityEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          this.eventConfigNames.indexOf(x.config.name) != -1 &&
          x.config.eventType == 'ability'
      )
      .map(x => x as AbilityEvent);

    const totalCastAttempts = interruptEvents.length + abilityEvents.length;

    if (totalCastAttempts == 0) {
      return null;
    }

    let abilities = this.getAbilitiesIfTheyExist(
      interruptEvents,
      this.abilityIds
    );
    if (abilities.length == 0) {
      abilities = this.getAbilitiesIfTheyExist(abilityEvents, this.abilityIds);
    }

    const playersAndTimestamps = interruptEvents.map(
      x => new PlayerAndTimestamp(x.source, x.timestamp)
    );
    const players = interruptEvents
      .map(x => x.source)
      .filter((x, index, array) => array.map(y => y.id).indexOf(x.id) == index);
    const playersAndFrequencies = players
      .map(player => {
        return {
          player: player,
          frequency: interruptEvents.filter(x => x.source.id == player.id)
            .length
        } as any;
      })
      .sort((x, y) => y.frequency - x.frequency);
    const totalInterrupts = playersAndFrequencies
      .map(x => x.frequency)
      .reduce((x, y) => x + y, 0);
    const castTimestamps = abilityEvents.map(x => x.timestamp);

    return {
      abilities: MarkupHelper.AbilitiesWithIcons(abilities),
      abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
      totalInterrupts: MarkupHelper.Info(totalInterrupts),
      plural: this.getPlural(totalInterrupts),
      playersAndFrequencies: MarkupHelper.PlayersAndFrequencies(
        playersAndFrequencies
      ),
      playersAndTimestamps: MarkupHelper.PlayersAndTimestamps(
        playersAndTimestamps
      ),
      totalCastAttempts: MarkupHelper.Info(totalCastAttempts),
      castTimestamps: MarkupHelper.Timestamps(castTimestamps),
      playersSection: playersAndFrequencies.length
        ? '<h6>Players</h6><p>{playersAndFrequencies}</p>'
        : '',
      interruptsSection: playersAndTimestamps.length
        ? '<h6>Interrupts</h6><p>{playersAndTimestamps}</p>'
        : '',
      castsSection: castTimestamps.length
        ? '<h6>Casts</h6>{castTimestamps}'
        : ''
    };
  }
}
