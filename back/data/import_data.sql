BEGIN;

--
-- Déchargement des données de la table "save"
--

INSERT INTO "save" ("id", "slot") VALUES
(1, 0);

--
-- Déchargement des données de la table "zone"
--

INSERT INTO "zone" ("id", "code", "name", "description", "background_image", "music_theme", "is_time_running", "age_access") VALUES
(1, 'death_mountain_trail', 'Route du Péril', 'Sentier escarpé serpentant vers les cieux, où le vent chaud caresse les joues et les rochers murmurent des légendes anciennes.', 'death_mountain_trail_young.jpg', 'death_mountain_trail.mp3', true, 'young'),
(2, 'death_mountain_trail', 'Route du Péril', 'Chemin ravagé par le feu et le temps, où chaque pas résonne comme un défi lancé aux montagnes en colère.', 'death_mountain_trail_adult.jpg', 'death_mountain_trail.mp3', true, 'adult'),
(3, 'death_moutain_crater', 'Cratère du Péril', 'Abîme interdit, cœur incandescent de la montagne, où la chaleur danse en volutes mystérieuses.', 'death_moutain_crater_young.jpg', 'death_moutain_crater.mp3', false, 'young'),
(4, 'death_moutain_crater', 'Cratère du Péril', 'Fournaise ardente, antre du feu sacré, où le courage se forge dans les flammes éternelles.', 'death_moutain_crater_adult.jpg', 'death_moutain_crater.mp3', false, 'adult'),
(5, 'desert_colossus', 'Colosse du Desert', 'Silhouette majestueuse émergeant des sables, gardienne silencieuse des secrets du désert.', 'desert_colossus_young.jpg', 'desert_colossus.mp3', true, 'young'),
(6, 'desert_colossus', 'Colosse du Desert', 'Vestige imposant d''une civilisation oubliée, où le vent chante des hymnes de gloire passée.', 'desert_colossus_adult.jpg', 'desert_colossus.mp3', true, 'adult'),
(7, 'dodongo_cavern', 'Caverne Dodongo', 'Grotte obscure où résonnent les grognements des anciens, défiant la bravoure juvénile.', 'dodongo_cavern_young.jpg', 'dodongo_cavern.mp3', false, 'young'),
(8, 'dodongo_cavern', 'Caverne Dodongo', 'Ruines silencieuses, témoins d''une victoire lointaine, où le silence pèse plus que le danger.', 'dodongo_cavern_adult.jpg', 'dodongo_cavern.mp3', false, 'adult'),
(9, 'fire_temple', 'Temple du Feu', 'Sanctuaire enflammé, où chaque flamme éclaire le chemin du héros intrépide.', 'fire_temple_adult.jpg', 'fire_temple.mp3', false, 'adult'),
(10, 'fishing_hole', 'Stand de Pêche', 'Étang paisible où l''eau miroite, invitant à la patience et à la découverte.', 'fishing_hole_young.jpg', 'fishing_hole.mp3', false, 'young'),
(11, 'fishing_hole', 'Stand de Pêche', 'Refuge tranquille, écho d''une innocence passée, où le temps semble suspendu.', 'fishing_hole_adult.jpg', 'fishing_hole.mp3', false, 'adult'),
(12, 'forest_temple', 'Temple de la Forêt', 'Labyrinthe hanté, où la nature enchaînée pleure sa liberté perdue.', 'forest_temple_adult.jpg', 'forest_temple.mp3', false, 'adult'),
(13, 'ganon_tower', 'Tour de Ganon', 'Forteresse sombre, érigée sur les ruines de l''espoir, où le mal règne sans partage.', 'ganon_tower_adult.jpg', 'ganon_tower.mp3', false, 'adult'),
(14, 'gerudo_fortress', 'Forteresse Gerudo', 'Citadelle lointaine, inaccessible, où les vents du désert portent des chants inconnus.', 'gerudo_fortress_young.jpg', 'gerudo_fortress.mp3', false, 'young'),
(15, 'gerudo_fortress', 'Forteresse Gerudo', 'Bastion des guerrières fières, où chaque pierre raconte une histoire de bravoure.', 'gerudo_fortress_adult.jpg', 'gerudo_fortress.mp3', false, 'adult'),
(16, 'gerudo_training_ground', 'Gymnase Gerudo', 'Épreuve ultime, où l''esprit et le corps sont mis à rude épreuve dans l''ombre du désert.', 'gerudo_training_ground_adult.jpg', 'gerudo_training_ground.mp3', false, 'adult'),
(17, 'gerudo_valley', 'Vallée Gerudo', 'Canyon vaste, où le vent joue avec les roches, sculptant des mélodies ancestrales.', 'gerudo_valley_young.jpg', 'gerudo_valley.mp3', true, 'young'),
(18, 'gerudo_valley', 'Vallée Gerudo', 'Passage périlleux, frontière entre le connu et l''inconnu, où chaque pas est un choix.', 'gerudo_valley_adult.jpg', 'gerudo_valley.mp3', true, 'adult'),
(19, 'goron_city', 'Cité Goron', 'Village chaleureux, où les rires résonnent entre les parois rocheuses.', 'goron_city_young.jpg', 'goron_city.mp3', false, 'young'),
(20, 'goron_city', 'Cité Goron', 'Silence pesant, où les échos des jours heureux se perdent dans la pierre froide.', 'goron_city_adult.jpg', 'goron_city.mp3', false, 'adult'),
(21, 'graveyard', 'Cimetière', 'Lieu de repos paisible, où les esprits veillent en silence sous la lune bienveillante.', 'graveyard_young.jpg', 'graveyard.mp3', false, 'young'),
(22, 'graveyard', 'Cimetière', 'Terre sacrée, où les âmes tourmentées murmurent des avertissements au vent nocturne.', 'graveyard_adult.jpg', 'graveyard.mp3', false, 'adult'),
(23, 'great_deku_tree', 'Arbre Mojo', 'Sage millénaire, dont les racines abritent les secrets du monde naissant.', 'great_deku_tree_young.jpg', 'great_deku_tree.mp3', false, 'young'),
(24, 'great_deku_tree', 'Arbre Mojo', 'Souvenir d''une époque révolue, tronc vide résonnant des échos du passé.', 'great_deku_tree_adult.jpg', 'great_deku_tree.mp3', false, 'adult'),
(25, 'haunted_wasteland', 'Desert Hanté', 'Étendue interdite, où les vents sifflent des promesses de sable et de mirage. Le regard se perd vers l’horizon, au-delà du possible pour un cœur encore jeune.', 'haunted_wasteland_young.jpg', 'haunted_wasteland.mp3', false, 'young'),
(26, 'haunted_wasteland', 'Desert Hanté', 'Mer de sable sans fin, où les mirages guident les âmes perdues vers l''inconnu.', 'haunted_wasteland_adult.jpg', 'haunted_wasteland.mp3', false, 'adult'),
(27, 'hyrule_castle', 'Château d''Hyrule', 'Forteresse majestueuse, symbole de paix et de prospérité, baignée de lumière.', 'hyrule_castle_young.jpg', 'hyrule_castle.mp3', true, 'young'),
(28, 'hyrule_castle_courtyard', 'Jardins du Château', 'Allées fleuries, où les papillons dansent au rythme des mélodies innocentes.', 'hyrule_castle_courtyard_young.jpg', 'hyrule_castle_courtyard.mp3', false, 'young'),
(29, 'hyrule_castle_town', 'Place du Marché', 'Carrefour animé, où les rires et les musiques emplissent l''air de joie.', 'hyrule_castle_town_young.jpg', 'hyrule_castle_town.mp3', false, 'young'),
(30, 'hyrule_castle_town', 'Place du Marché', 'Place déserte, hantée par les ombres des souvenirs effacés.', 'hyrule_castle_town_adult.jpg', 'hyrule_castle_town.mp3', false, 'adult'),
(31, 'hyrule_field', 'Plaine d''Hyrule', 'Étendue verdoyante, où chaque brin d''herbe chante la liberté et l''aventure.', 'hyrule_field_young.jpg', 'hyrule_field.mp3', true, 'young'),
(32, 'hyrule_field', 'Plaine d''Hyrule', 'Terre vaste, marquée par le temps, où le vent porte les échos des batailles passées.', 'hyrule_field_adult.jpg', 'hyrule_field.mp3', true, 'adult'),
(33, 'ice_cavern', 'Caverne Polaire', 'Grotte de cristal figée dans le temps, où le silence glacé raconte des légendes oubliées.', 'ice_cavern_adult.jpg', 'ice_cavern.mp3', false, 'adult'),
(34, 'jabu_jabu_belly', 'Ventre de Jabu-Jabu', 'Monde organique et étrange, battant au rythme d’un cœur divin et imprévisible.', 'jabu_jabu_belly_young.jpg', 'jabu_jabu_belly.mp3', false, 'young'),
(35, 'kakariko_village', 'Village Cocorico', 'Hameau paisible au pied des montagnes, bercé par le chant des coqs et des souvenirs.', 'kakariko_village_young.jpg', 'kakariko_village.mp3', true, 'young'),
(36, 'kakariko_village', 'Village Cocorico', 'Village éveillé par les drames, où le murmure du vent se mêle aux soupirs du passé.', 'kakariko_village_adult.jpg', 'kakariko_village.mp3', true, 'adult'),
(37, 'kokiri_forest', 'Forêt Kokiri', 'Forêt enchantée, refuge d’éternelle enfance, baignée de lueurs douces et magiques.', 'kokiri_forest_young.jpg', 'kokiri_forest.mp3', true, 'young'),
(38, 'kokiri_forest', 'Forêt Kokiri', 'Lieu figé dans la nostalgie, où les rires d’antan résonnent dans un silence profond.', 'kokiri_forest_adult.jpg', 'kokiri_forest.mp3', true, 'adult'),
(39, 'lake_hylia', 'Lac Hylia', 'Miroir céleste aux eaux claires, berceau de mystères et de rêveries infinies.', 'lake_hylia_young.jpg', 'lake_hylia.mp3', true, 'young'),
(40, 'lake_hylia', 'Lac Hylia', 'Étendue paisible, marquée par le temps, où la lumière se brise sur les souvenirs immergés.', 'lake_hylia_adult.jpg', 'lake_hylia.mp3', true, 'adult'),
(41, 'lon_lon_ranch', 'Ranch Lon Lon', 'Ferme chantante où les sabots résonnent entre les rires et les chansons douces.', 'lon_lon_ranch_young.jpg', 'lon_lon_ranch.mp3', true, 'young'),
(42, 'lon_lon_ranch', 'Ranch Lon Lon', 'Lieu figé, empreint de mélancolie, où les souvenirs galopent entre les clôtures vides.', 'lon_lon_ranch_adult.jpg', 'lon_lon_ranch.mp3', true, 'adult'),
(43, 'lost_woods', 'Bois Perdus', 'Forêt labyrinthe, où chaque sentier murmure un air familier, appelant les âmes à s’égarer.', 'lost_woods_young.jpg', 'lost_woods.mp3', true, 'young'),
(44, 'lost_woods', 'Bois Perdus', 'Bois hantés par l’écho de voix oubliées, où les arbres semblent observer le passant.', 'lost_woods_adult.jpg', 'lost_woods.mp3', true, 'adult'),
(45, 'market', 'Marché du Château', 'Place joyeuse aux mille odeurs et couleurs, vivante comme un rêve éveillé.', 'market_young.jpg', 'market.mp3', false, 'young'),
(46, 'market', 'Marché du Château', 'Décombres maudits, désertés par la lumière, où les ombres ricanent dans le silence.', 'market_adult.jpg', 'market.mp3', false, 'adult'),
(47, 'sacred_forest_meadow', 'Clairière de la Forêt', 'Lieu sacré baigné de musique, protégé par les esprits anciens de la nature.', 'sacred_forest_meadow_young.jpg', 'sacred_forest_meadow.mp3', false, 'young'),
(48, 'sacred_forest_meadow', 'Clairière de la Forêt', 'Sanctuaire oublié, où les notes éparses résonnent dans un calme pesant.', 'sacred_forest_meadow_adult.jpg', 'sacred_forest_meadow.mp3', false, 'adult'),
(49, 'shadow_temple', 'Temple de l’Ombre', 'Abîme du passé, hanté par les regrets et les douleurs invisibles.', 'shadow_temple_adult.jpg', 'shadow_temple.mp3', false, 'adult'),
(50, 'spirit_temple', 'Temple de l’Esprit', 'Sanctuaire mystique entre deux âges, défi lancé aux forces du temps.', 'spirit_temple_young.jpg', 'spirit_temple.mp3', false, 'young'),
(51, 'spirit_temple', 'Temple de l’Esprit', 'Épreuve ultime, où la sagesse d’hier rencontre la puissance d’aujourd’hui.', 'spirit_temple_adult.jpg', 'spirit_temple.mp3', false, 'adult'),
(52, 'temple_of_time', 'Temple du Temps', 'Lieu solennel, gardien des âges, où le destin s’écrit entre les colonnes sacrées.', 'temple_of_time_young.jpg', 'temple_of_time.mp3', false, 'young'),
(53, 'temple_of_time', 'Temple du Temps', 'Cathédrale du destin, où la lumière transperce les années et révèle la voie du héros.', 'temple_of_time_adult.jpg', 'temple_of_time.mp3', false, 'adult'),
(54, 'water_temple', 'Temple de l’Eau', 'Palais englouti, où les reflets troublés gardent les secrets du courant éternel.', 'water_temple_adult.jpg', 'water_temple.mp3', false, 'adult'),
(55, 'zoras_domain', 'Domaine Zora', 'Caverne cristalline où l’eau chante et les pierres brillent sous les cascades célestes.', 'zoras_domain_young.jpg', 'zoras_domain.mp3', true, 'young'),
(56, 'zoras_domain', 'Domaine Zora', 'Demeure gelée, figée dans une attente silencieuse, sous une couche d’oubli.', 'zoras_domain_adult.jpg', 'zoras_domain.mp3', true, 'adult'),
(57, 'zoras_fountain', 'Fontaine Zora', 'Source sacrée, miroir du ciel au cœur des montagnes, abritant le souffle divin.', 'zoras_fountain_young.jpg', 'zoras_fountain.mp3', false, 'young'),
(58, 'zoras_fountain', 'Fontaine Zora', 'Bassin figé, où le passé repose sous une glace éternelle et mélancolique.', 'zoras_fountain_adult.jpg', 'zoras_fountain.mp3', false, 'adult'),
(59, 'zoras_river', 'Rivière Zora', 'Ruisseau joyeux serpentant entre les bois, invitant au voyage et à la fraîcheur.', 'zoras_river_young.jpg', 'zoras_river.mp3', true, 'young');

