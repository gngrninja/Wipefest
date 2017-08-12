import { Directive, HostListener } from '@angular/core';

/**
* Allows the aside to be toggled via click.
*/
@Directive({
  selector: '[appAsideMenuToggler]',
})
export class AsideToggleDirective {
  constructor() { }

  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    $event.preventDefault();
    document.querySelector('body').classList.toggle('aside-menu-hidden');
  }
}

@Directive({
    selector: '[appMobileAsideMenuToggler]'
})
export class MobileAsideMenuToggleDirective {
    constructor() { }

    @HostListener('click', ['$event'])
    toggleOpen($event: any) {
        $event.preventDefault();
        document.querySelector('body').classList.toggle('aside-menu-mobile-show');
        document.querySelector('body').classList.remove('sidebar-mobile-show');
    }
}