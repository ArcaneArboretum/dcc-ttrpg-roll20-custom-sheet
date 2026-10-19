/* Monitors for Changes to the Health Bar Size or Values and Applies Updates */
/* Also Monitors for Checkbox changes and sizing of the checkbox counter for Dying Debuff */

// Monitor layout adjustments across checkboxes, values, changes, and configurations
const DEATH_CHECK_TRIGGERS = DEATH_SEGMENTS_COUNTER.map(i => `change:dying_${i}_checked`).join(' ');
const DEATH_CORE_TRIGGERS = 'sheet:opened change:con_mod change:rounds_before_death_override';
const DEATH_TARGET_ATTRIBUTES = [
    'con_mod',
    'rounds_before_death_override',
    'rounds_before_death',
    'dying_display_numbers',
    'dying_display_checks',
    ...DEATH_SEGMENTS_COUNTER.map(i => `dying_${i}_checked`),
];

function updateDyingChecks(targetAttributes) {
    getAttrs(targetAttributes, function(values) {
        const CON_MOD = parseInt(values.con_mod) || DEFAULT_MODIFIER;
        let totalSegments = parseInt(values.rounds_before_death_override) || CON_MOD;
        
        if (totalSegments > MAX_DEATH_SEGMENTS) totalSegments = MAX_DEATH_SEGMENTS;
        if (totalSegments < 1) totalSegments = 1;

        let updateAttrs = {};
        let totalChecked = 0;

        DEATH_SEGMENTS_COUNTER.forEach(i => {
            if (i <= totalSegments) {                
                // Clear active hidden layout states on sibling node elements
                updateAttrs[`dying_${i}_active`] = '';

                let isChecked = (parseInt(values[`dying_${i}_checked`]) || 0) === 1;

                if (isChecked) {
                    totalChecked++; 
                }
            } else {
                // Write 'hidden' into the toggle input box to force CSS cleanup
                updateAttrs[`dying_${i}_active`] = 'hidden'; 
            }
        });

        updateAttrs['rounds_before_death'] = totalSegments - totalChecked;

        setAttrs(updateAttrs);
    });
}

// Monitor layout adjustments across checkboxes, values, changes, and configurations
const HB_CHECK_TRIGGERS = HB_SEGMENTS_COUNTER.map(i => `change:health_seg_${i}_checked`).join(' ');
const HB_OVERRIDE_TRIGGERS = HB_SEGMENTS_COUNTER.map(i => `change:health_seg_${i}_override`).join(' ');
const HB_CORE_TRIGGERS = 'sheet:opened change:health_bar_slots_max change:con_mod change:rounds_before_death_override change:sheet_type change:level';

const HB_TARGET_ATTRIBUTES = [
    'health_bar_slots_max',
    'con_mod',
    'rounds_before_death_override',
    'rounds_before_death',
    'sheet_type',
    'level',
    ...HB_SEGMENTS_COUNTER.map(i => `health_seg_${i}_checked`),
    ...HB_SEGMENTS_COUNTER.map(i => `health_seg_${i}_override`)
];

