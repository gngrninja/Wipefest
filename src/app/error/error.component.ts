﻿import { Component, OnInit } from '@angular/core';
import { WipefestService } from "app/wipefest.service";
import { Response } from "@angular/http";

@Component({
    selector: 'app-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
    error: Response;

    title = "Error";
    message = "An error has occurred.";

    constructor(private wipefestService: WipefestService) { }

    ngOnInit() {
        this.error = this.wipefestService.getLastError();

        if (this.error) {
            this.title = this.error.statusText + " :(";

            switch (this.error.status) {
                case 503: this.message = "It looks like Warcraft Logs is unavailable. This could be due to heavy server load. Please try again later."; break;
                case 429: this.message = "Wipefest has exceeded the number of calls that Warcraft Logs will allow it to make. Please try again later."; break;
                case 404: this.message = "Whatever you were looking for couldn't be found."; break;
                default: this.message = this.error.json().error; break;
            }
        }
    }

}