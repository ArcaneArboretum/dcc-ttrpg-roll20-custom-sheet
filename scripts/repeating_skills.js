/* Lookups Stat Modifiers for Skill To Hit and Damage Rolls */
/* Hides sections of the Skill block based on skill type */
function manageSkills(attrs) {
    const sectionName = 'repeating_skills';
    const fieldNames = ['skill_type', 'skill_check_stat'];
    
    getSectionIDs(sectionName, function(idarray) {
        let attrKeys = getRepeatingAttrKeys(sectionName, fieldNames, idarray);
        let finalAttrs = [...attrs, ...attrKeys];

        getAttrs(finalAttrs, function(values) {
            let out = {};

            idarray.forEach(rowId => {
                let skillTypeKey = `${sectionName}_${rowId}_skill_type`;
                let checkStatKey = `${sectionName}_${rowId}_skill_check_stat`;
                let checkModKey = `${sectionName}_${rowId}_skill_check_mod`;
                
                let skillType = values[skillTypeKey];

                if(skillType == 'passive') { // hide the check section
                    out[`${sectionName}_${rowId}_skill_type_has_check`] = 'hidden';
                } else { // otherwise, show it
                    out[`${sectionName}_${rowId}_skill_type_has_check`] = '';
                }
                
                let checkMod = getModForKey(checkStatKey, values);
                out[checkModKey] = checkMod;
            });

            setAttrs(out);
        });
    });
}

// Recompute everything when the sheet is opened (covers characters created before this worker existed).
on('sheet:opened change:repeating_skills change:repeating_skills:skill_type change:repeating_skills:skill_check_stat', function () {
    manageSkills(['str_mod', 'int_mod', 'con_mod', 'dex_mod', 'cha_mod']);
});
