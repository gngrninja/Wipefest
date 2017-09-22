import { Component, Input, ViewChild, OnInit, EventEmitter, Output } from '@angular/core';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';

@Component({
    selector: 'auto-complete',
    templateUrl: './auto-complete.component.html',
    styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent implements OnInit {

    @ViewChild("autoComplete") autoComplete;

    @Input() data: AutoCompleteCategory[];
    @Input() placeholder: string;
    @Input() height = 200;
    @Input() selectedCategory = "";
    @Input() selectedValue = "";

    highlightedCategory = "";
    highlightedValue = "";

    @Output() valueSelected = new EventEmitter<AutoCompleteSelectedValue>();

    @ViewChild("value") value;
    get width() {
        return this.value.nativeElement.scrollWidth + 0.5;
    }

    collapsed = true;

    get displayValue() {
        if (this.selectedValue == "") {
            return this.placeholder;
        } else {
            return `${this.selectedValue} (${this.selectedCategory})`
        }
    }

    search = "";
    @ViewChild("searchBox") searchBox;

    filteredData: AutoCompleteCategory[] = [];
    filter() {
        this.filteredData = this.filterData();
    }
    filterData(): AutoCompleteCategory[] {
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
        this.scrollToHighlighted();
        setTimeout(() => this.searchBox.nativeElement.focus(), 50);
    }

    close() {
        this.collapsed = true;
        this.autoComplete.nativeElement.focus();
    }
    
    up(event: Event) {
        event.preventDefault();

        if (this.highlightedCategory == "" && this.highlightedValue == "") {
            return;
        }

        let filteredData = this.filteredData;
        if (filteredData.length == 0) {
            this.highlightedCategory = "";
            this.highlightedValue = "";
            return;
        }

        let categoryIndex = filteredData.findIndex(x => x.name == this.highlightedCategory);
        let values = filteredData[categoryIndex].values;
        let valueIndex = values.findIndex(x => x == this.highlightedValue);

        if (valueIndex == 0) {
            if (categoryIndex == 0) {
                return;
            }

            this.highlightedCategory = filteredData[categoryIndex - 1].name;
            this.highlightedValue = filteredData[categoryIndex - 1].values[filteredData[categoryIndex - 1].values.length - 1];
            return;
        }

        this.highlightedValue = values[valueIndex - 1];
    }

    down(event: Event) {
        event.preventDefault();

        let filteredData = this.filteredData;
        if (filteredData.length == 0) {
            this.highlightedCategory = "";
            this.highlightedValue = "";
            return;
        }

        if (this.highlightedCategory == "" && this.highlightedValue == "") {
            this.highlightedCategory = filteredData[0].name;
            this.highlightedValue = filteredData[0].values[0];
            return;
        }

        let categoryIndex = filteredData.findIndex(x => x.name == this.highlightedCategory);
        let values = filteredData[categoryIndex].values;
        let valueIndex = values.findIndex(x => x == this.highlightedValue);

        if (valueIndex == values.length - 1) {
            if (categoryIndex == filteredData.length - 1) {
                return;
            }

            this.highlightedCategory = filteredData[categoryIndex + 1].name;
            this.highlightedValue = filteredData[categoryIndex + 1].values[0];
            return;
        }

        this.highlightedValue = values[valueIndex + 1];
    }

    scrollToHighlighted() {
        if (this.highlightedCategory != "" && this.highlightedValue != "") {
            let li = document.getElementById(this.highlightedCategory + '-' + this.highlightedValue);
            if (li) {
                scrollIntoViewIfNeeded(li, false);
            }
        }
    }
    
    select(category: string, value: string) {
        this.close();

        if (!this.filteredData.some(x => x.name == category && x.values.some(y => y == value))) {
            return;
        }

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
