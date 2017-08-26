import { Directive, HostListener } from '@angular/core';
import { LoggerService } from "app/shared/logger.service";

/**
* Allows the aside to be toggled via click.
*/
@Directive({
    selector: '[appAsideMenuToggler]',
})
export class AsideToggleDirective {
    constructor(private logger: LoggerService) { }

    @HostListener('click', ['$event'])
    toggleOpen($event: any) {
        $event.preventDefault();
        document.querySelector('body').classList.toggle('aside-menu-hidden');

        let shown = !document.querySelector('body').classList.contains('aside-menu-hidden');
        this.logger.logToggleDesktopRaidMenu(shown);
    }
}

@Directive({
    selector: '[appMobileAsideMenuToggler]'
})
export class MobileAsideMenuToggleDirective {
    constructor(private logger: LoggerService) { }

    @HostListener('click', ['$event'])
    toggleOpen($event: any) {
        $event.preventDefault();
        document.querySelector('body').classList.toggle('aside-menu-mobile-show');
        document.querySelector('body').classList.remove('sidebar-mobile-show');

        let shown = document.querySelector('body').classList.contains('aside-menu-mobile-show');
        this.logger.logToggleMobileRaidMenu(shown);
    }
}