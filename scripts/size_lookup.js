/* Lookups Size Names According to Integer Value using DCC Table Rules */

const SIZE_CORE_TRIGGERS = 'sheet:opened change:size';
const SIZE_TARGET_ATTRIBUTES = ['size']

// lookup the appropriate stat modifier given a score value
function sizeNameLookup(sizeValue) {
    let size = parseInt(sizeValue) || 0;
    return SIZE_MAP.has(size)? SIZE_MAP.get(size) : 'Undefined';
}

// update modifiers for a given set of score attributes
function updateSize(attrs) {
    getAttrs(attrs, function(values) {
        let updateAttrs = {}
        updateAttrs['size_name'] = sizeNameLookup(values.size)

        setAttrs(updateAttrs);
    });
}

// Recompute everything when the sheet is opened (covers characters created before this worker existed).
on(SIZE_CORE_TRIGGERS, function () { updateSize(SIZE_TARGET_ATTRIBUTES) });