--
-- Déchargement des données de la table "character"
--

INSERT INTO "character" ("id", "name", "max_health", "current_health", "max_mana", "current_mana", "is_young", "position_x", "position_y", "save_id") VALUES
(1, 'Caliban', '12', '12', '0', '0', true, 0, 0, 1);

--
-- Déchargement des données de la table "family_item"
--

INSERT INTO "family_item" ("id", "name", "age_access") VALUES
(1, 'slingshot', 'young'),
(2, 'boomerang', 'young'),
(3, 'bows', 'adult'),
(4, 'hammer', 'adult'),
(5, 'explosives', 'both'),
(6, 'deku_materials', 'both'),
(7, 'ocarinas', 'both'),
(8, 'bottles', 'both'),
(9, 'magical_powers', 'both'),
(10, 'masks', 'both');

--
-- Déchargement des données de la table "item"
--

INSERT INTO "item" ("id", "code", "name", "description", "family_item_id") VALUES
(1, 'arrow', 'Flèche', 'Tirées avec justesse, elles filent droit vers leur cible, porteuses de la volonté du tireur. Précises et rapides, elles transpercent l’ombre pour ouvrir la voie.', 3),
(2, 'bomb', 'Bombes', 'Petites sphères de chaos, elles explosent en un éclat puissant, brisant murs et secrets. Instruments de courage, elles ouvrent des passages là où rien ne semblait possible.', 5),
(3, 'bombchu', 'Missiles teigneux', 'Flammes projetées avec force, ces missiles ardents consument l’obscurité, frappant avec vigueur et éclairant la voie des combats les plus ardus.', 5),
(4, 'boomerang', 'Boomerang', 'Lancé avec précision, il tourne et revient, saisissant ennemis et objets. Fidèle compagnon, il relie la main au vent, fidèle messager des combats et des quêtes.', 2),
(5, 'bottle', 'Bouteille', 'Récipient précieux, gardienne de secrets liquides, elle porte remèdes, élixirs ou mystères, prêts à offrir leur pouvoir au moment où tout semble perdu.', 8),
(6, 'bow', 'Arc', 'Arme tendue entre force et finesse, il libère des flèches précises, guidées par la main et l’esprit, reliant le tireur à la cible avec grâce et puissance.', 3),
(7, 'bunny_hood', 'Masque du lapin', 'Masque espiègle, éveillant la vitesse du porteur, il transforme chaque pas en course légère, défiant le temps et les limites du corps avec agilité et malice.', 10),
(8, 'deku_nut', 'Noix Mojo', 'Petite sphère magique, elle fige l’ennemi d’un éclat, suspendant le temps un instant. Arme subtile, elle ouvre la voie en saisissant l’ombre avant qu’elle ne frappe.', 6),
(9, 'deku_seed', 'Graines Mojo', 'Petits fruits du bois sacré, elles sifflent dans l''air, légères et vives. Guidées par l’enfance, elles écartent l’ombre sans jamais verser le sang.', 6),
(10, 'deku_stick', 'Bâtons Mojo', 'Bâtons polyvalents, ils frappent avec force ou s’enflamment en flambeaux ardents. Outils de combat et lumière, ils escortent le voyageur dans l’ombre et le danger.', 6),
(11, 'din_fire', 'Feu de Din', 'Flamme divine, éclat brûlant au creux de la main, elle consume l’ombre, révèle le chemin et libère une force ardente, souffle incandescent du pouvoir primordial.', 9),
(12, 'farore_wind', 'Vent de Farore', 'Souffle léger et sacré, il emporte l’âme, dissipe les obstacles, et ouvre les portes invisibles, messager d’espoir et d’évasion portée par l’air pur des légendes.', 9),
(13, 'fire_arrow', 'Flèches de feux', 'Lancez ces traits embrasés, éclats ardents nés du brasier sacré, qui transpercent l’ombre et consument les ténèbres d’un souffle incandescent et purificateur.', 3),
(14, 'gerudo_mask', 'Masque Gerudo', 'Voile de guerre au souffle brûlant, ce masque imprègne le porteur de l’agilité et de la fougue des combattantes du désert. Chaque coup devient un éclair, rapide et implacable comme le vent du sable.', 10),
(15, 'goron_mask', 'Masque Goron', 'Sculpté dans la roche vivante des montagnes, ce masque robuste incarne la force tranquille et la chaleur volcanique, et ancre le porteur dans une stabilité inébranlable.', 10),
(16, 'ice_arrow', 'Flèches de glace', 'Éclats glacés nés des cieux d’hiver, ces traits cristallins figent le souffle du temps, suspendant l’instant dans un silence froid et éclatant.', 3),
(17, 'keaton_mask', 'Masque du renard', 'Vêtu du mystère des bois et de l’espièglerie des crépuscules, ce masque agile murmure les secrets des ombres dansantes et insuffle au porteur l’esprit des chasseurs furtifs.', 10),
(18, 'light_arrow', 'Flèches de lumière', 'Rayons sacrés forgés dans l’aube céleste, ces traits éblouissants transpercent l’obscurité, portant l’espoir ardent d’un éclat divin et purificateur.', 3),
(19, 'megaton_hammer', 'Masse des Titans', 'Frappe colossale forgée dans la force des anciens, ce lourd fléau fait trembler la terre, libérant la puissance brute des géants endormis.', 4),
(20, 'nayru_love', 'Amour de Nayru', 'Onde douce et protectrice, elle tisse un bouclier d’éclat argenté, un gardien silencieux qui repousse l’ombre et préserve la lumière du cœur vaillant.', 9),
(21, 'saria_ocarina', 'Ocarina des fées', 'Songe cristallin porté par le vent, cet instrument enchanteur tisse des mélodies légères, éveillant la magie douce des bois et des rêves oubliés.', 7),
(22, 'skull_mask', 'Masque de mort', 'Écho funeste des âmes éteintes, ce masque lugubre au souffle glacé enveloppe le porteur d’une aura spectrale.', 10),
(23, 'slingshot', 'Lance-pierre', 'Compagnon espiègle des jeunes héros, il propulse pierres et espoirs avec l’audace de l’enfance, défiant le danger d’un simple éclat de malice.', 1),
(24, 'spooky_mask', 'Masque d''effroi', 'Visage figé dans l’ombre, il sème la peur d’un seul regard, invoquant les terreurs tapies au cœur des nuits silencieuses et des âmes troublées.', 10),
(25, 'time_ocarina', 'Ocarina du temps', 'Relique sacrée aux notes éternelles, il modèle les âges et ouvre les portes du destin, portant sur chaque souffle la mémoire profonde du monde.', 7),
(26, 'truth_mask', 'Masque de vérité', 'Voile mystique des secrets tus, il perce les illusions, dévoilant murmures enfouis et vérités cachées, là où les yeux seuls ne peuvent jamais voir.', 10),
(27, 'zora_mask', 'Masque Zora', 'Né de l’écume des flots, ce masque fusionne le porteur avec l’élan des courants où il revêt l’âme des océans et la grâce argentée des vagues silencieuses.', 10);

