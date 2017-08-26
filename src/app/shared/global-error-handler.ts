import { ErrorHandler, Injectable, Injector } from '@angular/core'
import { LoggerService } from "app/shared/logger.service";

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {

    constructor(private injector: Injector) {
        super(true);
    }

    handleError(error) {
        const logger = this.injector.get(LoggerService);
        logger.logError(error);
        super.handleError(error);
    }
}