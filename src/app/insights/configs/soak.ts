import { DamageEvent } from 'app/fight-events/models/damage-event';
import { MarkupHelper } from 'app/helpers/markup-helper';
import { Timestamp } from 'app/helpers/timestamp-helper';
import { InsightConfig } from 'app/insights/configs/insight-config';
import { InsightContext } from 'app/insights/models/insight-context';
import { TimestampAndPlayers } from 'app/insights/models/timestamp-and-players';
import { SortRaid } from 'app/raid/raid';

export class Soak extends InsightConfig {
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
        'Soaked {abilities} with an average of {average}/{raidSize} player{plural}.';
    }
    if (detailsTemplate == null) {
      this.detailsTemplate =
        '<p>{playersAndFrequencies}</p> {timestampsAndPlayersTable}';
    }
  }

  getProperties(context: InsightContext): any {
    const damageEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          this.eventConfigNames.indexOf(x.config.name) != -1 &&
          x.config.eventType == 'damage'
      )
      .map(x => x as DamageEvent);

    if (damageEvents.length == 0) {
      return null;
    }

    const soaks: DamageEvent[][] = [];
    let soak = [damageEvents[0]];
    damageEvents.slice(1).forEach(x => {
      if (x.timestamp < soak[0].timestamp + 1500) {
        soak.push(x);
      } else {
        soaks.push(soak);
        soak = [x];
      }
    });
    soaks.push(soak);

    if (soaks.length == 0) {
      this.insightTemplate = 'Failed to soak {abilities}.';
      this.detailsTemplate = null;
    }

    const abilities = this.getAbilitiesIfTheyExist(
      damageEvents,
      this.abilityIds
    );
    const average =
      soaks.map(x => x.length).reduce((x, y) => x + y) / soaks.length;

    const players = damageEvents
      .map(x => x.target)
      .filter(
        (x, index, array) => array.findIndex(y => y.id === x.id) === index
      );
    const playersAndFrequencies = players
      .map(player => {
        return {
          player: player,
          frequency: damageEvents.filter(x => x.target.id === player.id).length
        } as any;
      })
      .sort((x, y) => y.frequency - x.frequency);

    const timestampsAndSoakingPlayers = soaks.map(
      x =>
        new TimestampAndPlayers(
          x[0].timestamp,
          x
            .map(y => this.getPlayerFromActor(y.target, context.raid))
            .sort(SortRaid.ByClassThenSpecializationThenName)
        )
    );
    const timestampsAndNonSoakingPlayers = soaks.map(
      x =>
        new TimestampAndPlayers(
          x[0].timestamp,
          context.raid.players
            .filter(p => !x.map(y => y.target).some(t => p.name == t.name))
            .sort(SortRaid.ByClassThenSpecializationThenName)
        )
    );

    const timestampsAndPlayersTable = new MarkupHelper.Table(
      timestampsAndSoakingPlayers.map(
        (x, index) =>
          new MarkupHelper.TableRow([
            new MarkupHelper.TableCell(
              Timestamp.ToMinutesAndSeconds(x.timestamp)
            ),
            new MarkupHelper.TableCell(
              x.players.map(p => MarkupHelper.Player(p)).join(', ')
            ),
            new MarkupHelper.TableCell(
              timestampsAndNonSoakingPlayers[index].players
                .map(p => MarkupHelper.Player(p))
                .join(', ')
            )
          ])
      ),
      new MarkupHelper.TableRow([
        new MarkupHelper.TableCell('Time'),
        new MarkupHelper.TableCell('Soaked'),
        new MarkupHelper.TableCell("Didn't Soak")
      ]),
      'table table-hover markup-table-details'
    );

    return {
      abilities: MarkupHelper.AbilitiesWithIcons(abilities),
      abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
      timestampsAndPlayersTable: timestampsAndPlayersTable.parse(),
      plural: this.getPlural(average),
      average: MarkupHelper.Info(average.toFixed(1)),
      raidSize: context.raid.players.length,
      playersAndFrequencies: MarkupHelper.PlayersAndFrequencies(
        playersAndFrequencies
      )
    };
  }
}