function updateHealthBar(targetAttributes, eventInfo) {
    getAttrs(targetAttributes, function(values) {
        let updateAttrs = {};
        const CON_MOD = parseInt(values.con_mod) || DEFAULT_MODIFIER;

        // NPC sheets include sheet_type 1 or 2
        // Sheet Type 1 == "NPC, Boss, Mob, etc."
        // Sheet Type 2 == "GMC"
        // Sheet Type 3 == "Crawler"
        // Sheet Type 4 == "Pet"
        // Sheet Tpye 5 == "Vehicle"
        let isNpcSheet = [1,2].includes(parseInt(values.sheet_type));

        let healthBarMaxOverride = parseInt(values.health_bar_slots_max) || DEFAULT_HB_SEGMENTS;

        let totalSegments = healthBarMaxOverride;

        // by default, Mobs, NPCs, etc. use their level as the number of HB segments, instead of a fixed 10.
        // so, if the level was changed on an NPC sheet, update the health segments to reflect the level so long as the override isn't set to something different
        if(isNpcSheet && eventInfo && eventInfo.sourceAttribute && eventInfo.sourceAttribute === 'level') {
            let originalLevel = parseInt(eventInfo.previousValue) || 0;
            let newLevel = parseInt(eventInfo.newValue) || 0;

            // update the totalSegments in the following conditions:
            // 1. the original level was never set (setting level for the first time)
            // 2. the healthBar segments currently set are = the original level before the change AND the new level is at or below 10 (since mobs above level 10 still have 10 HB slots).
            if(originalLevel === 0 || (healthBarMaxOverride === originalLevel && newLevel <= DEFAULT_HB_SEGMENTS)) {
                totalSegments = newLevel;
            }
        }

        if (totalSegments > MAX_HB_SEGMENTS) totalSegments = MAX_HB_SEGMENTS;
        if (totalSegments < 1) totalSegments = 1;

        updateAttrs['health_bar_slots_max'] = totalSegments;

        let totalRoundsBeforeDeath = parseInt(values.rounds_before_death_override) || CON_MOD;

        updateAttrs['rounds_before_death_total'] = totalRoundsBeforeDeath;
        
        let highestUnchecked = 0;
        let lowestChecked = totalSegments + 1;
        let isCheckEvent = false;
        let isUncheckEvent = false;

        HB_SEGMENTS_COUNTER.forEach(i => {
            if (i <= totalSegments) {
                let pctValue = Math.round((i / totalSegments) * 100);
                updateAttrs[`health_seg_${i}_pct`] = `${pctValue}%`;
                
                // Clear active hidden layout states on sibling node elements
                updateAttrs[`health_seg_${i}_active`] = ''; 
                
                // Override from settings page
                let override = parseInt((values[`health_seg_${i}_override`] || '').trim())
                let finalValue = isNaN(override)? CON_MOD : override;
                updateAttrs[`health_seg_${i}_val`] = finalValue;

                let checkbox_tag = `health_seg_${i}_checked`;
                let isUnchecked = (parseInt(values[checkbox_tag]) || 0) === 0;

                if (isUnchecked) {
                    highestUnchecked = i; 
                } else if (i < lowestChecked) {
                    lowestChecked = i;
                }

                if(eventInfo.sourceAttribute == checkbox_tag) {
                    isCheckEvent = (parseInt(eventInfo.newValue) || 0) === 1;
                    isUncheckEvent = !isCheckEvent;
                }
            } else {
                // Write 'hidden' into the toggle input box to force CSS cleanup
                updateAttrs[`health_seg_${i}_active`] = 'hidden'; 
            }
        });

        // check or uncheck related boxes based on whether this was a check event or an uncheck event
        // this will automatically check all boxes at higher percentages than the one just checked
        // if you checked a box, or uncheck all boxes at lower percentages than the one just unchecked
        // if you unchecked a box.
        if(isCheckEvent || isUncheckEvent) {
            // check boxes that are above our lowest checked box according to the type of event
            HB_SEGMENTS_COUNTER.forEach(i => {
                if (isCheckEvent && i >= lowestChecked){
                    updateAttrs[`health_seg_${i}_checked`] = '1';
                } else if(isUncheckEvent && i <= highestUnchecked) {
                    updateAttrs[`health_seg_${i}_checked`] = '0';
                }
            });

            highestUnchecked = 0;
            // finally, calculate the highest unchecked value again after manually checking/unchecking the boxes
            HB_SEGMENTS_COUNTER.forEach(i => {
                let isUnchecked = (parseInt(updateAttrs[`health_seg_${i}_checked`]) || 0) === 0;
                if(isUnchecked) {
                    highestUnchecked = i;
                }
            })
        }        

        updateAttrs['health_bar_slots'] = highestUnchecked;

        if(highestUnchecked === 0) {
            updateAttrs['is_dying'] = '';
            updateAttrs['rounds_before_death'] = totalRoundsBeforeDeath;
            DEATH_SEGMENTS_COUNTER.forEach(i => {
                updateAttrs[`dying_${i}_checked`] = '0';
            });
        } else{
            updateAttrs['is_dying'] = 'hidden';
        }

        let currentHealthPercent = (updateAttrs[`health_seg_${highestUnchecked}_pct`] || '').trim();
        let parsedHealthPercent = parseInt(currentHealthPercent);
        let finalHealthPercent = highestUnchecked === 0 || isNaN(parsedHealthPercent)? 0 : parsedHealthPercent;

        updateAttrs['health_percent'] = finalHealthPercent;
        updateAttrs['health_percent_max'] = 100;

        setAttrs(updateAttrs);
    });
}

on(`${HB_CHECK_TRIGGERS} ${HB_OVERRIDE_TRIGGERS} ${HB_CORE_TRIGGERS}`, function(eventInfo) { updateHealthBar(HB_TARGET_ATTRIBUTES, eventInfo); });
on(`${DEATH_CHECK_TRIGGERS} ${DEATH_CORE_TRIGGERS}`, function() { updateDyingChecks(DEATH_TARGET_ATTRIBUTES); });
