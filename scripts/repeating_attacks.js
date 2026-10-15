/* Lookups Stat Modifiers for Attack To Hit and Damage Rolls */
function manageAttacks(attrs) {
    const sectionName = 'repeating_attacks';
    const fieldNames = ['attack_to_hit_stat', 'attack_damage_stat'];

    getSectionIDs(sectionName, function(idarray) {
        let attrKeys = getRepeatingAttrKeys(sectionName, fieldNames, idarray);
        let finalAttrs = [...attrs, ...attrKeys];

        getAttrs(finalAttrs, function(values) {
            let out = {};
            
            idarray.forEach(rowId => {
                const attackToHitKey = `${sectionName}_${rowId}_attack_to_hit_stat`;
                const attackDamageKey = `${sectionName}_${rowId}_attack_damage_stat`;
                let toHitMod = getModForKey(attackToHitKey, values);
                let damageMod = getModForKey(attackDamageKey, values);

                out[`${sectionName}_${rowId}_attack_to_hit_mod`] = toHitMod;
                out[`${sectionName}_${rowId}_attack_damage_mod`] = damageMod;
            });

            setAttrs(out);
        });
    });
}

// Recompute everything when the sheet is opened (covers characters created before this worker existed).
on('sheet:opened change:repeating_attacks change:repeating_attacks:attack_to_hit_stat change:repeating_attacks:attack_damage_stat', function () {
    manageAttacks(['str_mod', 'int_mod', 'con_mod', 'dex_mod', 'cha_mod']);
});