--
-- Déchargement des données de la table "skill"
--

INSERT INTO "skill" ("id", "code", "name", "description") VALUES
(1, 'adult_wallet', 'Grande Bourse', 'Permet de porter jusqu''à 200 rubis.'),
(2, 'attack', 'Epée Kokiri', 'Forgée pour l’innocence, légère comme un souffle d’enfance, cette lame simple éclaire les premiers pas d’un voyage, quand le cœur est encore pur et les rêves infinis.'),
(3, 'attack_great_upgrade', 'Epée Biggoron', 'Forgée par des mains de pierre au sommet du monde, elle pèse le silence des géants. Immense et fidèle, elle brise les doutes comme les armures.'),
(4, 'attack_upgrade', 'Mastersword', 'Endormie dans la lumière, elle attend le héros. Née pour trancher les ombres, sa lame murmure l’éternité à ceux qui portent la mémoire des âges.'),
(5, 'bomb_bag_great_upgrade', 'Sac de bombes géant', 'Permet de porter jusqu''à 40 bombes.'),
(6, 'bomb_bag_upgrade', 'Grand sac de bombes', 'Permet de porter jusqu''à 30 bombes.'),
(7, 'bullet', 'Graines Mojo', 'Petits fruits du bois sacré, elles sifflent dans l''air, légères et vives. Guidées par l’enfance, elles écartent l’ombre sans jamais verser le sang.'),
(8, 'bullet_great_upgrade', 'Sacoche géante', 'Permet de porter jusqu''à 40 graines Mojo.'),
(9, 'bullet_upgrade', 'Grande sacoche', 'Permet de porter jusqu''à 30 graines Mojo.'),
(10, 'deku_nut_great_upgrade', 'Sac de noix géant', 'Permet de porter jusqu''à 40 noix Mojo.'),
(11, 'deku_nut_upgrade', 'Grand sac de noix', 'Permet de porter jusqu''à 30 noix Mojo.'),
(12, 'deku_shield', 'Bouclier Mojo', 'Une écorce ancienne, taillée à la main, porte encore la mémoire des bois. Il protège le cœur jeune avec la sagesse silencieuse des forêts profondes.'),
(13, 'deku_stick_great_upgrade', 'Etui géant', 'Permet de porter jusqu''à 40 bâtons Mojo.'),
(14, 'deku_stick_upgrade', 'Grand étui', 'Permet de porter jusqu''à 30 bâtons Mojo.'),
(15, 'epona', 'Epona', 'Compagne fidèle au galop libre, elle porte le vent et le courage. Entre prairies et montagnes, elle unit l’âme du héros à la terre sauvage.'),
(16, 'gauntlets', 'Gantelets d''argent', 'Parés d’éclat lunaire, ils renforcent la force et le lien sacré entre la main et la destinée. Porteurs d’un pouvoir ancien, ils élèvent l’âme du porteur.'),
(17, 'giant_wallet', 'Bourse géante', 'Permet de porter jusqu''à 500 rubis.'),
(18, 'golden_gauntlets', 'Gantelets d''or', 'Forgés dans la lumière des astres, ils confèrent une puissance surhumaine, éveillant la vigueur ultime du porteur et ouvrant les portes des défis les plus ardus.'),
(19, 'golden_scale', 'Ecaille d''or', 'Offerte par l’océan, cette écaille d’or murmure les secrets des abysses, transformant chaque nage en danse sacrée avec les esprits des eaux profondes.'),
(20, 'goron_bracelet', 'Bracelet Goron', 'Ce bracelet robuste, forgé dans les flammes des montagnes, donne la force brute des Gorons, capable de soulever des pierres et briser les barrières du destin.'),
(21, 'goron_tunic', 'Tunique Goron', 'Tissée dans la chaleur des entrailles volcaniques, cette tunique embrasse son porteur d’une chaleur brute, lui permettant d’affronter les flammes là où la roche respire et gronde.'),
(22, 'great_hook', 'Super grappin', 'Une chaîne renforcée, plus longue et plus solide, qui saisit les sommets éloignés. Il tisse un pont entre le héros et les mystères cachés, défiant les limites du possible.'),
(23, 'ground_attack', 'Attaque au sol', 'Le sol résonne sous l’impact, la force brute déferle en une onde implacable, brisant les défenses et imposant le silence, là où le courage frappe sans relâche.'),
(24, 'hook', 'Grappin', 'Un crochet d’acier, prêt à s’accrocher aux recoins lointains. Tel un lien entre le courage et l’aventure, il rapproche l’impossible et révèle de nouveaux horizons.'),
(25, 'hover_boots', 'Bottes ailées', 'Tissées du souffle des vents anciens, elles effleurent la terre à peine un instant, propulsant leur porteur vers l’horizon, là où même l’air hésite à le suivre.'),
(26, 'hylian_shield', 'Bouclier hylien', 'Forgé dans le cœur d’Hyrule, ce bouclier porte les symboles sacrés du royaume. Gardien fidèle, il repousse l’ombre et protège le héros dans sa quête.'),
(27, 'iron_boots', 'Bottes de plomb', 'Nées du poids des abysses, ces bottes lestées ancrent le porteur à la terre, lui permettant de fouler les profondeurs silencieuses où le temps lui-même semble suspendu.'),
(28, 'mirror_shield', 'Bouclier miroir', 'Polie comme l’eau calme, cette surface reflète la lumière des ténèbres. Bouclier mystérieux, elle renvoie les sorts ennemis et éclaire le chemin du courage.'),
(29, 'quiver_great_upgrade', 'Carquois géant', 'Permet de porter jusqu''à 40 flèches.'),
(30, 'quiver_upgrade', 'Grand carquois', 'Permet de porter jusqu''à 30 flèches.'),
(31, 'silver_scale', 'Ecaille d''argent', 'Née des larmes argentées de la lune, cette écaille enlace le nageur d’un éclat pâle, ouvrant les portes des rivières secrètes où chantent les esprits des eaux claires.'),
(32, 'spin_attack', 'Attaque tournoyante', 'Tel un cyclone éveillé par la lame, le héros virevolte dans un tourbillon d’acier et de lumière, balayant tout sur son passage dans une danse foudroyante et précise.'),
(33, 'truth_lens', 'Monocle de vérité', 'Œil de clairvoyance, lentille d’âme dévoilée, il perce les voiles du mensonge et révèle ce que le cœur cache, éclatant dans l’ombre des secrets enfouis.'),
(34, 'zora_tunic', 'Tunique Zora', 'Façonnée dans les eaux cristallines, elle épouse le corps comme une seconde peau, offrant souffle et aisance sous les vagues, là où le monde liquide révèle ses secrets.');

