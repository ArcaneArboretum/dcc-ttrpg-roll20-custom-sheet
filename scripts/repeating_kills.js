/* Hide and Show Specific sub-sections of the kill tracker based on the selected kill type */
/* Count total kills for: crawlers, top 10 crawlers, bosses (by type), and hunters */
function manageKills(attrs) {
    const sectionName = 'repeating_kills';
    const fieldNames = ['kill_type', 'kill_boss_tier'];

    getSectionIDs(sectionName, function(idarray) {
        let attrKeys = getRepeatingAttrKeys(sectionName, fieldNames, idarray);
        let finalAttrs = [...attrs, ...attrKeys];

        getAttrs(finalAttrs, function(values) {
            let out = {};

            let crawlerKills = 0;
            let crawlerTop10Kills = 0;
            let neighborhoodBossKills = 0;
            let boroughBossKills = 0;
            let cityBossKills = 0;
            let provinceBossKills = 0;
            let countryBossKills = 0;
            let floorBossKills = 0;
            let hunterKills = 0;
            
            idarray.forEach(rowId => {
                const killTypeKey = `${sectionName}_${rowId}_kill_type`;
                const bossTierKey = `${sectionName}_${rowId}_kill_boss_tier`;

                const displayBossTierKey = `${sectionName}_${rowId}_kill_display_boss_tier`;
                const displayLeaderboardPositionKey = `${sectionName}_${rowId}_kill_display_leaderboard_position`;
                out[displayBossTierKey] = 'hidden';
                out[displayLeaderboardPositionKey] = 'hidden';

                let killType = values[killTypeKey];
                
                if(killType == 'boss') {
                    out[displayBossTierKey] = ''; // show the boss tier selection box

                    // count boss kills by tier
                    let bossTier = values[bossTierKey];
                    switch(bossTier) {
                        case 'neighborhood':
                            neighborhoodBossKills += 1;
                            break;
                        case 'borough':
                            boroughBossKills += 1;
                            break;
                        case 'city':
                            cityBossKills += 1;
                            break;
                        case 'province':
                            provinceBossKills += 1;
                            break;
                        case 'country':
                            countryBossKills += 1;
                            break;
                        case 'floor':
                            floorBossKills += 1;
                            break;
                        default:
                            break;
                    }
                } else if(killType == 'crawler') {
                    crawlerKills += 1;
                } else if(killType == 'crawler_top_10') {
                    out[displayLeaderboardPositionKey] = '';
                    crawlerTop10Kills += 1;
                } else if(killType == 'hunter') {
                    hunterKills += 1;
                }
            });

            out['crawler_kills'] = crawlerKills;
            out['crawler_top_10_kills'] = crawlerTop10Kills;
            out['neighborhood_boss_kills'] = neighborhoodBossKills;
            out['borough_boss_kills'] = boroughBossKills;
            out['city_boss_kills'] = cityBossKills;
            out['province_boss_kills'] = provinceBossKills;
            out['country_boss_kills'] = countryBossKills;
            out['floor_boss_kills'] = floorBossKills;
            out['hunter_kills'] = hunterKills;

            setAttrs(out);
        });
    });
}

// Recompute everything when the sheet is opened (covers characters created before this worker existed).
on('sheet:opened change:repeating_kills change:repeating_kills:kill_type change:repeating_kills:kill_boss_tier remove:repeating_kills', function () {
    manageKills([]);
});
