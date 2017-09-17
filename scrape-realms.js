// List html is pulled from wowaudit.com/new (could maybe pull from AJAX scrape in future)
// Execute in jsfiddle and get the realms object from the console

const regex = /<li.+?>(.+?)<\/li>/g;

const euRealms = `<li class="select2-results__option" id="select2-guild_realm-result-gocp-Aegwynn" role="treeitem" aria-selected="false">Aegwynn</li>
         <li class="select2-results__option" id="select2-guild_realm-result-2oh4-Aerie Peak" role="treeitem" aria-selected="false">Aerie Peak</li>
         <li class="select2-results__option" id="select2-guild_realm-result-sdrr-Agamaggan" role="treeitem" aria-selected="false">Agamaggan</li>
         <li class="select2-results__option" id="select2-guild_realm-result-3720-Aggra (Português)" role="treeitem" aria-selected="false">Aggra (Português)</li>
         <li class="select2-results__option" id="select2-guild_realm-result-hyqv-Aggramar" role="treeitem" aria-selected="false">Aggramar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ea79-Ahn'Qiraj" role="treeitem" aria-selected="false">Ahn'Qiraj</li>
         <li class="select2-results__option" id="select2-guild_realm-result-72ki-Al'Akir" role="treeitem" aria-selected="false">Al'Akir</li>
         <li class="select2-results__option" id="select2-guild_realm-result-b5j1-Alexstrasza" role="treeitem" aria-selected="false">Alexstrasza</li>
         <li class="select2-results__option" id="select2-guild_realm-result-w0t1-Alleria" role="treeitem" aria-selected="false">Alleria</li>
         <li class="select2-results__option" id="select2-guild_realm-result-w47s-Alonsus" role="treeitem" aria-selected="false">Alonsus</li>
         <li class="select2-results__option" id="select2-guild_realm-result-vjqs-Aman'Thul" role="treeitem" aria-selected="false">Aman'Thul</li>
         <li class="select2-results__option" id="select2-guild_realm-result-oshm-Ambossar" role="treeitem" aria-selected="false">Ambossar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ug6m-Anachronos" role="treeitem" aria-selected="false">Anachronos</li>
         <li class="select2-results__option" id="select2-guild_realm-result-kvmj-Anetheron" role="treeitem" aria-selected="false">Anetheron</li>
         <li class="select2-results__option" id="select2-guild_realm-result-i6dj-Antonidas" role="treeitem" aria-selected="false">Antonidas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jn2g-Anub'arak" role="treeitem" aria-selected="false">Anub'arak</li>
         <li class="select2-results__option select2-results__option--highlighted" id="select2-guild_realm-result-7j90-Arak-arahm" role="treeitem" aria-selected="true">Arak-arahm</li>
         <li class="select2-results__option" id="select2-guild_realm-result-1muq-Arathi" role="treeitem" aria-selected="false">Arathi</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jd3g-Arathor" role="treeitem" aria-selected="false">Arathor</li>
         <li class="select2-results__option" id="select2-guild_realm-result-80ho-Archimonde" role="treeitem" aria-selected="false">Archimonde</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ertw-Area 52" role="treeitem" aria-selected="false">Area 52</li>
         <li class="select2-results__option" id="select2-guild_realm-result-kpa3-Argent Dawn" role="treeitem" aria-selected="false">Argent Dawn</li>
         <li class="select2-results__option" id="select2-guild_realm-result-yt9d-Arthas" role="treeitem" aria-selected="false">Arthas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-cw3n-Arygos" role="treeitem" aria-selected="false">Arygos</li>
         <li class="select2-results__option" id="select2-guild_realm-result-2twq-Ashenvale" role="treeitem" aria-selected="false">Ashenvale</li>
         <li class="select2-results__option" id="select2-guild_realm-result-4zmj-Aszune" role="treeitem" aria-selected="false">Aszune</li>
         <li class="select2-results__option" id="select2-guild_realm-result-d9ct-Auchindoun" role="treeitem" aria-selected="false">Auchindoun</li>
         <li class="select2-results__option" id="select2-guild_realm-result-qmns-Azjol-Nerub" role="treeitem" aria-selected="false">Azjol-Nerub</li>
         <li class="select2-results__option" id="select2-guild_realm-result-pu9r-Azshara" role="treeitem" aria-selected="false">Azshara</li>
         <li class="select2-results__option" id="select2-guild_realm-result-xji0-Azuregos" role="treeitem" aria-selected="false">Azuregos</li>
         <li class="select2-results__option" id="select2-guild_realm-result-3a3p-Azuremyst" role="treeitem" aria-selected="false">Azuremyst</li>
         <li class="select2-results__option" id="select2-guild_realm-result-34fw-Baelgun" role="treeitem" aria-selected="false">Baelgun</li>
         <li class="select2-results__option" id="select2-guild_realm-result-fsb5-Balnazzar" role="treeitem" aria-selected="false">Balnazzar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-t49m-Benedictus" role="treeitem" aria-selected="false">Benedictus</li>
         <li class="select2-results__option" id="select2-guild_realm-result-9wg4-Blackhand" role="treeitem" aria-selected="false">Blackhand</li>
         <li class="select2-results__option" id="select2-guild_realm-result-9oae-Blackmoore" role="treeitem" aria-selected="false">Blackmoore</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ku2m-Blackrock" role="treeitem" aria-selected="false">Blackrock</li>
         <li class="select2-results__option" id="select2-guild_realm-result-uw8m-Blackscar" role="treeitem" aria-selected="false">Blackscar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-e9cx-Blade's Edge" role="treeitem" aria-selected="false">Blade's Edge</li>
         <li class="select2-results__option" id="select2-guild_realm-result-2ayr-Bladefist" role="treeitem" aria-selected="false">Bladefist</li>
         <li class="select2-results__option" id="select2-guild_realm-result-rdql-Bloodfeather" role="treeitem" aria-selected="false">Bloodfeather</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jl5p-Bloodhoof" role="treeitem" aria-selected="false">Bloodhoof</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8ck3-Bloodscalp" role="treeitem" aria-selected="false">Bloodscalp</li>
         <li class="select2-results__option" id="select2-guild_realm-result-anrk-Blutkessel" role="treeitem" aria-selected="false">Blutkessel</li>
         <li class="select2-results__option" id="select2-guild_realm-result-iocw-Booty Bay" role="treeitem" aria-selected="false">Booty Bay</li>
         <li class="select2-results__option" id="select2-guild_realm-result-wmrk-Borean Tundra" role="treeitem" aria-selected="false">Borean Tundra</li>
         <li class="select2-results__option" id="select2-guild_realm-result-dqwj-Boulderfist" role="treeitem" aria-selected="false">Boulderfist</li>
         <li class="select2-results__option" id="select2-guild_realm-result-xdbv-Brill" role="treeitem" aria-selected="false">Brill</li>
         <li class="select2-results__option" id="select2-guild_realm-result-zmgb-Bronze Dragonflight" role="treeitem" aria-selected="false">Bronze Dragonflight</li>
         <li class="select2-results__option" id="select2-guild_realm-result-7anb-Bronzebeard" role="treeitem" aria-selected="false">Bronzebeard</li>
         <li class="select2-results__option" id="select2-guild_realm-result-13mw-Burning Blade" role="treeitem" aria-selected="false">Burning Blade</li>
         <li class="select2-results__option" id="select2-guild_realm-result-r9g2-Burning Legion" role="treeitem" aria-selected="false">Burning Legion</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ksps-Burning Steppes" role="treeitem" aria-selected="false">Burning Steppes</li>
         <li class="select2-results__option" id="select2-guild_realm-result-0top-C'Thun" role="treeitem" aria-selected="false">C'Thun</li>
         <li class="select2-results__option" id="select2-guild_realm-result-p0jj-Chamber Of Aspects" role="treeitem" aria-selected="false">Chamber Of Aspects</li>
         <li class="select2-results__option" id="select2-guild_realm-result-22pz-Chants éternels" role="treeitem" aria-selected="false">Chants éternels</li>
         <li class="select2-results__option" id="select2-guild_realm-result-firv-Cho'gall" role="treeitem" aria-selected="false">Cho'gall</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jcy6-Chromaggus" role="treeitem" aria-selected="false">Chromaggus</li>
         <li class="select2-results__option" id="select2-guild_realm-result-m7ve-Colinas Pardas" role="treeitem" aria-selected="false">Colinas Pardas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-28iq-Confrérie Du Thorium" role="treeitem" aria-selected="false">Confrérie Du Thorium</li>
         <li class="select2-results__option" id="select2-guild_realm-result-gl4f-Conseil des Ombres" role="treeitem" aria-selected="false">Conseil des Ombres</li>
         <li class="select2-results__option" id="select2-guild_realm-result-6gc6-Crushridge" role="treeitem" aria-selected="false">Crushridge</li>
         <li class="select2-results__option" id="select2-guild_realm-result-1ed5-Culte de la Rive noire" role="treeitem" aria-selected="false">Culte de la Rive noire</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ox4o-Daggerspine" role="treeitem" aria-selected="false">Daggerspine</li>
         <li class="select2-results__option" id="select2-guild_realm-result-0uf0-Dalaran" role="treeitem" aria-selected="false">Dalaran</li>
         <li class="select2-results__option" id="select2-guild_realm-result-a3pw-Dalvengyr" role="treeitem" aria-selected="false">Dalvengyr</li>
         <li class="select2-results__option" id="select2-guild_realm-result-9e9v-Darkmoon Faire" role="treeitem" aria-selected="false">Darkmoon Faire</li>
         <li class="select2-results__option" id="select2-guild_realm-result-mgch-Darksorrow" role="treeitem" aria-selected="false">Darksorrow</li>
         <li class="select2-results__option" id="select2-guild_realm-result-n5n3-Darkspear" role="treeitem" aria-selected="false">Darkspear</li>
         <li class="select2-results__option" id="select2-guild_realm-result-derz-Das Konsortium" role="treeitem" aria-selected="false">Das Konsortium</li>
         <li class="select2-results__option" id="select2-guild_realm-result-zfec-Das Syndikat" role="treeitem" aria-selected="false">Das Syndikat</li>
         <li class="select2-results__option" id="select2-guild_realm-result-9ms5-Deathguard" role="treeitem" aria-selected="false">Deathguard</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8f35-Deathweaver" role="treeitem" aria-selected="false">Deathweaver</li>
         <li class="select2-results__option" id="select2-guild_realm-result-omhc-Deathwing" role="treeitem" aria-selected="false">Deathwing</li>
         <li class="select2-results__option" id="select2-guild_realm-result-d9i9-Deepholm" role="treeitem" aria-selected="false">Deepholm</li>
         <li class="select2-results__option" id="select2-guild_realm-result-y8r5-Defias Brotherhood" role="treeitem" aria-selected="false">Defias Brotherhood</li>
         <li class="select2-results__option" id="select2-guild_realm-result-htve-Dentarg" role="treeitem" aria-selected="false">Dentarg</li>
         <li class="select2-results__option" id="select2-guild_realm-result-okyd-Der Abyssische Rat" role="treeitem" aria-selected="false">Der Abyssische Rat</li>
         <li class="select2-results__option" id="select2-guild_realm-result-9amh-Der Mithrilorden" role="treeitem" aria-selected="false">Der Mithrilorden</li>
         <li class="select2-results__option" id="select2-guild_realm-result-kegy-Der Rat Von Dalaran" role="treeitem" aria-selected="false">Der Rat Von Dalaran</li>
         <li class="select2-results__option" id="select2-guild_realm-result-o7zd-Destromath" role="treeitem" aria-selected="false">Destromath</li>
         <li class="select2-results__option" id="select2-guild_realm-result-6jlr-Dethecus" role="treeitem" aria-selected="false">Dethecus</li>
         <li class="select2-results__option" id="select2-guild_realm-result-yvfx-Die Aldor" role="treeitem" aria-selected="false">Die Aldor</li>
         <li class="select2-results__option" id="select2-guild_realm-result-4d4e-Die Arguswacht" role="treeitem" aria-selected="false">Die Arguswacht</li>
         <li class="select2-results__option" id="select2-guild_realm-result-bpfo-Die Ewige Wacht" role="treeitem" aria-selected="false">Die Ewige Wacht</li>
         <li class="select2-results__option" id="select2-guild_realm-result-vp70-Die Nachtwache" role="treeitem" aria-selected="false">Die Nachtwache</li>
         <li class="select2-results__option" id="select2-guild_realm-result-mdil-Die Silberne Hand" role="treeitem" aria-selected="false">Die Silberne Hand</li>
         <li class="select2-results__option" id="select2-guild_realm-result-6fi4-Die Todeskrallen" role="treeitem" aria-selected="false">Die Todeskrallen</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ofeo-Doomhammer" role="treeitem" aria-selected="false">Doomhammer</li>
         <li class="select2-results__option" id="select2-guild_realm-result-a4el-Draenor" role="treeitem" aria-selected="false">Draenor</li>
         <li class="select2-results__option" id="select2-guild_realm-result-26c9-Dragonblight" role="treeitem" aria-selected="false">Dragonblight</li>
         <li class="select2-results__option" id="select2-guild_realm-result-uyil-Dragonmaw" role="treeitem" aria-selected="false">Dragonmaw</li>
         <li class="select2-results__option" id="select2-guild_realm-result-kqpw-Drak'thul" role="treeitem" aria-selected="false">Drak'thul</li>
         <li class="select2-results__option" id="select2-guild_realm-result-zbdr-Drek'Thar" role="treeitem" aria-selected="false">Drek'Thar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-qckm-Dun Modr" role="treeitem" aria-selected="false">Dun Modr</li>
         <li class="select2-results__option" id="select2-guild_realm-result-lmgu-Dun Morogh" role="treeitem" aria-selected="false">Dun Morogh</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ceh3-Dunemaul" role="treeitem" aria-selected="false">Dunemaul</li>
         <li class="select2-results__option" id="select2-guild_realm-result-sae7-Durotan" role="treeitem" aria-selected="false">Durotan</li>
         <li class="select2-results__option" id="select2-guild_realm-result-54u0-Earthen Ring" role="treeitem" aria-selected="false">Earthen Ring</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jzeh-Echsenkessel" role="treeitem" aria-selected="false">Echsenkessel</li>
         <li class="select2-results__option" id="select2-guild_realm-result-bnqa-Eitrigg" role="treeitem" aria-selected="false">Eitrigg</li>
         <li class="select2-results__option" id="select2-guild_realm-result-a8nu-Eldre'Thalas" role="treeitem" aria-selected="false">Eldre'Thalas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jany-Elune" role="treeitem" aria-selected="false">Elune</li>
         <li class="select2-results__option" id="select2-guild_realm-result-emhb-Emerald Dream" role="treeitem" aria-selected="false">Emerald Dream</li>
         <li class="select2-results__option" id="select2-guild_realm-result-xvly-Emeriss" role="treeitem" aria-selected="false">Emeriss</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ffqb-Eonar" role="treeitem" aria-selected="false">Eonar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-agc5-Eredar" role="treeitem" aria-selected="false">Eredar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-sa50-Eversong" role="treeitem" aria-selected="false">Eversong</li>
         <li class="select2-results__option" id="select2-guild_realm-result-plze-Executus" role="treeitem" aria-selected="false">Executus</li>
         <li class="select2-results__option" id="select2-guild_realm-result-1z6w-Exodar" role="treeitem" aria-selected="false">Exodar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-mff0-Festung der Stürme" role="treeitem" aria-selected="false">Festung der Stürme</li>
         <li class="select2-results__option" id="select2-guild_realm-result-vx3a-Fordragon" role="treeitem" aria-selected="false">Fordragon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-j503-Forscherliga" role="treeitem" aria-selected="false">Forscherliga</li>
         <li class="select2-results__option" id="select2-guild_realm-result-aim9-Frostmane" role="treeitem" aria-selected="false">Frostmane</li>
         <li class="select2-results__option" id="select2-guild_realm-result-gg52-Frostmourne" role="treeitem" aria-selected="false">Frostmourne</li>
         <li class="select2-results__option" id="select2-guild_realm-result-1h9c-Frostwhisper" role="treeitem" aria-selected="false">Frostwhisper</li>
         <li class="select2-results__option" id="select2-guild_realm-result-b599-Frostwolf" role="treeitem" aria-selected="false">Frostwolf</li>
         <li class="select2-results__option" id="select2-guild_realm-result-l965-Galakrond" role="treeitem" aria-selected="false">Galakrond</li>
         <li class="select2-results__option" id="select2-guild_realm-result-b00c-Garona" role="treeitem" aria-selected="false">Garona</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8zpp-Garrosh" role="treeitem" aria-selected="false">Garrosh</li>
         <li class="select2-results__option" id="select2-guild_realm-result-5c48-Genjuros" role="treeitem" aria-selected="false">Genjuros</li>
         <li class="select2-results__option" id="select2-guild_realm-result-0il2-Ghostlands" role="treeitem" aria-selected="false">Ghostlands</li>
         <li class="select2-results__option" id="select2-guild_realm-result-pbei-Gilneas" role="treeitem" aria-selected="false">Gilneas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-nzoy-Goldrinn" role="treeitem" aria-selected="false">Goldrinn</li>
         <li class="select2-results__option" id="select2-guild_realm-result-0hmi-Gordunni" role="treeitem" aria-selected="false">Gordunni</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jcso-Gorgonnash" role="treeitem" aria-selected="false">Gorgonnash</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ygp5-Greymane" role="treeitem" aria-selected="false">Greymane</li>
         <li class="select2-results__option" id="select2-guild_realm-result-5pq6-Grim Batol" role="treeitem" aria-selected="false">Grim Batol</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ujuo-Grom" role="treeitem" aria-selected="false">Grom</li>
         <li class="select2-results__option" id="select2-guild_realm-result-sa53-Gul'dan" role="treeitem" aria-selected="false">Gul'dan</li>
         <li class="select2-results__option" id="select2-guild_realm-result-z2kn-Hakkar" role="treeitem" aria-selected="false">Hakkar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-a0dn-Haomarush" role="treeitem" aria-selected="false">Haomarush</li>
         <li class="select2-results__option" id="select2-guild_realm-result-vgeh-Hellfire" role="treeitem" aria-selected="false">Hellfire</li>
         <li class="select2-results__option" id="select2-guild_realm-result-qz2u-Hellscream" role="treeitem" aria-selected="false">Hellscream</li>
         <li class="select2-results__option" id="select2-guild_realm-result-rou1-Howling Fjord" role="treeitem" aria-selected="false">Howling Fjord</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ipn7-Hyjal" role="treeitem" aria-selected="false">Hyjal</li>
         <li class="select2-results__option" id="select2-guild_realm-result-xnwl-Illidan" role="treeitem" aria-selected="false">Illidan</li>
         <li class="select2-results__option" id="select2-guild_realm-result-45g3-Jaedenar" role="treeitem" aria-selected="false">Jaedenar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-xiej-Kael'thas" role="treeitem" aria-selected="false">Kael'thas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-phps-Kalaran" role="treeitem" aria-selected="false">Kalaran</li>
         <li class="select2-results__option" id="select2-guild_realm-result-lhnu-Karazhan" role="treeitem" aria-selected="false">Karazhan</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8sji-Kargath" role="treeitem" aria-selected="false">Kargath</li>
         <li class="select2-results__option" id="select2-guild_realm-result-9slb-Kazzak" role="treeitem" aria-selected="false">Kazzak</li>
         <li class="select2-results__option" id="select2-guild_realm-result-4sxi-Kel'Thuzad" role="treeitem" aria-selected="false">Kel'Thuzad</li>
         <li class="select2-results__option" id="select2-guild_realm-result-5msx-Khadgar" role="treeitem" aria-selected="false">Khadgar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-7buf-Khaz Modan" role="treeitem" aria-selected="false">Khaz Modan</li>
         <li class="select2-results__option" id="select2-guild_realm-result-tb79-Khaz'goroth" role="treeitem" aria-selected="false">Khaz'goroth</li>
         <li class="select2-results__option" id="select2-guild_realm-result-0fhi-Kil'jaeden" role="treeitem" aria-selected="false">Kil'jaeden</li>
         <li class="select2-results__option" id="select2-guild_realm-result-w38w-Kilrogg" role="treeitem" aria-selected="false">Kilrogg</li>
         <li class="select2-results__option" id="select2-guild_realm-result-m7m4-Kirin Tor" role="treeitem" aria-selected="false">Kirin Tor</li>
         <li class="select2-results__option" id="select2-guild_realm-result-c6yh-Kor'gall" role="treeitem" aria-selected="false">Kor'gall</li>
         <li class="select2-results__option" id="select2-guild_realm-result-62dz-Krag'jin" role="treeitem" aria-selected="false">Krag'jin</li>
         <li class="select2-results__option" id="select2-guild_realm-result-r7wh-Krasus" role="treeitem" aria-selected="false">Krasus</li>
         <li class="select2-results__option" id="select2-guild_realm-result-a7p1-Kul Tiras" role="treeitem" aria-selected="false">Kul Tiras</li>
         <li class="select2-results__option" id="select2-guild_realm-result-3bzl-Kult der Verdammten" role="treeitem" aria-selected="false">Kult der Verdammten</li>
         <li class="select2-results__option" id="select2-guild_realm-result-h8j7-La Croisade ecarlate" role="treeitem" aria-selected="false">La Croisade ecarlate</li>
         <li class="select2-results__option" id="select2-guild_realm-result-gtd6-Laughing Skull" role="treeitem" aria-selected="false">Laughing Skull</li>
         <li class="select2-results__option" id="select2-guild_realm-result-qoc4-Les Clairvoyants" role="treeitem" aria-selected="false">Les Clairvoyants</li>
         <li class="select2-results__option" id="select2-guild_realm-result-x48t-Les Sentinelles" role="treeitem" aria-selected="false">Les Sentinelles</li>
         <li class="select2-results__option" id="select2-guild_realm-result-cz8y-Lich King" role="treeitem" aria-selected="false">Lich King</li>
         <li class="select2-results__option" id="select2-guild_realm-result-kw8q-Lightbringer" role="treeitem" aria-selected="false">Lightbringer</li>
         <li class="select2-results__option" id="select2-guild_realm-result-upc1-Lightning's Blade" role="treeitem" aria-selected="false">Lightning's Blade</li>
         <li class="select2-results__option" id="select2-guild_realm-result-w01f-Lordaeron" role="treeitem" aria-selected="false">Lordaeron</li>
         <li class="select2-results__option" id="select2-guild_realm-result-vyv9-Los Errantes" role="treeitem" aria-selected="false">Los Errantes</li>
         <li class="select2-results__option" id="select2-guild_realm-result-iwnh-Lothar" role="treeitem" aria-selected="false">Lothar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-sfp3-Lycanthoth" role="treeitem" aria-selected="false">Lycanthoth</li>
         <li class="select2-results__option" id="select2-guild_realm-result-vvo7-Madmortem" role="treeitem" aria-selected="false">Madmortem</li>
         <li class="select2-results__option" id="select2-guild_realm-result-7kdr-Magtheridon" role="treeitem" aria-selected="false">Magtheridon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-kr5z-Mal'Ganis" role="treeitem" aria-selected="false">Mal'Ganis</li>
         <li class="select2-results__option" id="select2-guild_realm-result-h5zk-Malfurion" role="treeitem" aria-selected="false">Malfurion</li>
         <li class="select2-results__option" id="select2-guild_realm-result-m9y4-Malorne" role="treeitem" aria-selected="false">Malorne</li>
         <li class="select2-results__option" id="select2-guild_realm-result-btid-Malygos" role="treeitem" aria-selected="false">Malygos</li>
         <li class="select2-results__option" id="select2-guild_realm-result-texo-Mannoroth" role="treeitem" aria-selected="false">Mannoroth</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jufh-Marecage de Zangar" role="treeitem" aria-selected="false">Marecage de Zangar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-oysj-Mazrigos" role="treeitem" aria-selected="false">Mazrigos</li>
         <li class="select2-results__option" id="select2-guild_realm-result-z3me-Medivh" role="treeitem" aria-selected="false">Medivh</li>
         <li class="select2-results__option" id="select2-guild_realm-result-l7il-Minahonda" role="treeitem" aria-selected="false">Minahonda</li>
         <li class="select2-results__option" id="select2-guild_realm-result-08g5-Moonglade" role="treeitem" aria-selected="false">Moonglade</li>
         <li class="select2-results__option" id="select2-guild_realm-result-5if9-Mug'thol" role="treeitem" aria-selected="false">Mug'thol</li>
         <li class="select2-results__option" id="select2-guild_realm-result-v1tt-Nagrand" role="treeitem" aria-selected="false">Nagrand</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ivqz-Naralex" role="treeitem" aria-selected="false">Naralex</li>
         <li class="select2-results__option" id="select2-guild_realm-result-wc5d-Nathrezim" role="treeitem" aria-selected="false">Nathrezim</li>
         <li class="select2-results__option" id="select2-guild_realm-result-qlsk-Naxxramas" role="treeitem" aria-selected="false">Naxxramas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-a9aq-Nazjatar" role="treeitem" aria-selected="false">Nazjatar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-9ddc-Nefarian" role="treeitem" aria-selected="false">Nefarian</li>
         <li class="select2-results__option" id="select2-guild_realm-result-op0v-Nemesis" role="treeitem" aria-selected="false">Nemesis</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jdyv-Neptulon" role="treeitem" aria-selected="false">Neptulon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-b39y-Ner'zhul" role="treeitem" aria-selected="false">Ner'zhul</li>
         <li class="select2-results__option" id="select2-guild_realm-result-uiuw-Nera'thor" role="treeitem" aria-selected="false">Nera'thor</li>
         <li class="select2-results__option" id="select2-guild_realm-result-a5bz-Nethersturm" role="treeitem" aria-selected="false">Nethersturm</li>
         <li class="select2-results__option" id="select2-guild_realm-result-9r1w-Nordrassil" role="treeitem" aria-selected="false">Nordrassil</li>
         <li class="select2-results__option" id="select2-guild_realm-result-vgy7-Norgannon" role="treeitem" aria-selected="false">Norgannon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-95vn-Nozdormu" role="treeitem" aria-selected="false">Nozdormu</li>
         <li class="select2-results__option" id="select2-guild_realm-result-xpik-Onyxia" role="treeitem" aria-selected="false">Onyxia</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8gp8-Outland" role="treeitem" aria-selected="false">Outland</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ji7u-Perenolde" role="treeitem" aria-selected="false">Perenolde</li>
         <li class="select2-results__option" id="select2-guild_realm-result-knuo-Pozzo dell'Eternità" role="treeitem" aria-selected="false">Pozzo dell'Eternità</li>
         <li class="select2-results__option" id="select2-guild_realm-result-rnp1-Proudmoore" role="treeitem" aria-selected="false">Proudmoore</li>
         <li class="select2-results__option" id="select2-guild_realm-result-lmum-Quel'Thalas" role="treeitem" aria-selected="false">Quel'Thalas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-3g55-Ragnaros" role="treeitem" aria-selected="false">Ragnaros</li>
         <li class="select2-results__option" id="select2-guild_realm-result-zlz0-Rajaxx" role="treeitem" aria-selected="false">Rajaxx</li>
         <li class="select2-results__option" id="select2-guild_realm-result-nj0f-Rashgarroth" role="treeitem" aria-selected="false">Rashgarroth</li>
         <li class="select2-results__option" id="select2-guild_realm-result-b7pq-Ravencrest" role="treeitem" aria-selected="false">Ravencrest</li>
         <li class="select2-results__option" id="select2-guild_realm-result-qstk-Ravenholdt" role="treeitem" aria-selected="false">Ravenholdt</li>
         <li class="select2-results__option" id="select2-guild_realm-result-0oom-Razuvious" role="treeitem" aria-selected="false">Razuvious</li>
         <li class="select2-results__option" id="select2-guild_realm-result-akw3-Rexxar" role="treeitem" aria-selected="false">Rexxar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-twwi-Runetotem" role="treeitem" aria-selected="false">Runetotem</li>
         <li class="select2-results__option" id="select2-guild_realm-result-0l2v-Sanguino" role="treeitem" aria-selected="false">Sanguino</li>
         <li class="select2-results__option" id="select2-guild_realm-result-tted-Sargeras" role="treeitem" aria-selected="false">Sargeras</li>
         <li class="select2-results__option" id="select2-guild_realm-result-9kbj-Saurfang" role="treeitem" aria-selected="false">Saurfang</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ik4v-Scarshield Legion" role="treeitem" aria-selected="false">Scarshield Legion</li>
         <li class="select2-results__option" id="select2-guild_realm-result-j5hs-Sen'jin" role="treeitem" aria-selected="false">Sen'jin</li>
         <li class="select2-results__option" id="select2-guild_realm-result-4f61-Shadowsong" role="treeitem" aria-selected="false">Shadowsong</li>
         <li class="select2-results__option" id="select2-guild_realm-result-n7ab-Shattered Halls" role="treeitem" aria-selected="false">Shattered Halls</li>
         <li class="select2-results__option" id="select2-guild_realm-result-4btw-Shattered Hand" role="treeitem" aria-selected="false">Shattered Hand</li>
         <li class="select2-results__option" id="select2-guild_realm-result-dsfc-Shattrath" role="treeitem" aria-selected="false">Shattrath</li>
         <li class="select2-results__option" id="select2-guild_realm-result-xzco-Shen'dralar" role="treeitem" aria-selected="false">Shen'dralar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-0hjw-Silvermoon" role="treeitem" aria-selected="false">Silvermoon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-itbi-Sinstralis" role="treeitem" aria-selected="false">Sinstralis</li>
         <li class="select2-results__option" id="select2-guild_realm-result-08qp-Skullcrusher" role="treeitem" aria-selected="false">Skullcrusher</li>
         <li class="select2-results__option" id="select2-guild_realm-result-s6z2-Soulflayer" role="treeitem" aria-selected="false">Soulflayer</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8aw9-Spinebreaker" role="treeitem" aria-selected="false">Spinebreaker</li>
         <li class="select2-results__option" id="select2-guild_realm-result-r0zc-Sporeggar" role="treeitem" aria-selected="false">Sporeggar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8qfu-Steamwheedle Cartel" role="treeitem" aria-selected="false">Steamwheedle Cartel</li>
         <li class="select2-results__option" id="select2-guild_realm-result-svnx-Stormrage" role="treeitem" aria-selected="false">Stormrage</li>
         <li class="select2-results__option" id="select2-guild_realm-result-uqhe-Stormreaver" role="treeitem" aria-selected="false">Stormreaver</li>
         <li class="select2-results__option" id="select2-guild_realm-result-c69o-Stormscale" role="treeitem" aria-selected="false">Stormscale</li>
         <li class="select2-results__option" id="select2-guild_realm-result-5uzi-Sunstrider" role="treeitem" aria-selected="false">Sunstrider</li>
         <li class="select2-results__option" id="select2-guild_realm-result-qd4r-Suramar" role="treeitem" aria-selected="false">Suramar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-0lmu-Sylvanas" role="treeitem" aria-selected="false">Sylvanas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-yfpv-Taerar" role="treeitem" aria-selected="false">Taerar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jf0r-Talnivarr" role="treeitem" aria-selected="false">Talnivarr</li>
         <li class="select2-results__option" id="select2-guild_realm-result-o9ym-Tarren Mill" role="treeitem" aria-selected="false">Tarren Mill</li>
         <li class="select2-results__option" id="select2-guild_realm-result-r4yk-Teldrassil" role="treeitem" aria-selected="false">Teldrassil</li>
         <li class="select2-results__option" id="select2-guild_realm-result-m5y0-Temple noir" role="treeitem" aria-selected="false">Temple noir</li>
         <li class="select2-results__option" id="select2-guild_realm-result-5k2e-Terenas" role="treeitem" aria-selected="false">Terenas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ui6y-Terokkar" role="treeitem" aria-selected="false">Terokkar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-dhgq-Terrordar" role="treeitem" aria-selected="false">Terrordar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-gjty-The Maelstrom" role="treeitem" aria-selected="false">The Maelstrom</li>
         <li class="select2-results__option" id="select2-guild_realm-result-w576-The Sha'tar" role="treeitem" aria-selected="false">The Sha'tar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-at1l-The Venture Co" role="treeitem" aria-selected="false">The Venture Co</li>
         <li class="select2-results__option" id="select2-guild_realm-result-fxbw-Theradras" role="treeitem" aria-selected="false">Theradras</li>
         <li class="select2-results__option" id="select2-guild_realm-result-l2zd-Thermaplugg" role="treeitem" aria-selected="false">Thermaplugg</li>
         <li class="select2-results__option" id="select2-guild_realm-result-yd0h-Thrall" role="treeitem" aria-selected="false">Thrall</li>
         <li class="select2-results__option" id="select2-guild_realm-result-bmtf-Throk'Feroth" role="treeitem" aria-selected="false">Throk'Feroth</li>
         <li class="select2-results__option" id="select2-guild_realm-result-gi1r-Thunderhorn" role="treeitem" aria-selected="false">Thunderhorn</li>
         <li class="select2-results__option" id="select2-guild_realm-result-9bj9-Tichondrius" role="treeitem" aria-selected="false">Tichondrius</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ukiz-Tirion" role="treeitem" aria-selected="false">Tirion</li>
         <li class="select2-results__option" id="select2-guild_realm-result-mnwn-Todeswache" role="treeitem" aria-selected="false">Todeswache</li>
         <li class="select2-results__option" id="select2-guild_realm-result-o0r7-Trollbane" role="treeitem" aria-selected="false">Trollbane</li>
         <li class="select2-results__option" id="select2-guild_realm-result-3827-Turalyon" role="treeitem" aria-selected="false">Turalyon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-rzzx-Twilight's Hammer" role="treeitem" aria-selected="false">Twilight's Hammer</li>
         <li class="select2-results__option" id="select2-guild_realm-result-4yre-Twisting Nether" role="treeitem" aria-selected="false">Twisting Nether</li>
         <li class="select2-results__option" id="select2-guild_realm-result-a51o-Tyrande" role="treeitem" aria-selected="false">Tyrande</li>
         <li class="select2-results__option" id="select2-guild_realm-result-7zpl-Uldaman" role="treeitem" aria-selected="false">Uldaman</li>
         <li class="select2-results__option" id="select2-guild_realm-result-98dj-Ulduar" role="treeitem" aria-selected="false">Ulduar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-hyda-Uldum" role="treeitem" aria-selected="false">Uldum</li>
         <li class="select2-results__option" id="select2-guild_realm-result-bz23-Un'Goro" role="treeitem" aria-selected="false">Un'Goro</li>
         <li class="select2-results__option" id="select2-guild_realm-result-uh58-Varimathras" role="treeitem" aria-selected="false">Varimathras</li>
         <li class="select2-results__option" id="select2-guild_realm-result-td9z-Vashj" role="treeitem" aria-selected="false">Vashj</li>
         <li class="select2-results__option" id="select2-guild_realm-result-b3xz-Vek'lor" role="treeitem" aria-selected="false">Vek'lor</li>
         <li class="select2-results__option" id="select2-guild_realm-result-rfzb-Vek'nilash" role="treeitem" aria-selected="false">Vek'nilash</li>
         <li class="select2-results__option" id="select2-guild_realm-result-9g9o-Vol'jin" role="treeitem" aria-selected="false">Vol'jin</li>
         <li class="select2-results__option" id="select2-guild_realm-result-vqtw-Wildhammer" role="treeitem" aria-selected="false">Wildhammer</li>
         <li class="select2-results__option" id="select2-guild_realm-result-tq6s-Wrathbringer" role="treeitem" aria-selected="false">Wrathbringer</li>
         <li class="select2-results__option" id="select2-guild_realm-result-eg1b-Xavius" role="treeitem" aria-selected="false">Xavius</li>
         <li class="select2-results__option" id="select2-guild_realm-result-o21c-Ysera" role="treeitem" aria-selected="false">Ysera</li>
         <li class="select2-results__option" id="select2-guild_realm-result-rzrc-Ysondre" role="treeitem" aria-selected="false">Ysondre</li>
         <li class="select2-results__option" id="select2-guild_realm-result-slpc-Zenedar" role="treeitem" aria-selected="false">Zenedar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-rddd-Zirkel des Cenarius" role="treeitem" aria-selected="false">Zirkel des Cenarius</li>
         <li class="select2-results__option" id="select2-guild_realm-result-5a5y-Zul'jin" role="treeitem" aria-selected="false">Zul'jin</li>
         <li class="select2-results__option" id="select2-guild_realm-result-q5zu-Zuluhed" role="treeitem" aria-selected="false">Zuluhed</li>
         <li class="select2-results__option" id="select2-guild_realm-result-mxe3-Азурегос" role="treeitem" aria-selected="false">Азурегос</li>
         <li class="select2-results__option" id="select2-guild_realm-result-hso2-Борейская тундра" role="treeitem" aria-selected="false">Борейская тундра</li>
         <li class="select2-results__option" id="select2-guild_realm-result-7nqy-Вечная Песня" role="treeitem" aria-selected="false">Вечная Песня</li>
         <li class="select2-results__option" id="select2-guild_realm-result-0a8h-Галакронд" role="treeitem" aria-selected="false">Галакронд</li>
         <li class="select2-results__option" id="select2-guild_realm-result-r34f-Гордунни" role="treeitem" aria-selected="false">Гордунни</li>
         <li class="select2-results__option" id="select2-guild_realm-result-q5ck-Гром" role="treeitem" aria-selected="false">Гром</li>
         <li class="select2-results__option" id="select2-guild_realm-result-tu7d-Дракономор" role="treeitem" aria-selected="false">Дракономор</li>
         <li class="select2-results__option" id="select2-guild_realm-result-baiu-Король-лич" role="treeitem" aria-selected="false">Король-лич</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ep65-Пиратская Бухта" role="treeitem" aria-selected="false">Пиратская Бухта</li>
         <li class="select2-results__option" id="select2-guild_realm-result-oyc1-Разувий" role="treeitem" aria-selected="false">Разувий</li>
         <li class="select2-results__option" id="select2-guild_realm-result-bpt6-Ревущий фьорд" role="treeitem" aria-selected="false">Ревущий фьорд</li>
         <li class="select2-results__option" id="select2-guild_realm-result-k5v2-Свежеватель Душ" role="treeitem" aria-selected="false">Свежеватель Душ</li>
         <li class="select2-results__option" id="select2-guild_realm-result-6flz-Страж смерти" role="treeitem" aria-selected="false">Страж смерти</li>
         <li class="select2-results__option" id="select2-guild_realm-result-xgnm-Черный Шрам" role="treeitem" aria-selected="false">Черный Шрам</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jfy7-Ясеневый лес" role="treeitem" aria-selected="false">Ясеневый лес</li>`;

