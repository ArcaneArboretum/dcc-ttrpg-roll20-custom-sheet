const MIN_FLOOR = 1;
const MAX_FLOOR = 18;

const FLOOR_COUNTER = Array.from({length: MAX_FLOOR}, (_, i) => i + 1);

// Floor Tags Array, easy lookup aligns with [i] index - i.e. FLOOR_TAG[1] = 'first'
const FLOOR_TAGS = [
    'zeroth', // only present to make the indexing of the other floors align with their names for ease of use
    'first',
    'second',
    'third',
    'fourth',
    'fifth',
    'sixth',
    'seventh',
    'eighth',
    'ninth',
    'tenth',
    'eleventh',
    'twelfth',
    'thirteenth',
    'fourteenth',
    'fifteenth',
    'sixteenth',
    'seventeenth',
    'eighteenth'
];

const DEFAULT_MODIFIER = 1;
const DEFAULT_DEATH_SEGMENTS = 5;
const MAX_DEATH_SEGMENTS = 10;
const DEATH_SEGMENTS_COUNTER = Array.from({length: MAX_DEATH_SEGMENTS}, (_, i) => i + 1);

const DEFAULT_HB_SEGMENTS = 10;
const MAX_HB_SEGMENTS = 20;
const HB_SEGMENTS_COUNTER = Array.from({length: MAX_HB_SEGMENTS}, (_, i) => i + 1);

// Lookup Table - [Size Value, Size Name]
const SIZE_MAP = new Map();
SIZE_MAP.set(1, 'Tiny');
SIZE_MAP.set(2, 'Small');
SIZE_MAP.set(3, 'Petite');
SIZE_MAP.set(4, 'Medium');
SIZE_MAP.set(5, 'Large');
SIZE_MAP.set(6, 'Huge');
SIZE_MAP.set(7, 'Colossal');
SIZE_MAP.set(8, 'Gargantuan');

// Lookup Table - [Min Score, Modifier]
const STAT_MODIFIER_LOOKUP_TABLE = [
[300, 10],
[200, 9],
[150, 8],
[100, 7],
[50, 6],
[20, 5],
[10, 4],
[6, 3],
[3, 2],
[1, 1]
];

// 5 stats: STR, INT, CON, DEX, CHA - sanitized to lowercase
const LONG_STAT_TO_SHORT = new Map();
LONG_STAT_TO_SHORT.set('strength', 'str');
LONG_STAT_TO_SHORT.set('intelligence', 'int');
LONG_STAT_TO_SHORT.set('constitution', 'con');
LONG_STAT_TO_SHORT.set('dexterity', 'dex');
LONG_STAT_TO_SHORT.set('charisma', 'cha');

const STAT_KEYS = Array.from(LONG_STAT_TO_SHORT.values());

function getRepeatingAttrKeys(sectionName, fieldNames, rowIDs) {
    const attrKeys = [];

    rowIDs.forEach(id => {
        fieldNames.forEach(fieldName => {
            attrKeys.push(`${sectionName}_${id}_${fieldName}`);
        });
    });

    return attrKeys;
}

function getModForKey(key, values) {
    let stat = values[key];
    let mod = 0;

    if(LONG_STAT_TO_SHORT.has(stat)) {
        let statShortName = LONG_STAT_TO_SHORT.get(stat);
        mod = parseInt(values[`${statShortName}_mod`]) || 0;
    }

    return mod;
}
