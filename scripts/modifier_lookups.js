/* Lookups Stat Modifiers According to the Modifier Table for DCC */

// lookup the appropriate stat modifier given a score value
function statMod(score) {
    let n = parseInt(score, 10);
    if (isNaN(n)) { return 0; }
    for (let i = 0; i < STAT_MODIFIER_LOOKUP_TABLE.length; i++) {
        if (n >= STAT_MODIFIER_LOOKUP_TABLE[i][0]) { 
            return STAT_MODIFIER_LOOKUP_TABLE[i][1];
        }
    }
    return 0;
}

// update modifiers for a given set of score attributes
function updateMods(scoreAttrs) {
    getAttrs(scoreAttrs, function (values) {
        let out = {};
        scoreAttrs.forEach(function (attr) {
            let modAttr = scoreAttrsToMods.get(attr);
            out[modAttr] = statMod(values[attr]);
        });
        setAttrs(out);
    });
}

var scoreAttrsToMods = new Map();

// setup updaters for any time one of the enhanced or unenhanced attributes changes
STAT_KEYS.forEach(function (stat) {
    let attr = stat + '_enhanced';
    let mod = stat + '_mod';
    scoreAttrsToMods.set(attr, mod);
    on('change:' + attr, function () { updateMods([attr]); });
});

// Recompute everything when the sheet is opened (covers characters created before this worker existed).
on('sheet:opened', function () { updateMods(Array.from(scoreAttrsToMods.keys())); });
