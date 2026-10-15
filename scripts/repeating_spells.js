/* Lookups Stat Modifiers for Spell To Hit and Damage Rolls */
/* Hides sections of the Spell block based on spell type */
function manageSpells(attrs) {
    const sectionName = 'repeating_spells';
    const fieldNames = ['spell_type', 'spell_to_hit_stat', 'spell_damage_stat', 'spell_check_stat', 'spell_healing_stat'];
    
    getSectionIDs(sectionName, function(idarray) {
        let attrKeys = getRepeatingAttrKeys(sectionName, fieldNames, idarray);
        let finalAttrs = [...attrs, ...attrKeys];

        getAttrs(finalAttrs, function(values) {
            let out = {};

            idarray.forEach(rowId => {
                const typeKey = `${sectionName}_${rowId}_spell_type`;
                const toHitStatKey = `${sectionName}_${rowId}_spell_to_hit_stat`;
                const damageStatKey = `${sectionName}_${rowId}_spell_damage_stat`;
                const checkStatKey = `${sectionName}_${rowId}_spell_check_stat`;
                const healingStatKey = `${sectionName}_${rowId}_spell_healing_stat`;
                
                let spellType = values[typeKey];

                if(spellType == 'attack') {
                    out[`${sectionName}_${rowId}_spell_type_attack`] = '';
                    out[`${sectionName}_${rowId}_spell_type_skill_check`] = 'hidden';
                    out[`${sectionName}_${rowId}_spell_type_healing`] = 'hidden';
                } else if(spellType == 'skill_check') {
                    out[`${sectionName}_${rowId}_spell_type_attack`] = 'hidden';
                    out[`${sectionName}_${rowId}_spell_type_skill_check`] = '';
                    out[`${sectionName}_${rowId}_spell_type_healing`] = 'hidden';
                } else if(spellType == 'healing') {
                    out[`${sectionName}_${rowId}_spell_type_attack`] = 'hidden';
                    out[`${sectionName}_${rowId}_spell_type_skill_check`] = 'hidden';
                    out[`${sectionName}_${rowId}_spell_type_healing`] = '';
                } else if(spellType == 'passive') { // show no sections
                    out[`${sectionName}_${rowId}_spell_type_attack`] = 'hidden';
                    out[`${sectionName}_${rowId}_spell_type_skill_check`] = 'hidden';
                    out[`${sectionName}_${rowId}_spell_type_healing`] = 'hidden';
                } else if(spellType == 'other') { // show all sections
                    out[`${sectionName}_${rowId}_spell_type_attack`] = '';
                    out[`${sectionName}_${rowId}_spell_type_skill_check`] = '';
                    out[`${sectionName}_${rowId}_spell_type_healing`] = '';
                }

                let toHitStatMod = getModForKey(toHitStatKey, values);
                let damageStatMod = getModForKey(damageStatKey, values);
                let checkStatMod = getModForKey(checkStatKey, values);
                let healingStatMod = getModForKey(healingStatKey, values);

                out[`${sectionName}_${rowId}_spell_to_hit_mod`] = toHitStatMod;
                out[`${sectionName}_${rowId}_spell_damage_mod`] = damageStatMod;
                out[`${sectionName}_${rowId}_spell_check_mod`] = checkStatMod;
                out[`${sectionName}_${rowId}_spell_healing_mod`] = healingStatMod;
            });

            setAttrs(out);
        });
    });
}

// Recompute everything when the sheet is opened (covers characters created before this worker existed).
on('sheet:opened change:repeating_spells change:repeating_spells:spell_type change:repeating_spells:spell_to_hit_stat change:repeating_spells:spell_damage_stat change:repeating_spells:spell_check_stat change:repeating_spells:spell_healing_stat', function () {
    manageSpells(['str_mod', 'int_mod', 'con_mod', 'dex_mod', 'cha_mod']);
});
