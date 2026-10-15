/* Updates the selected inventory tab if you hide inventory tabs so that only
   the general tab shows */
const INVENTORY_TABS_CORE_TRIGGERS = 'sheet:opened change:hide_tabbed_inventory';
const INVENTORY_TABS_TARGET_ATTRIBUTES = ['hide_tabbed_inventory'];

// update the mana and max mana based on sheet rules
function updateInventoryTabs(attrs) {
    getAttrs(attrs, function(values) {
        let isInventoryTabbed = (parseInt(values['hide_tabbed_inventory']) || 0) === 0;

        if(!isInventoryTabbed) {
            let out = {};
            out['inventory_tab'] = '1';
            setAttrs(out);
        }
    });
}

on(INVENTORY_TABS_CORE_TRIGGERS, function() { updateInventoryTabs(INVENTORY_TABS_TARGET_ATTRIBUTES) });
