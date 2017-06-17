import { Router } from "@angular/router";
import { Response } from "@angular/http";
import { WipefestService } from "app/wipefest.service";
import { environment } from "../environments/environment";

export module ErrorHandler {

    export function GoToErrorPage(error: Response, wipefestService: WipefestService, router: Router) {

        wipefestService.throwError(error);

        if (environment.production) {
            router.navigate(["/error"]);
        } else {
            throw error;
        }

    }

}