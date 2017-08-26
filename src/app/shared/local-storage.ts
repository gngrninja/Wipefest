import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorage {

    get(key: string): string {
        return localStorage.getItem(key);
    }

    set(key: string, value: string) {
        localStorage.setItem(key, value);
    }

    setOrRemove(key: string, value: string) {
        if (value) this.set(key, value);
        else this.remove(key);
    }

    clear() {
        localStorage.clear();
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }

    key(index: number): string {
        return localStorage.key(index);
    }

    get length() {
        return localStorage.length;
    }

}