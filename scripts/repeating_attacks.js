/* Lookups Stat Modifiers for Attack To Hit and Damage Rolls */
function manageAttacks(attrs) {
    const sectionName = 'repeating_attacks';
    const fieldNames = ['attack_to_hit_stat', 'attack_damage_stat', 'attack_damage_crit'];

    getSectionIDs(sectionName, function(idarray) {
        let attrKeys = getRepeatingAttrKeys(sectionName, fieldNames, idarray);
        let finalAttrs = [...attrs, ...attrKeys];

        getAttrs(finalAttrs, function(values) {
            let out = {};
            
            idarray.forEach(rowId => {
                const attackToHitKey = `${sectionName}_${rowId}_attack_to_hit_stat`;
                const attackDamageKey = `${sectionName}_${rowId}_attack_damage_stat`;
                const critDamageKey = `${sectionName}_${rowId}_attack_damage_crit`;
                let toHitMod = getModForKey(attackToHitKey, values);
                let damageMod = getModForKey(attackDamageKey, values);
                let critDamage = values[critDamageKey];

                out[`${sectionName}_${rowId}_attack_to_hit_mod`] = toHitMod;
                out[`${sectionName}_${rowId}_attack_damage_mod`] = damageMod;
                out[`${sectionName}_${rowId}_attack_damage_macro`] = `[Damage](~@{character_id}|${sectionName}_${rowId}_attack_damage_roll)`;
                out[`${sectionName}_${rowId}_attack_crit_damage_macro`] = `[Critical Damage](~@{character_id}|${sectionName}_${rowId}_attack_crit_damage_roll)`;
                out[`${sectionName}_${rowId}_has_custom_crit`] = !(!critDamage || critDamage.trim()==='')? '{{custom_crit=1}}' : '{{default_crit=1}}';
            });

            setAttrs(out);
        });
    });
}

// Recompute everything when the sheet is opened (covers characters created before this worker existed).
on('sheet:opened change:repeating_attacks change:repeating_attacks:attack_to_hit_stat change:repeating_attacks:attack_damage_stat change:repeating_attacks:attack_damage_crit', function () {
    manageAttacks(['str_mod', 'int_mod', 'con_mod', 'dex_mod', 'cha_mod']);
});
