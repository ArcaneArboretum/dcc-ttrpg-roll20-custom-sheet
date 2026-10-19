# Dungeon Crawler Carl TTRPG Custom Sheet for Roll20
Custom Sheet for the Dungeon Crawler Carl TTRPG (WIP - First Draft is Complete)

Working on a custom roll20 sheet to use for the Dungeon Crawler Carl TTRPG game by Renegade Studios in roll20, since there is no official module for DCC yet.

The sheet is intended to support Player Characters, NPCs, Pets, and Vehicles, but only the Player Characters portion is complete at the moment.

This is a solo project, and I am still learning how to code in HTML/CSS/JavaScript, so please excuse any weird or non-standard design patterns / architectures. I have lots of prior programming experience, but NONE in HTML/CSS/JavaScript.

If you're interested in using this sheet yourself, download the repo, run build_sheet.py (using the provided build_sheet.bat or manually), then copy the output sheet_compiled.html into the Roll20 custom sheet 'HTML Layout' tab on the Campaign Settings Page after selecting "Character Sheet Template" -> "Custom". Then copy the sheet.css contents into the CSS Styling tab. Click Save Changes, and you should be able to see the sheet render in your game.

## No AI Disclaimer
While we all love (or love to hate) the System AI that runs the Crawl, I have no love for generative "AI" or LLMs that use stolen data and pollute our environment.

No AI was knowingly used to create this sheet. I say knowingly because I recognize that it is possible some search result for how to apply a specific css class or html item found on some forum or otherwise may have been sourced by AI without my knowledge. I am firmly against the use of AI and do not include AI usage in my project. Where I was able, I avoided using Google AI search results and did not consult any generative AI tools such as Claude, ChatGPT, or otherwise for this project.

