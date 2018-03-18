import { Injectable } from "@angular/core";
import { EventConfigFilter, EventConfigCombinedFilter, EventConfig, EventConfigIndex } from "app/event-config/event-config";
import { Http } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { environment } from "environments/environment";
import { SpecializationsService } from "app/engine/specializations/specializations.service";
import { EncountersService } from "app/engine/encounters/encounters.service";
import { Raid } from "app/engine/raid/raid";
import { Actor } from "app/engine/reports/report";
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class EventConfigService {

    constructor(private encountersService: EncountersService, private specializationsService: SpecializationsService, private http: Http) { }

    getIncludesForBoss(bossId: number, eventConfigLocation: EventConfigLocation): Observable<string[]> {
        let url = this.getBaseUrl(eventConfigLocation);

        return this.getEventConfigIndex(url).map(x => x.find(boss => boss.id == bossId).includes);
    }

    getIncludesForFocuses(focuses: number[], friendlies: Actor[], raid: Raid): string[] {
        if (!focuses || !friendlies || !raid)
            return [];

        return raid.players
            .filter(x => {
            let friendly = friendlies.find(f => f.name == x.name);
            return friendly && focuses.indexOf(friendly.id) != -1;
        })
            .map(x => [x.specialization.include, x.specialization.generalInclude])
            .reduce((x, y) => x.concat(y))
            .filter((x, index, array) => array.indexOf(x) == index);
    }

    getEventConfigs(includes: string[], eventConfigLocation: EventConfigLocation): Observable<EventConfig[]> {
        let url = this.getBaseUrl(eventConfigLocation);

        let batch: Observable<EventConfig[]>[] = [];

        includes.forEach(include => {
            let observable = this.http.get(url + include + ".json")
                .map(response => {
                    let configs = response.json().map(config => {
                        config.showByDefault = config.show;
                        config.collapsedByDefault = config.collapsed == true;
                        config.file = include;
                        config.group = this.fileToGroup(include);
                        return config;
                    });
                    return configs;
                })
                .catch(error => this.handleError(error));

            batch.push(observable);
        });

        return Observable.forkJoin(batch)
            .map(x => [].concat.apply([], x)); // Flatten arrays into one array
    }

    private fileToGroup(file: string): string {
        let encounters = this.encountersService.getEncounters();

        switch (file) {
            case "general/raid": return "R";
            case "general/focus": return "F";
            case "general/tank": return "T";
            case "general/healer": return "H";
            case "general/ranged": return "RA";
            case "general/melee": return "M";
        }

        for (var i = 0; i < encounters.length; i++) {
            let encounter = encounters[i];
            let normalizedFile = this.normalize(file);
            let normalizedName = this.normalize(encounter.name);
            if (normalizedFile.indexOf(normalizedName) != -1) {
                return encounter.id.toString();
            }
        }

        for (var i = 0; i < this.specializationsService.getSpecializations().length; i++) {
            let specialization = this.specializationsService.getSpecializations()[i];
            if (file == specialization.include) {
                return specialization.group;
            }
            if (file == specialization.generalInclude) {
                return specialization.generalGroup;
            }
        }

        return "ungrouped";
    }

    private normalize(name: string): string {
        return name.split(" ").join("").split("-").join("").split("'").join("").toLowerCase();
    }

    private getEventConfigIndex(url: string): Observable<EventConfigIndex[]> {
        return this.http.get(url + "index.json")
            .map(response => response.json())
            .catch(error => this.handleError(error));
    }

    private handleError(error: Response | any): Observable<Response> {
        return Observable.throw(error);
    }

    private getBaseUrl(eventConfigLocation: EventConfigLocation): string {
        let url = environment.eventConfigsUrl;
        if (eventConfigLocation.account) {
            url = url.replace("JoshYaxley", eventConfigLocation.account);
        }
        if (eventConfigLocation.branch) {
            url = url.replace("master", eventConfigLocation.branch);
        }

        return url;
    }

    combineFilters(eventConfigFilters: EventConfigFilter[]): EventConfigCombinedFilter[] {
        let combinedFilters: EventConfigCombinedFilter[] = [];

        eventConfigFilters.filter(x => x != undefined).forEach(filter => {
            if (!filter.types) {
                filter.types = [filter.type];
            }

            filter.types.forEach(type => {
                if (filter.query && !combinedFilters.some(x => x.query == filter.query)) {
                    combinedFilters.push(new EventConfigCombinedFilter(type, filter.stack ? filter.stack : 0, [filter], filter.query));
                } else {
                    let index = combinedFilters.findIndex(x => !x.query && x.type == type && x.stack == (filter.stack ? filter.stack : 0));

                    if (index != -1) {
                        combinedFilters[index].filters.push(filter);
                    } else {
                        combinedFilters.push(new EventConfigCombinedFilter(type, filter.stack ? filter.stack : 0, [filter]));
                    }
                }
            });
        });

        return combinedFilters;
    }

}

export class EventConfigLocation {

    constructor(public account: string, public branch: string) { }

}
