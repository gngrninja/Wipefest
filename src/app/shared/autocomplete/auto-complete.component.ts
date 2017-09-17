import { Component, Input, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'auto-complete',
    templateUrl: './auto-complete.component.html',
    styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent implements OnInit {

    @Input() data: AutoCompleteCategory[];
    @Input() placeholder: string;
    @Input() height = 200;
    @Input() selectedCategory = "";
    @Input() selectedValue = "";

    @Output() valueSelected = new EventEmitter<AutoCompleteSelectedValue>();

    @ViewChild("value") value;
    get width() {
        return this.value.nativeElement.scrollWidth + 0.5;
    }

    collapsed = true;

    //selectedCategory = "";
    //selectedValue = "";

    get displayValue() {
        if (this.selectedValue == "") {
            return this.placeholder;
        } else {
            return `${this.selectedValue} (${this.selectedCategory})`
        }
    }

    search = "";
    @ViewChild("searchBox") searchBox;

    get filteredData() {
        if (this.search.trim().length < 1) return [];

        return this.clone(this.data)
            .map(x => {
                x.values = x.values
                    .filter(v => v.toLowerCase().indexOf(this.search.trim().toLowerCase()) != -1);
                return x;
            })
            .filter(x => x.values.length > 0);
    }
    
    private clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    ngOnInit() {
        window.addEventListener("click", (e: any) => {
            let dataContainer = document.getElementsByClassName("data-container").item(0);
            if (dataContainer && !dataContainer.contains(e.target) && !this.value.nativeElement.contains(e.target)) {
                this.collapsed = true;
            }
        });
    }

    toggle() {
        if (this.collapsed) this.open();
        else this.close();
    }

    open() {
        this.collapsed = false;
        setTimeout(() => this.searchBox.nativeElement.focus(), 50);
    }

    close() {
        this.collapsed = true;
    }

    private select(category: string, value: string) {
        this.close();
        this.selectedCategory = category;
        this.selectedValue = value;
        this.valueSelected.emit(new AutoCompleteSelectedValue(category, value));
    }

}

export class AutoCompleteCategory {
    constructor(public name: string, public values: string[]) { }
}
export class AutoCompleteSelectedValue {
    constructor(public category: string, public value: string) { }
}
