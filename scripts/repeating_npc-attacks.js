/* Lookups Stat Modifiers for Attack To Hit and Damage Rolls */
function manageNpcAttacks(attrs) {
    const sectionName = 'repeating_npc-attacks';
    const fieldNames = ['floor'];

    getSectionIDs(sectionName, function(idarray) {
        let attrKeys = getRepeatingAttrKeys(sectionName, fieldNames, idarray);
        let finalAttrs = [...attrs, ...attrKeys];

        getAttrs(finalAttrs, function(values) {
            let out = {};
            
            idarray.forEach(rowId => {
                const attackFloorKey = `${sectionName}_${rowId}_floor`;

                out[attackFloorKey] = values.floor;
            });

            setAttrs(out);
        });
    });
}

// Recompute everything when the sheet is opened (covers characters created before this worker existed).
on('sheet:opened change:repeating_npc-attacks change:floor', function () {
    manageNpcAttacks(['floor']);
});
