/* Monitors for and applies Mana Rules and Overrides */

// Monitor for the sheet being opened (for sheets created before this worker),
// changes to the int_enhanced or mana_max_override (to update max mana)
// and chnages to the current mana value (to prevent current mana > mana_max)
const MANA_CORE_TRIGGERS = 'sheet:opened change:int_enhanced change:mana_max_override change:mana';
const MANA_TARGET_ATTRIBUTES = ['int_enhanced', 'mana_max_override', 'mana'];

// update the mana and max mana based on sheet rules
function updateMana(attrs) {
    getAttrs(attrs, function(values) {
        let intEnhanced = parseInt(values.int_enhanced) || 0;
        let manaOverride = parseInt(values.mana_max_override) || 0;
        let currentMana = parseInt(values.mana) || 0;

        let maxMana = manaOverride > 0? manaOverride : intEnhanced;

        let updatedMana = currentMana > maxMana? maxMana : currentMana;

        let updateAttrs = {};
        updateAttrs['mana'] = updatedMana;
        updateAttrs['mana_max'] = maxMana;

        setAttrs(updateAttrs);
    });
}

on(MANA_CORE_TRIGGERS, function() { updateMana(MANA_TARGET_ATTRIBUTES) });
