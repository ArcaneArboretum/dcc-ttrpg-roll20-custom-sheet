/* Lookups Floor Value and Dynamicall Hide / Show elements on the sheet based on it. */
/* Also bounds the min/max floor numbers so players can't break the sheet. */

const FLOOR_CORE_TRIGGERS = 'sheet:opened change:floor';
const FLOOR_TARGET_ATTRIBUTES = ['floor']

// update modifiers for a given set of score attributes
function updateSheetForFloor(attrs) {
    getAttrs(attrs, function(values) {
        let floor = parseInt(values.floor) || 1;

        if(floor < MIN_FLOOR) {
            floor = MIN_FLOOR;
        } else if(floor > MAX_FLOOR) {
            floor = MAX_FLOOR;
        }

        let updateAttrs = {};

        updateAttrs['floor'] = floor;

        FLOOR_COUNTER.forEach(i => {
            let floorTag = FLOOR_TAGS[i];
            
            if(i <= floor) {
                updateAttrs[`display_${floorTag}_floor`] = "";
            } else {
                updateAttrs[`display_${floorTag}_floor`] = "hidden";
            }
        });
 
        setAttrs(updateAttrs);
    });
}

on(FLOOR_CORE_TRIGGERS, function () { updateSheetForFloor(FLOOR_TARGET_ATTRIBUTES) });
