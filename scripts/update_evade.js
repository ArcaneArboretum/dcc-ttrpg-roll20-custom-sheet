/* Lookups Floor Value and Dynamicall Hide / Show elements on the sheet based on it. */
/* Also bounds the min/max floor numbers so players can't break the sheet. */

const EVADE_CORE_TRIGGERS = 'sheet:opened change:dex_mod change:evade_buff';
const EVADE_TARGET_ATTRIBUTES = ['dex_mod', 'evade_buff'];

// update modifiers for a given set of score attributes
function updateEvadeTotal(attrs) {
    getAttrs(attrs, function(values) {
        let dexMod = parseInt(values.dex_mod) || 1;
        let evadeBuff = parseInt(values.evade_buff) || 0;

        let evadeTotal = dexMod + evadeBuff;

        let updateAttrs = {};

        updateAttrs['evade_total_bonus'] = evadeTotal;
 
        setAttrs(updateAttrs);
    });
}

on(EVADE_CORE_TRIGGERS, function () { updateEvadeTotal(EVADE_TARGET_ATTRIBUTES) });
