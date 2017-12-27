import { InsightConfig } from "app/insights/configs/insight-config";
import { MarkupHelper } from "app/helpers/markup-helper";
import { InsightContext } from "app/insights/models/insight-context";
import { DebuffEvent } from "../../../../fight-events/models/debuff-event";
import { PlayerAndAbility } from "../../../models/player-and-ability";

export class ParaxisTeams extends InsightConfig {

    constructor() {
        super(2075,
            `Sent {total} team{plural} to board the Paraxis.`,
            `{teams}`, null);
    }

    getProperties(context: InsightContext): any {

        const eventConfigNames = [
            "Feedback - Foul Steps",
            "Feedback - Arcane Singularity",
            "Feedback - Targeted",
            "Feedback - Burning Embers"
        ];

        const events = eventConfigNames
          .map(eventConfigName =>
            context.events
            .filter(x => x.config)
            .filter(x => x.config.name == eventConfigName && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x));

        const total = Math.max(...events.map(x => x.length));

        let teams: PlayerAndAbility[][] = [];
        for (let i = 0; i < total; i++) {
            let team = [];
            for (let j = 0; j < events.length; j++) {
                if (events[j].length > i) {
                    team.push(new PlayerAndAbility(events[j][i].target, events[j][i].ability));
                }
            }
            teams.push(team);
        }

        const table = new MarkupHelper.Table(
          teams.map((team, index) => new MarkupHelper.TableRow([
            new MarkupHelper.TableCell((index + 1).toString()),
            new MarkupHelper.TableCell(MarkupHelper.PlayersAndAbilities(team))])),
          new MarkupHelper.TableRow([
            new MarkupHelper.TableCell("#"),
            new MarkupHelper.TableCell("Team")
          ]), "table table-hover markup-table-details");

        return {
            total: total,
            plural: this.getPlural(total),
            teams: table.parse()
        };
    }

}
