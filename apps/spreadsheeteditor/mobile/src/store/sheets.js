
import {observable, action, makeObservable, computed} from 'mobx';

class Worksheet {
    sheet = {
        index       : -1,
        active      : false,
        name        : '',
        locked      : false,
        hidden      : false,
        color       : ''
    };

    constructor(data = {}) {
        makeObservable(this, {
            sheet: observable
        });
        this.sheet.merge(data);
    }
}

export class storeWorksheets {
    sheets;

    constructor() {
        makeObservable(this, {
            sheets: observable,
            resetSheets: action,
            setActiveWorksheet: action,
            activeWorksheet: computed,

            isWorkbookLocked: observable,
            setWorkbookLocked: action,

            isWorksheetLocked: observable,
            setWorksheetLocked: action,

            isProtectedWorkbook: observable,
            setProtectedWorkbook: action,

            wsProps: observable,
            setWsProps: action
        });
        this.sheets = [];
    }

    resetSheets(sheets) {
        this.sheets = Object.values(sheets)
    }

    setActiveWorksheet(i) {
        if ( !this.sheets[i].active ) {
            this.sheets.forEach(model => {
                if ( model.active )
                    model.active = false;
            });

            this.sheets[i].active = true;
        }
    }

    get activeWorksheet() {
        for (let i = 0; i < this.sheets.length; i++) {
            if (this.sheets[i].active)
                return i;
        }
        return -1;
    }

    at(i) {
        return this.sheets[i]
    }

    hasHiddenWorksheet() {
        return this.sheets.some(model => model.hidden);
    }

    hiddenWorksheets() {
        return this.sheets.filter(model => model.hidden);
    }

    visibleWorksheets() {
        return this.sheets.filter(model => !model.hidden);
    }

    isWorkbookLocked = false;
    setWorkbookLocked(locked) {
        this.isWorkbookLocked = locked;
    }

    isWorksheetLocked = false;
    setWorksheetLocked(index, locked) {
        let model = this.sheets[index];
        if(model && model.locked !== locked)
            model.locked = locked;
        this.isWorkbookLocked = locked;
    }

    isProtectedWorkbook = false;
    setProtectedWorkbook(value) {
        this.isProtectedWorkbook = value;
    }

    wsProps;
    setWsProps(value) {
        this.wsProps = value;
    }
}