const usRealms = `<li class="select2-results__option" id="select2-guild_realm-result-qfa3-Aegwynn" role="treeitem" aria-selected="false">Aegwynn</li>
         <li class="select2-results__option" id="select2-guild_realm-result-rz9f-Aerie Peak" role="treeitem" aria-selected="false">Aerie Peak</li>
         <li class="select2-results__option" id="select2-guild_realm-result-iim8-Agamaggan" role="treeitem" aria-selected="false">Agamaggan</li>
         <li class="select2-results__option" id="select2-guild_realm-result-g5rx-Aggramar" role="treeitem" aria-selected="false">Aggramar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-m9f8-Akama" role="treeitem" aria-selected="false">Akama</li>
         <li class="select2-results__option" id="select2-guild_realm-result-mfii-Alexstrasza" role="treeitem" aria-selected="false">Alexstrasza</li>
         <li class="select2-results__option" id="select2-guild_realm-result-n1t6-Alleria" role="treeitem" aria-selected="false">Alleria</li>
         <li class="select2-results__option" id="select2-guild_realm-result-qabi-Altar of Storms" role="treeitem" aria-selected="false">Altar of Storms</li>
         <li class="select2-results__option" id="select2-guild_realm-result-t4d9-Alterac Mountains" role="treeitem" aria-selected="false">Alterac Mountains</li>
         <li class="select2-results__option" id="select2-guild_realm-result-khbd-Aman'Thul" role="treeitem" aria-selected="false">Aman'Thul</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ptzo-Anasterian" role="treeitem" aria-selected="false">Anasterian</li>
         <li class="select2-results__option" id="select2-guild_realm-result-52hi-Andorhal" role="treeitem" aria-selected="false">Andorhal</li>
         <li class="select2-results__option" id="select2-guild_realm-result-e8pp-Anetheron" role="treeitem" aria-selected="false">Anetheron</li>
         <li class="select2-results__option" id="select2-guild_realm-result-vyup-Antonidas" role="treeitem" aria-selected="false">Antonidas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-4of4-Anub'arak" role="treeitem" aria-selected="false">Anub'arak</li>
         <li class="select2-results__option" id="select2-guild_realm-result-a1hk-Anvilmar" role="treeitem" aria-selected="false">Anvilmar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-7tv7-Arathor" role="treeitem" aria-selected="false">Arathor</li>
         <li class="select2-results__option" id="select2-guild_realm-result-5fr0-Archimonde" role="treeitem" aria-selected="false">Archimonde</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8i11-Area 52" role="treeitem" aria-selected="false">Area 52</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ea01-Argent Dawn" role="treeitem" aria-selected="false">Argent Dawn</li>
         <li class="select2-results__option" id="select2-guild_realm-result-k6tt-Arthas" role="treeitem" aria-selected="false">Arthas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8wfc-Arygos" role="treeitem" aria-selected="false">Arygos</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ll14-Auchindoun" role="treeitem" aria-selected="false">Auchindoun</li>
         <li class="select2-results__option" id="select2-guild_realm-result-htqx-Azgalor" role="treeitem" aria-selected="false">Azgalor</li>
         <li class="select2-results__option" id="select2-guild_realm-result-dc7u-Azjol-Nerub" role="treeitem" aria-selected="false">Azjol-Nerub</li>
         <li class="select2-results__option" id="select2-guild_realm-result-47dc-Azralon" role="treeitem" aria-selected="false">Azralon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-02kt-Azshara" role="treeitem" aria-selected="false">Azshara</li>
         <li class="select2-results__option" id="select2-guild_realm-result-x15o-Azuremyst" role="treeitem" aria-selected="false">Azuremyst</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jicb-Baelgun" role="treeitem" aria-selected="false">Baelgun</li>
         <li class="select2-results__option" id="select2-guild_realm-result-y23v-Balnazzar" role="treeitem" aria-selected="false">Balnazzar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-au2t-Barthilas" role="treeitem" aria-selected="false">Barthilas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-xkh5-Benedictus" role="treeitem" aria-selected="false">Benedictus</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8g1b-Black Dragonflight" role="treeitem" aria-selected="false">Black Dragonflight</li>
         <li class="select2-results__option" id="select2-guild_realm-result-dk4a-Blackhand" role="treeitem" aria-selected="false">Blackhand</li>
         <li class="select2-results__option" id="select2-guild_realm-result-v9ko-Blackrock" role="treeitem" aria-selected="false">Blackrock</li>
         <li class="select2-results__option" id="select2-guild_realm-result-1fvy-Blackwater Raiders" role="treeitem" aria-selected="false">Blackwater Raiders</li>
         <li class="select2-results__option" id="select2-guild_realm-result-rt76-Blackwing Lair" role="treeitem" aria-selected="false">Blackwing Lair</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ackb-Blade's Edge" role="treeitem" aria-selected="false">Blade's Edge</li>
         <li class="select2-results__option" id="select2-guild_realm-result-cynr-Bladefist" role="treeitem" aria-selected="false">Bladefist</li>
         <li class="select2-results__option" id="select2-guild_realm-result-pfkn-Bleeding Hollow" role="treeitem" aria-selected="false">Bleeding Hollow</li>
         <li class="select2-results__option" id="select2-guild_realm-result-gqns-Blood Furnace" role="treeitem" aria-selected="false">Blood Furnace</li>
         <li class="select2-results__option" id="select2-guild_realm-result-qgp9-Bloodhoof" role="treeitem" aria-selected="false">Bloodhoof</li>
         <li class="select2-results__option" id="select2-guild_realm-result-djfg-Bloodscalp" role="treeitem" aria-selected="false">Bloodscalp</li>
         <li class="select2-results__option" id="select2-guild_realm-result-90c8-Bonechewer" role="treeitem" aria-selected="false">Bonechewer</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ezhe-Borean Tundra" role="treeitem" aria-selected="false">Borean Tundra</li>
         <li class="select2-results__option" id="select2-guild_realm-result-62xt-Boulderfist" role="treeitem" aria-selected="false">Boulderfist</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8edm-Bronzebeard" role="treeitem" aria-selected="false">Bronzebeard</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ox85-Broxigar" role="treeitem" aria-selected="false">Broxigar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-5jdm-Burning Blade" role="treeitem" aria-selected="false">Burning Blade</li>
         <li class="select2-results__option" id="select2-guild_realm-result-pixz-Burning Legion" role="treeitem" aria-selected="false">Burning Legion</li>
         <li class="select2-results__option" id="select2-guild_realm-result-lvm3-Caelestrasz" role="treeitem" aria-selected="false">Caelestrasz</li>
         <li class="select2-results__option" id="select2-guild_realm-result-6311-Cairne" role="treeitem" aria-selected="false">Cairne</li>
         <li class="select2-results__option" id="select2-guild_realm-result-e4i8-Cenarion Circle" role="treeitem" aria-selected="false">Cenarion Circle</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ehsa-Cenarius" role="treeitem" aria-selected="false">Cenarius</li>
         <li class="select2-results__option" id="select2-guild_realm-result-5tf4-Cho'gall" role="treeitem" aria-selected="false">Cho'gall</li>
         <li class="select2-results__option" id="select2-guild_realm-result-494r-Chromaggus" role="treeitem" aria-selected="false">Chromaggus</li>
         <li class="select2-results__option" id="select2-guild_realm-result-82fu-Coilfang" role="treeitem" aria-selected="false">Coilfang</li>
         <li class="select2-results__option" id="select2-guild_realm-result-78rm-Crushridge" role="treeitem" aria-selected="false">Crushridge</li>
         <li class="select2-results__option" id="select2-guild_realm-result-yh8x-Daggerspine" role="treeitem" aria-selected="false">Daggerspine</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ptvg-Dalaran" role="treeitem" aria-selected="false">Dalaran</li>
         <li class="select2-results__option" id="select2-guild_realm-result-js77-Dalvengyr" role="treeitem" aria-selected="false">Dalvengyr</li>
         <li class="select2-results__option" id="select2-guild_realm-result-688u-Dark Iron" role="treeitem" aria-selected="false">Dark Iron</li>
         <li class="select2-results__option" id="select2-guild_realm-result-l485-Darkspear" role="treeitem" aria-selected="false">Darkspear</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ho27-Darrowmere" role="treeitem" aria-selected="false">Darrowmere</li>
         <li class="select2-results__option" id="select2-guild_realm-result-2dkx-Dath'Remar" role="treeitem" aria-selected="false">Dath'Remar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-vww2-Dawnbringer" role="treeitem" aria-selected="false">Dawnbringer</li>
         <li class="select2-results__option" id="select2-guild_realm-result-lwll-Deathwing" role="treeitem" aria-selected="false">Deathwing</li>
         <li class="select2-results__option" id="select2-guild_realm-result-zzqx-Demon Soul" role="treeitem" aria-selected="false">Demon Soul</li>
         <li class="select2-results__option" id="select2-guild_realm-result-2evz-Dentarg" role="treeitem" aria-selected="false">Dentarg</li>
         <li class="select2-results__option" id="select2-guild_realm-result-vwmn-Destromath" role="treeitem" aria-selected="false">Destromath</li>
         <li class="select2-results__option" id="select2-guild_realm-result-tebq-Dethecus" role="treeitem" aria-selected="false">Dethecus</li>
         <li class="select2-results__option" id="select2-guild_realm-result-mwp1-Detheroc" role="treeitem" aria-selected="false">Detheroc</li>
         <li class="select2-results__option" id="select2-guild_realm-result-5c24-Doomhammer" role="treeitem" aria-selected="false">Doomhammer</li>
         <li class="select2-results__option" id="select2-guild_realm-result-cghd-Draenor" role="treeitem" aria-selected="false">Draenor</li>
         <li class="select2-results__option" id="select2-guild_realm-result-qtf1-Dragonblight" role="treeitem" aria-selected="false">Dragonblight</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ex2w-Dragonmaw" role="treeitem" aria-selected="false">Dragonmaw</li>
         <li class="select2-results__option" id="select2-guild_realm-result-x029-Drak'Tharon" role="treeitem" aria-selected="false">Drak'Tharon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-50q3-Drak'thul" role="treeitem" aria-selected="false">Drak'thul</li>
         <li class="select2-results__option" id="select2-guild_realm-result-l031-Draka" role="treeitem" aria-selected="false">Draka</li>
         <li class="select2-results__option" id="select2-guild_realm-result-6v1s-Drakkari" role="treeitem" aria-selected="false">Drakkari</li>
         <li class="select2-results__option" id="select2-guild_realm-result-pqom-Dreadmaul" role="treeitem" aria-selected="false">Dreadmaul</li>
         <li class="select2-results__option" id="select2-guild_realm-result-nfbb-Drenden" role="treeitem" aria-selected="false">Drenden</li>
         <li class="select2-results__option" id="select2-guild_realm-result-iyqz-Dunemaul" role="treeitem" aria-selected="false">Dunemaul</li>
         <li class="select2-results__option" id="select2-guild_realm-result-q3vj-Durotan" role="treeitem" aria-selected="false">Durotan</li>
         <li class="select2-results__option" id="select2-guild_realm-result-a6sz-Duskwood" role="treeitem" aria-selected="false">Duskwood</li>
         <li class="select2-results__option" id="select2-guild_realm-result-grlw-Earthen Ring" role="treeitem" aria-selected="false">Earthen Ring</li>
         <li class="select2-results__option" id="select2-guild_realm-result-3nwe-Echo Isles" role="treeitem" aria-selected="false">Echo Isles</li>
         <li class="select2-results__option" id="select2-guild_realm-result-blrd-Eitrigg" role="treeitem" aria-selected="false">Eitrigg</li>
         <li class="select2-results__option" id="select2-guild_realm-result-7ii2-Eldre'Thalas" role="treeitem" aria-selected="false">Eldre'Thalas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ig90-Elune" role="treeitem" aria-selected="false">Elune</li>
         <li class="select2-results__option" id="select2-guild_realm-result-l81k-Emerald Dream" role="treeitem" aria-selected="false">Emerald Dream</li>
         <li class="select2-results__option" id="select2-guild_realm-result-yhof-Eonar" role="treeitem" aria-selected="false">Eonar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-470n-Eredar" role="treeitem" aria-selected="false">Eredar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-gsoe-Executus" role="treeitem" aria-selected="false">Executus</li>
         <li class="select2-results__option" id="select2-guild_realm-result-j6sv-Exodar" role="treeitem" aria-selected="false">Exodar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-6mu9-Farstriders" role="treeitem" aria-selected="false">Farstriders</li>
         <li class="select2-results__option" id="select2-guild_realm-result-j90a-Feathermoon" role="treeitem" aria-selected="false">Feathermoon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-riwv-Fenris" role="treeitem" aria-selected="false">Fenris</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ea45-Firetree" role="treeitem" aria-selected="false">Firetree</li>
         <li class="select2-results__option" id="select2-guild_realm-result-0w2f-Fizzcrank" role="treeitem" aria-selected="false">Fizzcrank</li>
         <li class="select2-results__option" id="select2-guild_realm-result-d28c-Frostmane" role="treeitem" aria-selected="false">Frostmane</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ifft-Frostmourne" role="treeitem" aria-selected="false">Frostmourne</li>
         <li class="select2-results__option" id="select2-guild_realm-result-q0gr-Frostwolf" role="treeitem" aria-selected="false">Frostwolf</li>
         <li class="select2-results__option" id="select2-guild_realm-result-oina-Galakrond" role="treeitem" aria-selected="false">Galakrond</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jkgj-Gallywix" role="treeitem" aria-selected="false">Gallywix</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jjm0-Garithos" role="treeitem" aria-selected="false">Garithos</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jrh3-Garona" role="treeitem" aria-selected="false">Garona</li>
         <li class="select2-results__option" id="select2-guild_realm-result-acon-Garrosh" role="treeitem" aria-selected="false">Garrosh</li>
         <li class="select2-results__option" id="select2-guild_realm-result-7o0l-Ghostlands" role="treeitem" aria-selected="false">Ghostlands</li>
         <li class="select2-results__option" id="select2-guild_realm-result-n8hk-Gilneas" role="treeitem" aria-selected="false">Gilneas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-zf0d-Gnomeregan" role="treeitem" aria-selected="false">Gnomeregan</li>
         <li class="select2-results__option" id="select2-guild_realm-result-wsaq-Goldrinn" role="treeitem" aria-selected="false">Goldrinn</li>
         <li class="select2-results__option" id="select2-guild_realm-result-z37j-Gorefiend" role="treeitem" aria-selected="false">Gorefiend</li>
         <li class="select2-results__option" id="select2-guild_realm-result-kkf0-Gorgonnash" role="treeitem" aria-selected="false">Gorgonnash</li>
         <li class="select2-results__option" id="select2-guild_realm-result-1guo-Greymane" role="treeitem" aria-selected="false">Greymane</li>
         <li class="select2-results__option" id="select2-guild_realm-result-sxxo-Grizzly Hills" role="treeitem" aria-selected="false">Grizzly Hills</li>
         <li class="select2-results__option" id="select2-guild_realm-result-hfae-Gul'dan" role="treeitem" aria-selected="false">Gul'dan</li>
         <li class="select2-results__option" id="select2-guild_realm-result-wdf7-Gundrak" role="treeitem" aria-selected="false">Gundrak</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8xg6-Gurubashi" role="treeitem" aria-selected="false">Gurubashi</li>
         <li class="select2-results__option" id="select2-guild_realm-result-vf59-Hakkar" role="treeitem" aria-selected="false">Hakkar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-9292-Haomarush" role="treeitem" aria-selected="false">Haomarush</li>
         <li class="select2-results__option" id="select2-guild_realm-result-4ral-Hellscream" role="treeitem" aria-selected="false">Hellscream</li>
         <li class="select2-results__option" id="select2-guild_realm-result-3yv1-Hydraxis" role="treeitem" aria-selected="false">Hydraxis</li>
         <li class="select2-results__option" id="select2-guild_realm-result-fmen-Hyjal" role="treeitem" aria-selected="false">Hyjal</li>
         <li class="select2-results__option" id="select2-guild_realm-result-fu8y-Icecrown" role="treeitem" aria-selected="false">Icecrown</li>
         <li class="select2-results__option" id="select2-guild_realm-result-rer0-Illidan" role="treeitem" aria-selected="false">Illidan</li>
         <li class="select2-results__option" id="select2-guild_realm-result-3rho-Jaedenar" role="treeitem" aria-selected="false">Jaedenar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-xqib-Jubei'Thos" role="treeitem" aria-selected="false">Jubei'Thos</li>
         <li class="select2-results__option" id="select2-guild_realm-result-2ik6-Kael'thas" role="treeitem" aria-selected="false">Kael'thas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-kgca-Kalaran" role="treeitem" aria-selected="false">Kalaran</li>
         <li class="select2-results__option" id="select2-guild_realm-result-levd-Kalecgos" role="treeitem" aria-selected="false">Kalecgos</li>
         <li class="select2-results__option" id="select2-guild_realm-result-oojj-Kargath" role="treeitem" aria-selected="false">Kargath</li>
         <li class="select2-results__option" id="select2-guild_realm-result-zbg1-Kel'Thuzad" role="treeitem" aria-selected="false">Kel'Thuzad</li>
         <li class="select2-results__option" id="select2-guild_realm-result-k067-Khadgar" role="treeitem" aria-selected="false">Khadgar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8rw8-Khaz Modan" role="treeitem" aria-selected="false">Khaz Modan</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ovqz-Khaz'goroth" role="treeitem" aria-selected="false">Khaz'goroth</li>
         <li class="select2-results__option" id="select2-guild_realm-result-acxp-Kil'jaeden" role="treeitem" aria-selected="false">Kil'jaeden</li>
         <li class="select2-results__option" id="select2-guild_realm-result-fln9-Kilrogg" role="treeitem" aria-selected="false">Kilrogg</li>
         <li class="select2-results__option" id="select2-guild_realm-result-f8qv-Kirin Tor" role="treeitem" aria-selected="false">Kirin Tor</li>
         <li class="select2-results__option" id="select2-guild_realm-result-mgfm-Korgath" role="treeitem" aria-selected="false">Korgath</li>
         <li class="select2-results__option" id="select2-guild_realm-result-l041-Korialstrasz" role="treeitem" aria-selected="false">Korialstrasz</li>
         <li class="select2-results__option" id="select2-guild_realm-result-iflw-Kul Tiras" role="treeitem" aria-selected="false">Kul Tiras</li>
         <li class="select2-results__option" id="select2-guild_realm-result-3bf7-Laughing Skull" role="treeitem" aria-selected="false">Laughing Skull</li>
         <li class="select2-results__option" id="select2-guild_realm-result-b98p-Lethon" role="treeitem" aria-selected="false">Lethon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-db9o-Lightbringer" role="treeitem" aria-selected="false">Lightbringer</li>
         <li class="select2-results__option" id="select2-guild_realm-result-sssr-Lightning's Blade" role="treeitem" aria-selected="false">Lightning's Blade</li>
         <li class="select2-results__option" id="select2-guild_realm-result-niiq-Lightninghoof" role="treeitem" aria-selected="false">Lightninghoof</li>
         <li class="select2-results__option" id="select2-guild_realm-result-vdsz-Llane" role="treeitem" aria-selected="false">Llane</li>
         <li class="select2-results__option" id="select2-guild_realm-result-wnvf-Lothar" role="treeitem" aria-selected="false">Lothar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8aq2-Lycanthoth" role="treeitem" aria-selected="false">Lycanthoth</li>
         <li class="select2-results__option" id="select2-guild_realm-result-3mhb-Madoran" role="treeitem" aria-selected="false">Madoran</li>
         <li class="select2-results__option" id="select2-guild_realm-result-vf7d-Maelstrom" role="treeitem" aria-selected="false">Maelstrom</li>
         <li class="select2-results__option" id="select2-guild_realm-result-yabh-Magtheridon" role="treeitem" aria-selected="false">Magtheridon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-d6lt-Maiev" role="treeitem" aria-selected="false">Maiev</li>
         <li class="select2-results__option" id="select2-guild_realm-result-p8xz-Mal'Ganis" role="treeitem" aria-selected="false">Mal'Ganis</li>
         <li class="select2-results__option" id="select2-guild_realm-result-z0cy-Malfurion" role="treeitem" aria-selected="false">Malfurion</li>
         <li class="select2-results__option" id="select2-guild_realm-result-a8xf-Malorne" role="treeitem" aria-selected="false">Malorne</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jj2x-Malygos" role="treeitem" aria-selected="false">Malygos</li>
         <li class="select2-results__option" id="select2-guild_realm-result-fpjw-Mannoroth" role="treeitem" aria-selected="false">Mannoroth</li>
         <li class="select2-results__option" id="select2-guild_realm-result-nkh7-Medivh" role="treeitem" aria-selected="false">Medivh</li>
         <li class="select2-results__option" id="select2-guild_realm-result-6ein-Misha" role="treeitem" aria-selected="false">Misha</li>
         <li class="select2-results__option" id="select2-guild_realm-result-lz1v-Mok'Nathal" role="treeitem" aria-selected="false">Mok'Nathal</li>
         <li class="select2-results__option" id="select2-guild_realm-result-hzh4-Moon Guard" role="treeitem" aria-selected="false">Moon Guard</li>
         <li class="select2-results__option" id="select2-guild_realm-result-r544-Moonrunner" role="treeitem" aria-selected="false">Moonrunner</li>
         <li class="select2-results__option" id="select2-guild_realm-result-n3p4-Mug'thol" role="treeitem" aria-selected="false">Mug'thol</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ouvq-Muradin" role="treeitem" aria-selected="false">Muradin</li>
         <li class="select2-results__option" id="select2-guild_realm-result-lj7h-Nagrand" role="treeitem" aria-selected="false">Nagrand</li>
         <li class="select2-results__option" id="select2-guild_realm-result-z3iq-Nathrezim" role="treeitem" aria-selected="false">Nathrezim</li>
         <li class="select2-results__option" id="select2-guild_realm-result-rvjb-Nazgrel" role="treeitem" aria-selected="false">Nazgrel</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ocnq-Nazjatar" role="treeitem" aria-selected="false">Nazjatar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-d3k3-Nemesis" role="treeitem" aria-selected="false">Nemesis</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ff2f-Ner'zhul" role="treeitem" aria-selected="false">Ner'zhul</li>
         <li class="select2-results__option" id="select2-guild_realm-result-m2h6-Nesingwary" role="treeitem" aria-selected="false">Nesingwary</li>
         <li class="select2-results__option" id="select2-guild_realm-result-5yt6-Nordrassil" role="treeitem" aria-selected="false">Nordrassil</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8vuh-Norgannon" role="treeitem" aria-selected="false">Norgannon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-4v3c-Onyxia" role="treeitem" aria-selected="false">Onyxia</li>
         <li class="select2-results__option" id="select2-guild_realm-result-6kyv-Perenolde" role="treeitem" aria-selected="false">Perenolde</li>
         <li class="select2-results__option" id="select2-guild_realm-result-y23m-Proudmoore" role="treeitem" aria-selected="false">Proudmoore</li>
         <li class="select2-results__option" id="select2-guild_realm-result-005t-Quel'Thalas" role="treeitem" aria-selected="false">Quel'Thalas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-gj4q-Quel'dorei" role="treeitem" aria-selected="false">Quel'dorei</li>
         <li class="select2-results__option" id="select2-guild_realm-result-3c88-Ragnaros" role="treeitem" aria-selected="false">Ragnaros</li>
         <li class="select2-results__option" id="select2-guild_realm-result-eoix-Ravencrest" role="treeitem" aria-selected="false">Ravencrest</li>
         <li class="select2-results__option" id="select2-guild_realm-result-bv09-Ravenholdt" role="treeitem" aria-selected="false">Ravenholdt</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jgeq-Rexxar" role="treeitem" aria-selected="false">Rexxar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-01wm-Rivendare" role="treeitem" aria-selected="false">Rivendare</li>
         <li class="select2-results__option" id="select2-guild_realm-result-1gq4-Runetotem" role="treeitem" aria-selected="false">Runetotem</li>
         <li class="select2-results__option" id="select2-guild_realm-result-0xit-Sargeras" role="treeitem" aria-selected="false">Sargeras</li>
         <li class="select2-results__option" id="select2-guild_realm-result-pkac-Saurfang" role="treeitem" aria-selected="false">Saurfang</li>
         <li class="select2-results__option" id="select2-guild_realm-result-kcus-Scarlet Crusade" role="treeitem" aria-selected="false">Scarlet Crusade</li>
         <li class="select2-results__option" id="select2-guild_realm-result-dbsg-Scilla" role="treeitem" aria-selected="false">Scilla</li>
         <li class="select2-results__option" id="select2-guild_realm-result-yguv-Sen'jin" role="treeitem" aria-selected="false">Sen'jin</li>
         <li class="select2-results__option" id="select2-guild_realm-result-6yok-Sentinels" role="treeitem" aria-selected="false">Sentinels</li>
         <li class="select2-results__option" id="select2-guild_realm-result-9vcj-Shadow Council" role="treeitem" aria-selected="false">Shadow Council</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ms4s-Shadowmoon" role="treeitem" aria-selected="false">Shadowmoon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-x05l-Shadowsong" role="treeitem" aria-selected="false">Shadowsong</li>
         <li class="select2-results__option" id="select2-guild_realm-result-kxr9-Shandris" role="treeitem" aria-selected="false">Shandris</li>
         <li class="select2-results__option" id="select2-guild_realm-result-m7bx-Shattered Halls" role="treeitem" aria-selected="false">Shattered Halls</li>
         <li class="select2-results__option" id="select2-guild_realm-result-5vlh-Shattered Hand" role="treeitem" aria-selected="false">Shattered Hand</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ef9e-Shu'halo" role="treeitem" aria-selected="false">Shu'halo</li>
         <li class="select2-results__option" id="select2-guild_realm-result-zifg-Silver Hand" role="treeitem" aria-selected="false">Silver Hand</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jz49-Silvermoon" role="treeitem" aria-selected="false">Silvermoon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-6agw-Sisters of Elune" role="treeitem" aria-selected="false">Sisters of Elune</li>
         <li class="select2-results__option" id="select2-guild_realm-result-3d6a-Skullcrusher" role="treeitem" aria-selected="false">Skullcrusher</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ii4s-Skywall" role="treeitem" aria-selected="false">Skywall</li>
         <li class="select2-results__option" id="select2-guild_realm-result-xksu-Smolderthorn" role="treeitem" aria-selected="false">Smolderthorn</li>
         <li class="select2-results__option" id="select2-guild_realm-result-f1q3-Spinebreaker" role="treeitem" aria-selected="false">Spinebreaker</li>
         <li class="select2-results__option" id="select2-guild_realm-result-5wmc-Spirestone" role="treeitem" aria-selected="false">Spirestone</li>
         <li class="select2-results__option" id="select2-guild_realm-result-yciv-Staghelm" role="treeitem" aria-selected="false">Staghelm</li>
         <li class="select2-results__option" id="select2-guild_realm-result-9uod-Steamwheedle Cartel" role="treeitem" aria-selected="false">Steamwheedle Cartel</li>
         <li class="select2-results__option" id="select2-guild_realm-result-0ynv-Stonemaul" role="treeitem" aria-selected="false">Stonemaul</li>
         <li class="select2-results__option" id="select2-guild_realm-result-0zje-Stormrage" role="treeitem" aria-selected="false">Stormrage</li>
         <li class="select2-results__option" id="select2-guild_realm-result-t8k0-Stormreaver" role="treeitem" aria-selected="false">Stormreaver</li>
         <li class="select2-results__option" id="select2-guild_realm-result-kycj-Stormscale" role="treeitem" aria-selected="false">Stormscale</li>
         <li class="select2-results__option" id="select2-guild_realm-result-sv7k-Suramar" role="treeitem" aria-selected="false">Suramar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-qbnh-Tanaris" role="treeitem" aria-selected="false">Tanaris</li>
         <li class="select2-results__option" id="select2-guild_realm-result-lhn2-Terenas" role="treeitem" aria-selected="false">Terenas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-1gqm-Terokkar" role="treeitem" aria-selected="false">Terokkar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-7iqe-Thaurissan" role="treeitem" aria-selected="false">Thaurissan</li>
         <li class="select2-results__option" id="select2-guild_realm-result-yxg2-The Forgotten Coast" role="treeitem" aria-selected="false">The Forgotten Coast</li>
         <li class="select2-results__option" id="select2-guild_realm-result-pl23-The Scryers" role="treeitem" aria-selected="false">The Scryers</li>
         <li class="select2-results__option" id="select2-guild_realm-result-0yib-The Underbog" role="treeitem" aria-selected="false">The Underbog</li>
         <li class="select2-results__option" id="select2-guild_realm-result-swzj-The Venture Co" role="treeitem" aria-selected="false">The Venture Co</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jfyq-Thorium Brotherhood" role="treeitem" aria-selected="false">Thorium Brotherhood</li>
         <li class="select2-results__option" id="select2-guild_realm-result-cxb9-Thrall" role="treeitem" aria-selected="false">Thrall</li>
         <li class="select2-results__option" id="select2-guild_realm-result-68yf-Thunderhorn" role="treeitem" aria-selected="false">Thunderhorn</li>
         <li class="select2-results__option" id="select2-guild_realm-result-yfyb-Thunderlord" role="treeitem" aria-selected="false">Thunderlord</li>
         <li class="select2-results__option" id="select2-guild_realm-result-lgkm-Tichondrius" role="treeitem" aria-selected="false">Tichondrius</li>
         <li class="select2-results__option" id="select2-guild_realm-result-siur-Tol Barad" role="treeitem" aria-selected="false">Tol Barad</li>
         <li class="select2-results__option" id="select2-guild_realm-result-wfve-Tortheldrin" role="treeitem" aria-selected="false">Tortheldrin</li>
         <li class="select2-results__option" id="select2-guild_realm-result-be7e-Trollbane" role="treeitem" aria-selected="false">Trollbane</li>
         <li class="select2-results__option" id="select2-guild_realm-result-4ij8-Turalyon" role="treeitem" aria-selected="false">Turalyon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-t862-Twisting Nether" role="treeitem" aria-selected="false">Twisting Nether</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ep3r-Uldaman" role="treeitem" aria-selected="false">Uldaman</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8v7q-Uldum" role="treeitem" aria-selected="false">Uldum</li>
         <li class="select2-results__option" id="select2-guild_realm-result-5yym-Undermine" role="treeitem" aria-selected="false">Undermine</li>
         <li class="select2-results__option" id="select2-guild_realm-result-qc2l-Ursin" role="treeitem" aria-selected="false">Ursin</li>
         <li class="select2-results__option" id="select2-guild_realm-result-v3eb-Uther" role="treeitem" aria-selected="false">Uther</li>
         <li class="select2-results__option" id="select2-guild_realm-result-7x9e-Vashj" role="treeitem" aria-selected="false">Vashj</li>
         <li class="select2-results__option" id="select2-guild_realm-result-4ad8-Vek'nilash" role="treeitem" aria-selected="false">Vek'nilash</li>
         <li class="select2-results__option" id="select2-guild_realm-result-7fyl-Velen" role="treeitem" aria-selected="false">Velen</li>
         <li class="select2-results__option" id="select2-guild_realm-result-lwi6-Warsong" role="treeitem" aria-selected="false">Warsong</li>
         <li class="select2-results__option" id="select2-guild_realm-result-3f15-Whisperwind" role="treeitem" aria-selected="false">Whisperwind</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8omp-Wildhammer" role="treeitem" aria-selected="false">Wildhammer</li>
         <li class="select2-results__option" id="select2-guild_realm-result-sl1r-Windrunner" role="treeitem" aria-selected="false">Windrunner</li>
         <li class="select2-results__option" id="select2-guild_realm-result-cuei-Winterhoof" role="treeitem" aria-selected="false">Winterhoof</li>
         <li class="select2-results__option" id="select2-guild_realm-result-vw0e-Wyrmrest Accord" role="treeitem" aria-selected="false">Wyrmrest Accord</li>
         <li class="select2-results__option" id="select2-guild_realm-result-lrx1-Ysera" role="treeitem" aria-selected="false">Ysera</li>
         <li class="select2-results__option" id="select2-guild_realm-result-s0by-Ysondre" role="treeitem" aria-selected="false">Ysondre</li>
         <li class="select2-results__option" id="select2-guild_realm-result-vndd-Zangarmarsh" role="treeitem" aria-selected="false">Zangarmarsh</li>
         <li class="select2-results__option" id="select2-guild_realm-result-66s9-Zul'jin" role="treeitem" aria-selected="false">Zul'jin</li>
         <li class="select2-results__option" id="select2-guild_realm-result-izwc-Zuluhed" role="treeitem" aria-selected="false">Zuluhed</li>`;

