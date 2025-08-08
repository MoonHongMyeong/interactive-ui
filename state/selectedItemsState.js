const targets = new Set();

export const selectionState = {
    get() {
        return targets;
    },

    add(element) {
        if ( !targets.has(element) ) {
            targets.add(element);
            return targets;
        }
    },

    delete(element) {
        if ( targets.has(element) ) {
            targets.delete(element);
            return targets;
        }
    },

    clear() {
        if ( targets.size > 0 ) {
            targets.clear();
            return targets;
        }
    },

    toggle(element) {
        if ( targets.has(element) ) {
            targets.delete(element);
        }else {
            targets.add(element);
        }

        return targets;
    }

}