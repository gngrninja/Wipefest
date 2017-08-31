import { ErrorHandler, Injectable, Injector } from '@angular/core'
import { LoggerService } from "app/shared/logger.service";
import { environment } from "environments/environment";

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

    constructor(private injector: Injector) {
        super(true);
    }

    handleError(error) {
        const logger = this.injector.get(LoggerService);
        logger.logError(error);

        if (!environment.production) {
            console.log(error);
        }
    }
}