const twRealms = `<li class="select2-results__option" id="select2-guild_realm-result-uunn-Arthas" role="treeitem" aria-selected="false">Arthas</li>
         <li class="select2-results__option" id="select2-guild_realm-result-37dq-Arygos" role="treeitem" aria-selected="false">Arygos</li>
         <li class="select2-results__option" id="select2-guild_realm-result-wye0-Bleeding Hollow" role="treeitem" aria-selected="false">Bleeding Hollow</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ucuw-Chillwind Point" role="treeitem" aria-selected="false">Chillwind Point</li>
         <li class="select2-results__option" id="select2-guild_realm-result-2uvu-Crystalpine Stinger" role="treeitem" aria-selected="false">Crystalpine Stinger</li>
         <li class="select2-results__option" id="select2-guild_realm-result-j77s-Demon Fall Canyon" role="treeitem" aria-selected="false">Demon Fall Canyon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-letd-Dragonmaw" role="treeitem" aria-selected="false">Dragonmaw</li>
         <li class="select2-results__option" id="select2-guild_realm-result-gzee-Frostmane" role="treeitem" aria-selected="false">Frostmane</li>
         <li class="select2-results__option" id="select2-guild_realm-result-hoke-Hellscream" role="treeitem" aria-selected="false">Hellscream</li>
         <li class="select2-results__option" id="select2-guild_realm-result-u9t9-Icecrown" role="treeitem" aria-selected="false">Icecrown</li>
         <li class="select2-results__option" id="select2-guild_realm-result-jup9-Light's Hope" role="treeitem" aria-selected="false">Light's Hope</li>
         <li class="select2-results__option" id="select2-guild_realm-result-2058-Menethil" role="treeitem" aria-selected="false">Menethil</li>
         <li class="select2-results__option" id="select2-guild_realm-result-h9o6-Nightsong" role="treeitem" aria-selected="false">Nightsong</li>
         <li class="select2-results__option" id="select2-guild_realm-result-v38y-Order of the Cloud Serpent" role="treeitem" aria-selected="false">Order of the Cloud Serpent</li>
         <li class="select2-results__option" id="select2-guild_realm-result-9vqu-Quel'dorei" role="treeitem" aria-selected="false">Quel'dorei</li>
         <li class="select2-results__option" id="select2-guild_realm-result-776e-Shadowmoon" role="treeitem" aria-selected="false">Shadowmoon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ieg1-Silverwing Hold" role="treeitem" aria-selected="false">Silverwing Hold</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8hdn-Skywall" role="treeitem" aria-selected="false">Skywall</li>
         <li class="select2-results__option" id="select2-guild_realm-result-pb0l-Spirestone" role="treeitem" aria-selected="false">Spirestone</li>
         <li class="select2-results__option" id="select2-guild_realm-result-xl9u-Stormscale" role="treeitem" aria-selected="false">Stormscale</li>
         <li class="select2-results__option" id="select2-guild_realm-result-nppj-Sundown Marsh" role="treeitem" aria-selected="false">Sundown Marsh</li>
         <li class="select2-results__option" id="select2-guild_realm-result-gwu1-Whisperwind" role="treeitem" aria-selected="false">Whisperwind</li>
         <li class="select2-results__option" id="select2-guild_realm-result-d5iy-World Tree" role="treeitem" aria-selected="false">World Tree</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ks49-Wrathbringer" role="treeitem" aria-selected="false">Wrathbringer</li>
         <li class="select2-results__option" id="select2-guild_realm-result-3o53-Zealot Blade" role="treeitem" aria-selected="false">Zealot Blade</li>
         <li class="select2-results__option" id="select2-guild_realm-result-6fh4-世界之樹" role="treeitem" aria-selected="false">世界之樹</li>
         <li class="select2-results__option" id="select2-guild_realm-result-z772-亞雷戈斯" role="treeitem" aria-selected="false">亞雷戈斯</li>
         <li class="select2-results__option" id="select2-guild_realm-result-45e6-冰霜之刺" role="treeitem" aria-selected="false">冰霜之刺</li>
         <li class="select2-results__option" id="select2-guild_realm-result-4ap4-冰風崗哨" role="treeitem" aria-selected="false">冰風崗哨</li>
         <li class="select2-results__option" id="select2-guild_realm-result-req2-地獄吼" role="treeitem" aria-selected="false">地獄吼</li>
         <li class="select2-results__option" id="select2-guild_realm-result-o186-夜空之歌" role="treeitem" aria-selected="false">夜空之歌</li>
         <li class="select2-results__option" id="select2-guild_realm-result-pocx-天空之牆" role="treeitem" aria-selected="false">天空之牆</li>
         <li class="select2-results__option" id="select2-guild_realm-result-xz5v-寒冰皇冠" role="treeitem" aria-selected="false">寒冰皇冠</li>
         <li class="select2-results__option" id="select2-guild_realm-result-8e4s-尖石" role="treeitem" aria-selected="false">尖石</li>
         <li class="select2-results__option" id="select2-guild_realm-result-hm61-屠魔山谷" role="treeitem" aria-selected="false">屠魔山谷</li>
         <li class="select2-results__option" id="select2-guild_realm-result-zi0c-巨龍之喉" role="treeitem" aria-selected="false">巨龍之喉</li>
         <li class="select2-results__option" id="select2-guild_realm-result-900e-憤怒使者" role="treeitem" aria-selected="false">憤怒使者</li>
         <li class="select2-results__option" id="select2-guild_realm-result-e0wn-日落沼澤" role="treeitem" aria-selected="false">日落沼澤</li>
         <li class="select2-results__option" id="select2-guild_realm-result-kmlp-暗影之月" role="treeitem" aria-selected="false">暗影之月</li>
         <li class="select2-results__option" id="select2-guild_realm-result-n145-水晶之刺" role="treeitem" aria-selected="false">水晶之刺</li>
         <li class="select2-results__option" id="select2-guild_realm-result-t6az-狂熱之刃" role="treeitem" aria-selected="false">狂熱之刃</li>
         <li class="select2-results__option" id="select2-guild_realm-result-phiu-眾星之子" role="treeitem" aria-selected="false">眾星之子</li>
         <li class="select2-results__option" id="select2-guild_realm-result-rg54-米奈希爾" role="treeitem" aria-selected="false">米奈希爾</li>
         <li class="select2-results__option" id="select2-guild_realm-result-b1ao-聖光之願" role="treeitem" aria-selected="false">聖光之願</li>
         <li class="select2-results__option" id="select2-guild_realm-result-3dj8-血之谷" role="treeitem" aria-selected="false">血之谷</li>
         <li class="select2-results__option" id="select2-guild_realm-result-7mun-語風" role="treeitem" aria-selected="false">語風</li>
         <li class="select2-results__option" id="select2-guild_realm-result-vxkg-銀翼要塞" role="treeitem" aria-selected="false">銀翼要塞</li>
         <li class="select2-results__option" id="select2-guild_realm-result-hzhm-阿薩斯" role="treeitem" aria-selected="false">阿薩斯</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ct5h-雲蛟衛" role="treeitem" aria-selected="false">雲蛟衛</li>
         <li class="select2-results__option" id="select2-guild_realm-result-xgbo-雷鱗" role="treeitem" aria-selected="false">雷鱗</li>`;