--
-- Déchargement des données de la table "progress_flag"
--

INSERT INTO "progress_flag" ("id", "code") VALUES
(1, 'Ceci est un progress_flag test');

--
-- Déchargement des données de la table "character_has_item"
--

-- INSERT INTO "character_has_item" ("character_id", "item_id", "quantity") VALUES
-- (1, 2, 0);

--
-- Déchargement des données de la table "character_has_skill"
--

-- INSERT INTO "character_has_skill" ("character_id", "skill_id") VALUES
-- (1, 2);

--
-- Déchargement des données de la table "character_has_progress_flag"
--

-- INSERT INTO "character_has_progress_flag" ("character_id", "progress_flag_id") VALUES
-- (1, 2);

--
-- Déchargement des données de la table "zone_require_item"
--

-- INSERT INTO "zone_require_item" ("zone_id", "item_id") VALUES
-- (1, 2);

--
-- Déchargement des données de la table "zone_require_skill"
--

-- INSERT INTO "zone_require_skill" ("zone_id", "skill_id") VALUES
-- (1, 2);

--
-- Déchargement des données de la table "zone_require_progress_flag"
--

-- INSERT INTO "zone_require_progress_flag" ("zone_id", "progress_flag_id") VALUES
-- (1, 2);

COMMIT;