## Features
* Fully fledged Crawler Sheet with the following:
  * Crawler Number, Name, Gender/Pronouns, Level, Banked Levels (levels earned that have not yet been spent), Level Grind (hours spent grinding towards a level), Race, Class, and Floor
  * Player Killer Skulls, Boss Stars, and Hunter Daggers for the 6th floor. Also includes Gold Player Killer Skulls starting on floor 4.
  * Custom logic to hide/show specific elements of the sheet based on the floor the character is on. For example:
    * Popularity Tracker (Floor 2)
    * Leaderboard Position Tracker (Floor 4)
    * Gold Player Killer Skulls (Floor 4)
    * Sponsors (Floors 4, 5 and 6 each reveal one additional sponsor slot)
    * Hunter Killer marks (Floor 6)
    * Class Abilities (Floor 3)
  * Overview Page, containing:
    * Time to Floor Collapse
    * AI Favor tracker
    * Popularity Tracker (Floor 2+)
    * Leaderboard Rank (Floor 4+)
    * Strength, Intelligence, Constitution, Dexterity, Charisma - Enhanced and Unenhanced Scores, + Modifiers which are auto-calculated based on the enhanced score.
      * Each of these also has a rollable button prompt to send a stat check to the chat. All rollable button prompts that roll a d20 roll twice and display both results, for use with advantage/disadvantage rules. If the roll does not have advantage / disadvantage, simply take the first result and ignore the second.
    * Health Bar
      * The Health Bar defaults to 10 segments, but can be expanded or reduced to anywhere between 1 and 20 segments using an override in the settings.
      * The Health Bar automatically assigns the CON modifier to each health bar slot, but each health bar slot can be individually overwritten in the settings.
      * The Health Bar automatically determines the % numbers to track along the bottom based on the total number of healthbar slots available.
      * Clicking a slot in the healthbar will mark it with a red X. A "health_percent" attribute is tracked in the background that updates the remaining health percentage based on the highest unmarked health bar slot. Use "health_percent" on tokens to reflect the HP of each character, including NPCs if you like. Remember that token bars are based on the linked sheet, so if you are linking "health_percent" for NPCs, you will have to have a unique sheet for every mob, or just don't link the Health Percent and update it manually using the NPC sheet as a guideline for what percentages to use.
        * Clicking a slot lower than your highest unmarked slot will mark all slots between the slot you clicked and the highest clicked slot, inclusively. For example, if you are currently at 90% health (and have 10 Health Bar Slots as the default), and you click the 60% health bar slot to mark it off, all of the 60%, 70% and 80% health bar slots will be checked off, indicating you took 40% health damage in a single attack (90% -> 50%).
        * Conversely, if you heal and click a health bar slot above the lowest checked health bar slot, all slots between your lowest checked health bar slot and the slot you just unclicked will also be unclicked. For example, if you're at 10% HP (last HB slot remaining), and you Heal 2 HB slots using the spell Heal, and you click on the 30% HB slot (2 slots to the right), both the 20% and 30% HB slots will be unclicked (10% -> 30% HP).
        * Basically, you don't have to manually click every slot between your current HB% and the new target HB% when you take damage / heal, the sheet will do that for you if you just click the spot that you want to be set at.
      * When you mark the last slot in the Health Bar, a fancy "YOU ARE DYING" box will appear below the Health Bar with a rainbow background that lets the player track the number of rounds they have remaining until they die. There are 2 modes, set in the settings page:
        * Numbers - this mode shows a number equal to your CON mod as the max and a number starting at your CON mod and counting down as your current number of remaining rounds before dying. If the remaining number is at 0, and you need to reduce it further, you die! (I think I'm reading that rule correctly, but I might be mistaken).
        * Skulls - this mode shows a number of clickable skulls equal to your CON mod (max 10). Each time you reach the end of the round or take damage, you click a skull. If you need to click a skull and have no more unclicked skulls, you die!
      * You also get a Debuff in the Debuffs section showing that you are dying. It's much more subtle.
    * DR and Resistances - you can enter the DR you gain from armor and buffs and the sheet will calculate the total for you. You can also write down your immunities, resistances, and vulnerabilities in this section for quick reference.
    * External Buffs - you can create any number of external buffs in this section. For organizations sake, try to keep your active ones at the top by re-organizing the list using the lock button and then the grab handles to re-arrange.
    * Debuffs - you can create any number of debuffs in this section. The Dying debuff is automatically added at the top of this section when your HB% is 0, but otherwise you can manually add debuffs here and track their duration and effects.
    * Mana - this section tracks your mana. It automatically updates your MAX to equal your current Enhanced Intelligence score, but the max value can be overwritten using an override option in the settings page.
    * Evade - this section automatically carries over your DEX buff and lets you enter a custom buff to total up your Evade score. It also contains a clickable button that sends an evade roll to the chat.
    * Move, Step, Size - this section shows your current move speed, step speed, and size. You enter the number corresponding to your size and the sheet automatically looks up the associated descriptive text for that number.
    * Actions in Combat - this section lists the actions and interrupts you can take in combat. There are default ones included for all crawlers, and then you can create any number of additional rows as needed for your specific actions / interrupts you have access to (like the Catcher skill, as one example).
      * The Actions included by default are: Use a Skill, Move, Fetch and Item, Use an Item, Loot for Clues, and Call a Play. The Call a Play action comes with a button prompt that sends 2 1d6 rolls to the chat and highlights the higher of the 2 rolls to use as your Call a Play bonus.
      * The Interrupts included by default are: Interrupt Skills, Evade (including a rollable button that does the same thing as the Evade button from earlier), Intervene (which sends a 1d6 roll to chat to use as your Intervene bonus), and Healing.
  * Skills Page (Description is a WIP)
  * Inventory Page (Description is a WIP)
  * Info Page (Description is a WIP)
  * Achievements Page (Description is a WIP)
  * Notes Page (Description is a WIP)
* An NPC/Mob/Boss sheet (Description is a WIP)
* A GMC Sheet (Description is a WIP)
* A Pet Sheet (Description is a WIP)
* A Vehicle Sheet (Description is a WIP)
     
## Known Issues
* The External Buffs and Debuffs rows do not expand properly when the sheet is made wider. The instances of buffs / debuffs in the fieldset do not lineup with the headers when these sections are expanded.
* The intervene roll is not currently displaying the roll results.

## Planned Features (TBD)
* Add a setting to remove the rainbow background from the Dying box for better accessibility.
* Update the dying tooltips if I'm wrong about how that mechanic works.
* Adding more tooltips to the other pages and sheets (currently only the overview page really has any).
