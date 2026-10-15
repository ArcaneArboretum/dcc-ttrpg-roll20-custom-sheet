/* Lookups Floor Value and Dynamicall Hide / Show elements on the sheet based on it. */
/* Also bounds the min/max floor numbers so players can't break the sheet. */

const DR_CORE_TRIGGERS = 'sheet:opened change:dr_armor change:dr_buff';
const DR_TARGET_ATTRIBUTES = ['dr_armor', 'dr_buff']

// update modifiers for a given set of score attributes
function updateDRTotal(attrs) {
    getAttrs(attrs, function(values) {
        let drArmor = parseInt(values.dr_armor) || 0;
        let drBuff = parseInt(values.dr_buff) || 0;
        
        let drTotal = drArmor + drBuff;

        let updateAttrs = {};

        updateAttrs['dr_total'] = drTotal;
 
        setAttrs(updateAttrs);
    });
}

on(DR_CORE_TRIGGERS, function () { updateDRTotal(DR_TARGET_ATTRIBUTES) });