const krRealms = `<li class="select2-results__option" id="select2-guild_realm-result-4qpp-Alexstrasza" role="treeitem" aria-selected="false">Alexstrasza</li>
         <li class="select2-results__option" id="select2-guild_realm-result-o3c5-Azshara" role="treeitem" aria-selected="false">Azshara</li>
         <li class="select2-results__option" id="select2-guild_realm-result-e3hl-Burning Legion" role="treeitem" aria-selected="false">Burning Legion</li>
         <li class="select2-results__option" id="select2-guild_realm-result-3oye-Cenarius" role="treeitem" aria-selected="false">Cenarius</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ro5a-Dalaran" role="treeitem" aria-selected="false">Dalaran</li>
         <li class="select2-results__option" id="select2-guild_realm-result-llbn-Deathwing" role="treeitem" aria-selected="false">Deathwing</li>
         <li class="select2-results__option" id="select2-guild_realm-result-9xs4-Durotan" role="treeitem" aria-selected="false">Durotan</li>
         <li class="select2-results__option" id="select2-guild_realm-result-fle9-Garona" role="treeitem" aria-selected="false">Garona</li>
         <li class="select2-results__option" id="select2-guild_realm-result-yb3c-Gul'dan" role="treeitem" aria-selected="false">Gul'dan</li>
         <li class="select2-results__option" id="select2-guild_realm-result-4vq2-Hellscream" role="treeitem" aria-selected="false">Hellscream</li>
         <li class="select2-results__option" id="select2-guild_realm-result-pes3-Hyjal" role="treeitem" aria-selected="false">Hyjal</li>
         <li class="select2-results__option" id="select2-guild_realm-result-0o6w-Malfurion" role="treeitem" aria-selected="false">Malfurion</li>
         <li class="select2-results__option" id="select2-guild_realm-result-k1mo-Norgannon" role="treeitem" aria-selected="false">Norgannon</li>
         <li class="select2-results__option" id="select2-guild_realm-result-mghl-Rexxar" role="treeitem" aria-selected="false">Rexxar</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ja33-Stormrage" role="treeitem" aria-selected="false">Stormrage</li>
         <li class="select2-results__option" id="select2-guild_realm-result-lzji-Wildhammer" role="treeitem" aria-selected="false">Wildhammer</li>
         <li class="select2-results__option" id="select2-guild_realm-result-y2fh-Windrunner" role="treeitem" aria-selected="false">Windrunner</li>
         <li class="select2-results__option" id="select2-guild_realm-result-tk7z-Zul'jin" role="treeitem" aria-selected="false">Zul'jin</li>
         <li class="select2-results__option" id="select2-guild_realm-result-r8ir-가로나" role="treeitem" aria-selected="false">가로나</li>
         <li class="select2-results__option" id="select2-guild_realm-result-zzmp-굴단" role="treeitem" aria-selected="false">굴단</li>
         <li class="select2-results__option" id="select2-guild_realm-result-5lwz-노르간논" role="treeitem" aria-selected="false">노르간논</li>
         <li class="select2-results__option" id="select2-guild_realm-result-j1jx-달라란" role="treeitem" aria-selected="false">달라란</li>
         <li class="select2-results__option" id="select2-guild_realm-result-tt57-데스윙" role="treeitem" aria-selected="false">데스윙</li>
         <li class="select2-results__option" id="select2-guild_realm-result-qm9g-듀로탄" role="treeitem" aria-selected="false">듀로탄</li>
         <li class="select2-results__option" id="select2-guild_realm-result-a9jw-렉사르" role="treeitem" aria-selected="false">렉사르</li>
         <li class="select2-results__option" id="select2-guild_realm-result-pdom-말퓨리온" role="treeitem" aria-selected="false">말퓨리온</li>
         <li class="select2-results__option" id="select2-guild_realm-result-b58b-불타는 군단" role="treeitem" aria-selected="false">불타는 군단</li>
         <li class="select2-results__option" id="select2-guild_realm-result-i98u-세나리우스" role="treeitem" aria-selected="false">세나리우스</li>
         <li class="select2-results__option" id="select2-guild_realm-result-ehuq-스톰레이지" role="treeitem" aria-selected="false">스톰레이지</li>
         <li class="select2-results__option" id="select2-guild_realm-result-pk8o-아즈샤라" role="treeitem" aria-selected="false">아즈샤라</li>
         <li class="select2-results__option" id="select2-guild_realm-result-7d6a-알렉스트라자" role="treeitem" aria-selected="false">알렉스트라자</li>
         <li class="select2-results__option" id="select2-guild_realm-result-6f8f-와일드해머" role="treeitem" aria-selected="false">와일드해머</li>
         <li class="select2-results__option" id="select2-guild_realm-result-m790-윈드러너" role="treeitem" aria-selected="false">윈드러너</li>
         <li class="select2-results__option" id="select2-guild_realm-result-s0uw-줄진" role="treeitem" aria-selected="false">줄진</li>
         <li class="select2-results__option" id="select2-guild_realm-result-akez-하이잘" role="treeitem" aria-selected="false">하이잘</li>
         <li class="select2-results__option" id="select2-guild_realm-result-rgf4-헬스크림" role="treeitem" aria-selected="false">헬스크림</li>`;

let realmHtmls = [
    { region: "EU", html: euRealms },
    { region: "US", html: usRealms },
    { region: "TW", html: twRealms },
    { region: "KR", html: krRealms }
];

let realms = [];

realmHtmls.forEach(realmHtml => {
    let m;
    while ((m = regex.exec(realmHtml.html)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        realms.push({ region: realmHtml.region, realm: m[1] });
    }
});


console.log(JSON.stringify(realms));
