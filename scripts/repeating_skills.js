/* Lookups Stat Modifiers for Skill To Hit and Damage Rolls */
/* Hides sections of the Skill block based on skill type */
function manageSkills(attrs) {
    const sectionName = 'repeating_skills';
    const fieldNames = ['skill_type', 'skill_unopposed_check_stat', 'skill_opposed_check_stat'];
    
    getSectionIDs(sectionName, function(idarray) {
        let attrKeys = getRepeatingAttrKeys(sectionName, fieldNames, idarray);
        let finalAttrs = [...attrs, ...attrKeys];

        getAttrs(finalAttrs, function(values) {
            let out = {};

            idarray.forEach(rowId => {
                let skillTypeKey = `${sectionName}_${rowId}_skill_type`;
                let unopposedStatKey = `${sectionName}_${rowId}_skill_unopposed_check_stat`;
                let opposedStatKey = `${sectionName}_${rowId}_skill_opposed_check_stat`;
                
                let skillType = values[skillTypeKey];

                if(skillType == 'unopposed') {
                    out[`${sectionName}_${rowId}_skill_type_unopposed`] = '';
                    out[`${sectionName}_${rowId}_skill_type_opposed`] = 'hidden';
                } else if(skillType == 'opposed') {
                    out[`${sectionName}_${rowId}_skill_type_unopposed`] = 'hidden';
                    out[`${sectionName}_${rowId}_skill_type_opposed`] = '';
                } else if(skillType == 'passive') { // show no sections
                    out[`${sectionName}_${rowId}_skill_type_unopposed`] = 'hidden';
                    out[`${sectionName}_${rowId}_skill_type_opposed`] = 'hidden';
                } else if(skillType == 'other') { // show all sections
                    out[`${sectionName}_${rowId}_skill_type_unopposed`] = '';
                    out[`${sectionName}_${rowId}_skill_type_opposed`] = '';
                }
                
                let unopposedMod = getModForKey(unopposedStatKey, values);
                let opposedMod = getModForKey(opposedStatKey, values);

                out[`${sectionName}_${rowId}_skill_unopposed_check_mod`] = unopposedMod;
                out[`${sectionName}_${rowId}_skill_opposed_check_mod`] = opposedMod;
            });

            setAttrs(out);
        });
    });
}

// Recompute everything when the sheet is opened (covers characters created before this worker existed).
on('sheet:opened change:repeating_skills change:repeating_skills:skill_type change:repeating_skills:skill_unopposed_check_stat change:repeating_skills:skill_opposed_check_stat', function () {
    manageSkills(['str_mod', 'int_mod', 'con_mod', 'dex_mod', 'cha_mod']);
});
