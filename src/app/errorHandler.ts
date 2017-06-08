import { Router } from "@angular/router";
import { Response } from "@angular/http";
import { WipefestService } from "app/wipefest.service";

export module ErrorHandler {

    export function GoToErrorPage(error: Response, wipefestService: WipefestService, router: Router) {

        wipefestService.throwError(error);
        router.navigate(["/error"]);

    }

}