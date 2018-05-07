import {
  ChangeDetectorRef,
  ErrorHandler,
  Injectable,
  Injector
} from '@angular/core';
import { LoggerService } from 'app/shared/logger.service';
import { environment } from 'environments/environment';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
  constructor(private injector: Injector) {
    super();
  }

  handleError(error) {
    // Infinite error loop bug in dev mode, fix from: https://github.com/angular/angular/issues/17010
    const debugCtx = error.ngDebugContext;
    const changeDetectorRef =
      debugCtx && debugCtx.injector.get(ChangeDetectorRef);
    if (changeDetectorRef) {
      changeDetectorRef.detach();
    }

    const logger = this.injector.get(LoggerService);
    logger.logError(error);

    if (!environment.production) {
      console.error(error);
    }
  }
}
