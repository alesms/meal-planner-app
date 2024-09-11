const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: [String],
  type: String,
  season: String,
  prepTime: Number,
  instructions: [String]
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// const recipes = [
//   // Inserisci qui tutte le tue ricette dal file JSON originale
//   {
//     "id": 1,
//     "name": "Pizza fritta",
//     "ingredients": [
//       "300g farina",
//       "200g mozzarella",
//       "200g pomodoro",
//       "basilico"
//     ],
//     "type": "pizza",
//     "season": "all",
//     "prepTime": 30,
//     "instructions": [
//       "Preparare l'impasto con farina, acqua, lievito e sale. Lasciare lievitare per 2 ore.",
//       "Stendere l'impasto in dischi di 15cm di diametro.",
//       "Friggere i dischi in olio caldo fino a doratura.",
//       "Farcire con pomodoro, mozzarella e basilico."
//     ]
//   },
//   {
//     "id": 2,
//     "name": "Pasta alla Napoletana",
//     "ingredients": [
//       "350g pasta",
//       "400g pomodoro",
//       "basilico",
//       "50g parmigiano"
//     ],
//     "type": "pasta",
//     "season": "summer",
//     "prepTime": 20,
//     "instructions": [
//       "Cuocere la pasta in acqua salata.",
//       "In una padella, scaldare il pomodoro con olio e basilico.",
//       "Scolare la pasta e unirla al sugo.",
//       "Servire con parmigiano grattugiato."
//     ]
//   },
//   {
//     "id": 3,
//     "name": "Pasta e patate",
//     "ingredients": [
//       "300g pasta mista",
//       "400g patate",
//       "50g pancetta",
//       "50g parmigiano",
//       "1 cipolla",
//       "rosmarino"
//     ],
//     "type": "pasta",
//     "season": "autumn",
//     "prepTime": 35,
//     "instructions": [
//       "Soffriggere cipolla e pancetta.",
//       "Aggiungere patate a cubetti e rosmarino.",
//       "Cuocere la pasta con le patate.",
//       "Mantecare con parmigiano."
//     ]
//   },
//   {
//     "id": 4,
//     "name": "Parmigiana di melanzane",
//     "ingredients": [
//       "600g melanzane",
//       "300g mozzarella",
//       "200g pomodoro",
//       "100g parmigiano",
//       "basilico"
//     ],
//     "type": "vegetable",
//     "season": "summer",
//     "prepTime": 45,
//     "instructions": [
//       "Friggere le melanzane a fette.",
//       "Alternare strati di melanzane, pomodoro, mozzarella e parmigiano.",
//       "Infornare a 180°C per 30 minuti.",
//       "Servire con basilico fresco."
//     ]
//   },
//   {
//     "id": 5,
//     "name": "Pasta e fagioli",
//     "ingredients": [
//       "300g pasta mista",
//       "400g fagioli borlotti",
//       "100g pancetta",
//       "1 cipolla",
//       "rosmarino"
//     ],
//     "type": "pasta",
//     "season": "winter",
//     "prepTime": 40,
//     "instructions": [
//       "Soffriggere cipolla e pancetta.",
//       "Aggiungere fagioli e rosmarino, cuocere per 15 minuti.",
//       "Unire la pasta e cuocere insieme.",
//       "Servire con un filo d'olio."
//     ]
//   },
//   {
//     "id": 6,
//     "name": "Friarielli e salsiccia",
//     "ingredients": [
//       "500g friarielli",
//       "300g salsiccia",
//       "2 spicchi d'aglio",
//       "peperoncino"
//     ],
//     "type": "meat",
//     "season": "winter",
//     "prepTime": 25,
//     "instructions": [
//       "Saltare i friarielli con aglio e peperoncino.",
//       "In una padella separata, cuocere la salsiccia.",
//       "Unire friarielli e salsiccia.",
//       "Servire caldo."
//     ]
//   },
//   {
//     "id": 7,
//     "name": "Pasta alla Genovese",
//     "ingredients": [
//       "350g pasta",
//       "500g cipolle",
//       "300g carne di manzo",
//       "50g parmigiano"
//     ],
//     "type": "pasta",
//     "season": "all",
//     "prepTime": 40,
//     "instructions": [
//       "Soffriggere le cipolle a fuoco lento per 30 minuti.",
//       "Aggiungere la carne a cubetti e cuocere.",
//       "Cuocere la pasta e unirla al sugo.",
//       "Servire con parmigiano."
//     ]
//   },
//   {
//     "id": 8,
//     "name": "Polpette al sugo",
//     "ingredients": [
//       "400g carne macinata",
//       "100g pane raffermo",
//       "50g parmigiano",
//       "2 uova",
//       "300g pomodoro"
//     ],
//     "type": "meat",
//     "season": "all",
//     "prepTime": 35,
//     "instructions": [
//       "Preparare le polpette con carne, pane, uova e parmigiano.",
//       "Friggere le polpette.",
//       "Cuocere in salsa di pomodoro per 15 minuti.",
//       "Servire caldo."
//     ]
//   },
//   {
//     "id": 9,
//     "name": "Pasta e ceci",
//     "ingredients": [
//       "300g pasta corta",
//       "400g ceci",
//       "1 cipolla",
//       "rosmarino",
//       "50g pancetta"
//     ],
//     "type": "pasta",
//     "season": "autumn",
//     "prepTime": 30,
//     "instructions": [
//       "Soffriggere cipolla e pancetta.",
//       "Aggiungere ceci e rosmarino, cuocere per 10 minuti.",
//       "Cuocere la pasta e unirla ai ceci.",
//       "Servire con un filo d'olio."
//     ]
//   },
//   {
//     "id": 10,
//     "name": "Pasta alla Nerano",
//     "ingredients": [
//       "350g spaghetti",
//       "500g zucchine",
//       "100g provolone del Monaco",
//       "basilico",
//       "50g parmigiano"
//     ],
//     "type": "pasta",
//     "season": "summer",
//     "prepTime": 25,
//     "instructions": [
//       "Friggere le zucchine a rondelle.",
//       "Cuocere la pasta e scolarla al dente.",
//       "Mantecare con zucchine, provolone e parmigiano.",
//       "Servire con basilico fresco."
//     ]
//   },
//   {
//     "id": 11,
//     "name": "Pasta e broccoli",
//     "ingredients": [
//       "350g pasta corta",
//       "500g broccoli",
//       "2 spicchi d'aglio",
//       "peperoncino",
//       "50g pecorino"
//     ],
//     "type": "pasta",
//     "season": "winter",
//     "prepTime": 25,
//     "instructions": [
//       "Lessare i broccoli in acqua salata.",
//       "In una padella, soffriggere aglio e peperoncino.",
//       "Unire i broccoli e schiacciarli leggermente.",
//       "Cuocere la pasta, unirla ai broccoli e mantecare con pecorino."
//     ]
//   },
//   {
//     "id": 12,
//     "name": "Pasta alla Siciliana",
//     "ingredients": [
//       "350g pasta lunga",
//       "300g melanzane",
//       "200g ricotta salata",
//       "300g pomodoro",
//       "basilico"
//     ],
//     "type": "pasta",
//     "season": "summer",
//     "prepTime": 30,
//     "instructions": [
//       "Friggere le melanzane a cubetti.",
//       "Preparare un sugo con pomodoro e basilico.",
//       "Cuocere la pasta e unirla al sugo.",
//       "Aggiungere le melanzane e la ricotta salata grattugiata."
//     ]
//   },
//   {
//     "id": 13,
//     "name": "Zuppa di lenticchie",
//     "ingredients": [
//       "400g lenticchie",
//       "1 cipolla",
//       "1 carota",
//       "1 costa di sedano",
//       "rosmarino"
//     ],
//     "type": "soup",
//     "season": "autumn",
//     "prepTime": 40,
//     "instructions": [
//       "Soffriggere cipolla, carota e sedano tritati.",
//       "Aggiungere le lenticchie e coprire con acqua.",
//       "Cuocere per 30 minuti con rosmarino.",
//       "Servire con crostini di pane."
//     ]
//   },
//   {
//     "id": 14,
//     "name": "Frittata di spaghetti",
//     "ingredients": [
//       "300g spaghetti avanzati",
//       "4 uova",
//       "100g parmigiano",
//       "prezzemolo",
//       "pepe nero"
//     ],
//     "type": "egg",
//     "season": "all",
//     "prepTime": 20,
//     "instructions": [
//       "Mescolare gli spaghetti con uova, parmigiano e prezzemolo.",
//       "Scaldare olio in una padella antiaderente.",
//       "Versare il composto e cuocere da entrambi i lati.",
//       "Servire calda o fredda."
//     ]
//   },
//   {
//     "id": 15,
//     "name": "Pasta con zucca e salsiccia",
//     "ingredients": [
//       "350g pasta corta",
//       "400g zucca",
//       "200g salsiccia",
//       "1 cipolla",
//       "50g pecorino"
//     ],
//     "type": "pasta",
//     "season": "autumn",
//     "prepTime": 35,
//     "instructions": [
//       "Soffriggere la cipolla e aggiungere la salsiccia sbriciolata.",
//       "Unire la zucca a cubetti e cuocere fino a che si ammorbidisce.",
//       "Cuocere la pasta e unirla al condimento.",
//       "Mantecare con pecorino grattugiato."
//     ]
//   },
//   {
//     "id": 16,
//     "name": "Peperoni imbottiti",
//     "ingredients": [
//       "4 peperoni grandi",
//       "200g pane raffermo",
//       "100g olive nere",
//       "50g capperi",
//       "2 acciughe",
//       "prezzemolo"
//     ],
//     "type": "vegetable",
//     "season": "summer",
//     "prepTime": 45,
//     "instructions": [
//       "Tagliare i peperoni a metà e svuotarli.",
//       "Preparare un ripieno con pane ammollato, olive, capperi, acciughe e prezzemolo.",
//       "Farcire i peperoni con il ripieno.",
//       "Cuocere in forno a 180°C per 30 minuti."
//     ]
//   },
//   {
//     "id": 17,
//     "name": "Pasta alla carrettiera",
//     "ingredients": [
//       "350g spaghetti",
//       "4 spicchi d'aglio",
//       "peperoncino",
//       "prezzemolo",
//       "100g pecorino"
//     ],
//     "type": "pasta",
//     "season": "all",
//     "prepTime": 15,
//     "instructions": [
//       "Soffriggere aglio e peperoncino in olio abbondante.",
//       "Cuocere la pasta al dente.",
//       "Unire la pasta all'olio aromatizzato.",
//       "Aggiungere prezzemolo tritato e pecorino grattugiato."
//     ]
//   },
//   {
//     "id": 18,
//     "name": "Zucchine alla scapece",
//     "ingredients": [
//       "500g zucchine",
//       "2 spicchi d'aglio",
//       "menta fresca",
//       "aceto di vino bianco",
//       "peperoncino"
//     ],
//     "type": "vegetable",
//     "season": "summer",
//     "prepTime": 30,
//     "instructions": [
//       "Tagliare le zucchine a rondelle e friggerle.",
//       "Preparare una marinatura con aglio, menta, aceto e peperoncino.",
//       "Versare la marinatura sulle zucchine fritte.",
//       "Lasciar riposare per almeno 2 ore prima di servire."
//     ]
//   },
//   {
//     "id": 19,
//     "name": "Pasta con crema di peperoni",
//     "ingredients": [
//       "350g pasta corta",
//       "3 peperoni rossi",
//       "1 cipolla",
//       "50g ricotta",
//       "basilico"
//     ],
//     "type": "pasta",
//     "season": "summer",
//     "prepTime": 35,
//     "instructions": [
//       "Arrostire i peperoni in forno, pelarli e frullarli.",
//       "Soffriggere la cipolla e unirla alla crema di peperoni.",
//       "Cuocere la pasta e unirla alla crema.",
//       "Aggiungere ricotta e basilico fresco."
//     ]
//   },
//   {
//     "id": 20,
//     "name": "Frittata di cipolle",
//     "ingredients": [
//       "6 uova",
//       "3 cipolle grandi",
//       "50g parmigiano",
//       "prezzemolo",
//       "pepe nero"
//     ],
//     "type": "egg",
//     "season": "all",
//     "prepTime": 25,
//     "instructions": [
//       "Affettare e soffriggere le cipolle fino a doratura.",
//       "Sbattere le uova con parmigiano, prezzemolo e pepe.",
//       "Unire le cipolle alle uova e versare in padella.",
//       "Cuocere la frittata da entrambi i lati."
//     ]
//   },
//   {
//     "id": 21,
//     "name": "Pasta e piselli",
//     "ingredients": [
//       "350g pasta corta",
//       "400g piselli freschi o surgelati",
//       "1 cipolla",
//       "50g pancetta",
//       "50g parmigiano"
//     ],
//     "type": "pasta",
//     "season": "spring",
//     "prepTime": 25,
//     "instructions": [
//       "Soffriggere cipolla e pancetta.",
//       "Aggiungere i piselli e cuocere per 10 minuti.",
//       "Cuocere la pasta e unirla ai piselli.",
//       "Mantecare con parmigiano grattugiato."
//     ]
//   },
//   {
//     "id": 22,
//     "name": "Scarola imbottita",
//     "ingredients": [
//       "1 scarola grande",
//       "100g olive nere",
//       "50g capperi",
//       "50g uvetta",
//       "50g pinoli"
//     ],
//     "type": "vegetable",
//     "season": "winter",
//     "prepTime": 40,
//     "instructions": [
//       "Sbollentare la scarola e strizzarla bene.",
//       "Preparare un ripieno con olive, capperi, uvetta e pinoli.",
//       "Farcire la scarola con il ripieno e chiuderla.",
//       "Cuocere in padella con un filo d'olio per 20 minuti."
//     ]
//   },
//   {
//     "id": 23,
//     "name": "Pasta alla Lardiata",
//     "ingredients": [
//       "350g bucatini",
//       "150g lardo di Colonnata",
//       "2 uova",
//       "50g pecorino",
//       "pepe nero"
//     ],
//     "type": "pasta",
//     "season": "all",
//     "prepTime": 20,
//     "instructions": [
//       "Tagliare il lardo a dadini e farlo rosolare.",
//       "Sbattere le uova con pecorino e pepe.",
//       "Cuocere la pasta e unirla al lardo.",
//       "Aggiungere il composto di uova e mantecare fuori dal fuoco."
//     ]
//   },
//   {
//     "id": 24,
//     "name": "Caponata napoletana",
//     "ingredients": [
//       "2 melanzane",
//       "2 zucchine",
//       "2 peperoni",
//       "1 cipolla",
//       "200g pomodorini",
//       "50g olive nere",
//       "basilico"
//     ],
//     "type": "vegetable",
//     "season": "summer",
//     "prepTime": 40,
//     "instructions": [
//       "Tagliare tutte le verdure a cubetti.",
//       "Friggere separatamente melanzane, zucchine e peperoni.",
//       "Soffriggere la cipolla e aggiungere i pomodorini.",
//       "Unire tutte le verdure, le olive e cuocere per 10 minuti. Aggiungere basilico."
//     ]
//   },
//   {
//     "id": 25,
//     "name": "Pasta alla Crudaiola",
//     "ingredients": [
//       "350g pasta corta",
//       "300g pomodorini",
//       "150g mozzarella",
//       "basilico",
//       "origano"
//     ],
//     "type": "pasta",
//     "season": "summer",
//     "prepTime": 15,
//     "instructions": [
//       "Tagliare i pomodorini e la mozzarella a cubetti.",
//       "Condire con olio, sale, basilico e origano.",
//       "Cuocere la pasta e scolarla al dente.",
//       "Unire la pasta al condimento crudo e mescolare bene."
//     ]
//   },
//   {
//     "id": 26,
//     "name": "Frittata di asparagi",
//     "ingredients": [
//       "6 uova",
//       "300g asparagi",
//       "50g parmigiano",
//       "1 cipolla",
//       "prezzemolo"
//     ],
//     "type": "egg",
//     "season": "spring",
//     "prepTime": 30,
//     "instructions": [
//       "Pulire gli asparagi e tagliarli a pezzetti.",
//       "Soffriggere la cipolla e aggiungere gli asparagi.",
//       "Sbattere le uova con parmigiano e prezzemolo.",
//       "Unire gli asparagi alle uova e cuocere la frittata da entrambi i lati."
//     ]
//   },
//   {
//     "id": 27,
//     "name": "Zuppa di cipolle alla napoletana",
//     "ingredients": [
//       "500g cipolle",
//       "2 patate",
//       "1l brodo vegetale",
//       "100g pane raffermo",
//       "50g parmigiano"
//     ],
//     "type": "soup",
//     "season": "autumn",
//     "prepTime": 45,
//     "instructions": [
//       "Affettare le cipolle e le patate.",
//       "Soffriggere le cipolle, aggiungere le patate e il brodo.",
//       "Cuocere per 30 minuti, poi frullare.",
//       "Servire con crostini di pane e parmigiano grattugiato."
//     ]
//   },
//   {
//     "id": 28,
//     "name": "Pasta con pomodorini e ricotta",
//     "ingredients": [
//       "350g pasta corta",
//       "300g pomodorini",
//       "200g ricotta fresca",
//       "basilico",
//       "50g pecorino"
//     ],
//     "type": "pasta",
//     "season": "summer",
//     "prepTime": 20,
//     "instructions": [
//       "Cuocere i pomodorini in padella con olio e basilico.",
//       "Cuocere la pasta e scolarla al dente.",
//       "Unire la pasta ai pomodorini.",
//       "Aggiungere la ricotta a fiocchetti e il pecorino grattugiato."
//     ]
//   },
//   {
//     "id": 29,
//     "name": "Zucca al forno",
//     "ingredients": [
//       "800g zucca",
//       "2 spicchi d'aglio",
//       "rosmarino",
//       "50g parmigiano",
//       "pangrattato"
//     ],
//     "type": "vegetable",
//     "season": "autumn",
//     "prepTime": 35,
//     "instructions": [
//       "Tagliare la zucca a fette spesse.",
//       "Disporre le fette su una teglia con aglio e rosmarino.",
//       "Cospargere con parmigiano e pangrattato.",
//       "Cuocere in forno a 180°C per 25-30 minuti."
//     ]
//   },
//   {
//     "id": 30,
//     "name": "Pasta patate e provola",
//     "ingredients": [
//       "350g pasta mista",
//       "400g patate",
//       "200g provola",
//       "1 cipolla",
//       "50g pancetta"
//     ],
//     "type": "pasta",
//     "season": "winter",
//     "prepTime": 35,
//     "instructions": [
//       "Soffriggere cipolla e pancetta.",
//       "Aggiungere le patate a cubetti e cuocere per 10 minuti.",
//       "Unire la pasta e cuocere insieme alle patate.",
//       "A fine cottura, aggiungere la provola a cubetti e mantecare."
//     ]
//   },
//   {
//     "id": 31,
//     "name": "Pasta e cavolo",
//     "ingredients": [
//       "350g pasta corta",
//       "500g cavolo nero",
//       "2 spicchi d'aglio",
//       "peperoncino",
//       "50g pecorino"
//     ],
//     "type": "pasta",
//     "season": "winter",
//     "prepTime": 30,
//     "instructions": [
//       "Lessare il cavolo nero in acqua salata.",
//       "Soffriggere aglio e peperoncino in olio.",
//       "Unire il cavolo scolato e tritato grossolanamente.",
//       "Cuocere la pasta, unirla al cavolo e mantecare con pecorino."
//     ]
//   },
//   {
//     "id": 32,
//     "name": "Frittata di cipolle e patate",
//     "ingredients": [
//       "6 uova",
//       "2 cipolle",
//       "2 patate medie",
//       "50g parmigiano",
//       "prezzemolo"
//     ],
//     "type": "egg",
//     "season": "all",
//     "prepTime": 35,
//     "instructions": [
//       "Tagliare cipolle e patate a fettine sottili.",
//       "Soffriggere cipolle e patate fino a doratura.",
//       "Sbattere le uova con parmigiano e prezzemolo.",
//       "Unire le verdure alle uova e cuocere la frittata da entrambi i lati."
//     ]
//   },
//   {
//     "id": 33,
//     "name": "Pasta alla Norcina napoletana",
//     "ingredients": [
//       "350g pasta corta",
//       "300g salsiccia",
//       "200g ricotta",
//       "50g pecorino",
//       "pepe nero"
//     ],
//     "type": "pasta",
//     "season": "all",
//     "prepTime": 25,
//     "instructions": [
//       "Sgranare la salsiccia e rosolarla in padella.",
//       "Mescolare la ricotta con pecorino e pepe.",
//       "Cuocere la pasta e unirla alla salsiccia.",
//       "Aggiungere la crema di ricotta e mantecare fuori dal fuoco."
//     ]
//   },
//   {
//     "id": 34,
//     "name": "Peperoni ripieni di riso",
//     "ingredients": [
//       "4 peperoni grandi",
//       "300g riso",
//       "200g pomodorini",
//       "1 cipolla",
//       "50g parmigiano",
//       "basilico"
//     ],
//     "type": "vegetable",
//     "season": "summer",
//     "prepTime": 45,
//     "instructions": [
//       "Cuocere il riso e condirlo con pomodorini, cipolla e basilico.",
//       "Svuotare i peperoni e riempirli con il riso condito.",
//       "Cospargere con parmigiano grattugiato.",
//       "Cuocere in forno a 180°C per 30 minuti."
//     ]
//   },
//   {
//     "id": 35,
//     "name": "Pasta con crema di zucchine",
//     "ingredients": [
//       "350g pasta lunga",
//       "500g zucchine",
//       "1 cipolla",
//       "50g parmigiano",
//       "menta fresca"
//     ],
//     "type": "pasta",
//     "season": "summer",
//     "prepTime": 25,
//     "instructions": [
//       "Soffriggere la cipolla e aggiungere le zucchine a rondelle.",
//       "Cuocere le zucchine e frullarle con parmigiano e menta.",
//       "Cuocere la pasta e unirla alla crema di zucchine.",
//       "Servire con una spolverata di parmigiano."
//     ]
//   },
//   {
//     "id": 36,
//     "name": "Zuppa di fave",
//     "ingredients": [
//       "400g fave secche",
//       "1 cipolla",
//       "1 carota",
//       "1 costa di sedano",
//       "rosmarino"
//     ],
//     "type": "soup",
//     "season": "winter",
//     "prepTime": 40,
//     "instructions": [
//       "Ammollare le fave per una notte.",
//       "Soffriggere cipolla, carota e sedano tritati.",
//       "Aggiungere le fave e coprire con acqua.",
//       "Cuocere per 30 minuti, aggiungere rosmarino e servire con crostini."
//     ]
//   },
//   {
//     "id": 37,
//     "name": "Pasta alla Checca",
//     "ingredients": [
//       "350g pasta corta",
//       "400g pomodorini",
//       "200g mozzarella",
//       "basilico",
//       "2 spicchi d'aglio"
//     ],
//     "type": "pasta",
//     "season": "summer",
//     "prepTime": 15,
//     "instructions": [
//       "Tagliare pomodorini e mozzarella a cubetti.",
//       "Condire con olio, aglio schiacciato e basilico.",
//       "Cuocere la pasta e scolarla al dente.",
//       "Unire la pasta al condimento crudo e mescolare bene."
//     ]
//   },
//   {
//     "id": 38,
//     "name": "Carciofi alla napoletana",
//     "ingredients": [
//       "6 carciofi",
//       "2 spicchi d'aglio",
//       "prezzemolo",
//       "menta",
//       "50g pane grattugiato"
//     ],
//     "type": "vegetable",
//     "season": "spring",
//     "prepTime": 40,
//     "instructions": [
//       "Pulire i carciofi e aprirli a fiore.",
//       "Preparare un ripieno con aglio, prezzemolo, menta e pane.",
//       "Farcire i carciofi con il ripieno.",
//       "Cuocere in padella con acqua e olio per 30 minuti."
//     ]
//   },
//   {
//     "id": 39,
//     "name": "Pasta alla Genovese vegetariana",
//     "ingredients": [
//       "350g pasta",
//       "500g cipolle",
//       "2 carote",
//       "2 coste di sedano",
//       "50g parmigiano"
//     ],
//     "type": "pasta",
//     "season": "all",
//     "prepTime": 45,
//     "instructions": [
//       "Tagliare finemente cipolle, carote e sedano.",
//       "Stufare le verdure a fuoco basso per 40 minuti.",
//       "Cuocere la pasta e unirla alle verdure.",
//       "Mantecare con parmigiano grattugiato."
//     ]
//   },
//   {
//     "id": 40,
//     "name": "Frittata di pasta",
//     "ingredients": [
//       "300g pasta avanzata",
//       "5 uova",
//       "100g parmigiano",
//       "prezzemolo",
//       "pepe nero"
//     ],
//     "type": "egg",
//     "season": "all",
//     "prepTime": 20,
//     "instructions": [
//       "Sbattere le uova con parmigiano, prezzemolo e pepe.",
//       "Unire la pasta avanzata alle uova.",
//       "Versare il composto in una padella antiaderente.",
//       "Cuocere la frittata da entrambi i lati fino a doratura."
//     ]
//   },
//   {
//     "id": 41,
//     "name": "Pasta alla puttanesca",
//     "ingredients": [
//       "350g spaghetti",
//       "200g pomodorini",
//       "100g olive nere",
//       "50g capperi",
//       "2 filetti di acciuga",
//       "peperoncino"
//     ],
//     "type": "pasta",
//     "season": "all",
//     "prepTime": 20,
//     "instructions": [
//       "Soffriggere aglio, peperoncino e acciughe.",
//       "Aggiungere pomodorini, olive e capperi.",
//       "Cuocere la pasta e unirla al condimento.",
//       "Servire con prezzemolo tritato."
//     ]
//   },
//   {
//     "id": 42,
//     "name": "Zucchine alla scapece",
//     "ingredients": [
//       "500g zucchine",
//       "2 spicchi d'aglio",
//       "menta fresca",
//       "aceto di vino bianco",
//       "peperoncino"
//     ],
//     "type": "vegetable",
//     "season": "summer",
//     "prepTime": 30,
//     "instructions": [
//       "Tagliare le zucchine a rondelle e friggerle.",
//       "Preparare una marinatura con aglio, menta, aceto e peperoncino.",
//       "Versare la marinatura sulle zucchine fritte.",
//       "Lasciar riposare per almeno 2 ore prima di servire."
//     ]
//   },
//   {
//     "id": 43,
//     "name": "Pasta e lenticchie",
//     "ingredients": [
//       "300g pasta corta",
//       "250g lenticchie",
//       "1 cipolla",
//       "1 carota",
//       "1 costa di sedano",
//       "rosmarino"
//     ],
//     "type": "pasta",
//     "season": "autumn",
//     "prepTime": 35,
//     "instructions": [
//       "Soffriggere cipolla, carota e sedano tritati.",
//       "Aggiungere le lenticchie e coprire con acqua.",
//       "Cuocere per 20 minuti, poi aggiungere la pasta.",
//       "Servire con un filo d'olio e rosmarino fresco."
//     ]
//   },
//   {
//     "id": 44,
//     "name": "Frittata di cipolle e peperoni",
//     "ingredients": [
//       "6 uova",
//       "2 cipolle",
//       "2 peperoni",
//       "50g parmigiano",
//       "prezzemolo"
//     ],
//     "type": "egg",
//     "season": "summer",
//     "prepTime": 30,
//     "instructions": [
//       "Tagliare cipolle e peperoni a fettine e soffriggerli.",
//       "Sbattere le uova con parmigiano e prezzemolo.",
//       "Unire le verdure alle uova.",
//       "Cuocere la frittata da entrambi i lati fino a doratura."
//     ]
//   },
//   {
//     "id": 45,
//     "name": "Pasta con crema di melanzane",
//     "ingredients": [
//       "350g pasta corta",
//       "2 melanzane",
//       "1 cipolla",
//       "50g ricotta salata",
//       "basilico"
//     ],
//     "type": "pasta",
//     "season": "summer",
//     "prepTime": 30,
//     "instructions": [
//       "Arrostire le melanzane in forno, pelarle e frullarle.",
//       "Soffriggere la cipolla e unirla alla crema di melanzane.",
//       "Cuocere la pasta e unirla alla crema.",
//       "Servire con ricotta salata grattugiata e basilico."
//     ]
//   },
//   {
//     "id": 46,
//     "name": "Zuppa di ceci",
//     "ingredients": [
//       "400g ceci",
//       "1 cipolla",
//       "1 carota",
//       "1 costa di sedano",
//       "rosmarino"
//     ],
//     "type": "soup",
//     "season": "winter",
//     "prepTime": 40,
//     "instructions": [
//       "Ammollare i ceci per una notte.",
//       "Soffriggere cipolla, carota e sedano tritati.",
//       "Aggiungere i ceci e coprire con acqua.",
//       "Cuocere per 30 minuti, aggiungere rosmarino e servire con crostini."
//     ]
//   },
//   {
//     "id": 47,
//     "name": "Pasta alla Sorrentina",
//     "ingredients": [
//       "350g pasta corta",
//       "400g pomodoro",
//       "200g mozzarella",
//       "basilico",
//       "50g parmigiano"
//     ],
//     "type": "pasta",
//     "season": "summer",
//     "prepTime": 35,
//     "instructions": [
//       "Preparare un sugo di pomodoro con basilico.",
//       "Cuocere la pasta al dente.",
//       "In una pirofila, alternare strati di pasta, sugo e mozzarella.",
//       "Cospargere con parmigiano e gratinare in forno per 10 minuti."
//     ]
//   },
//   {
//     "id": 48,
//     "name": "Peperoni in padella",
//     "ingredients": [
//       "4 peperoni misti",
//       "2 spicchi d'aglio",
//       "origano",
//       "aceto balsamico"
//     ],
//     "type": "vegetable",
//     "season": "summer",
//     "prepTime": 25,
//     "instructions": [
//       "Tagliare i peperoni a listarelle.",
//       "Soffriggere l'aglio in olio.",
//       "Aggiungere i peperoni e cuocere per 15 minuti.",
//       "Condire con origano e un goccio di aceto balsamico."
//     ]
//   },
//   {
//     "id": 49,
//     "name": "Pasta con crema di carciofi",
//     "ingredients": [
//       "350g pasta lunga",
//       "4 carciofi",
//       "1 cipolla",
//       "50g pecorino",
//       "menta fresca"
//     ],
//     "type": "pasta",
//     "season": "spring",
//     "prepTime": 35,
//     "instructions": [
//       "Pulire i carciofi e tagliarli a spicchi.",
//       "Soffriggere la cipolla e aggiungere i carciofi.",
//       "Cuocere i carciofi e frullarli con pecorino e menta.",
//       "Cuocere la pasta e unirla alla crema di carciofi."
//     ]
//   },
//   {
//     "id": 50,
//     "name": "Minestra maritata",
//     "ingredients": [
//       "300g scarola",
//       "300g bietole",
//       "200g carne di maiale",
//       "100g parmigiano",
//       "1 cipolla"
//     ],
//     "type": "soup",
//     "season": "winter",
//     "prepTime": 45,
//     "instructions": [
//       "Soffriggere la cipolla e rosolare la carne di maiale a pezzetti.",
//       "Aggiungere le verdure tagliate grossolanamente e coprire con brodo.",
//       "Cuocere per 30 minuti a fuoco medio.",
//       "Servire con parmigiano grattugiato."
//     ]
//   }
// ];

async function loadRecipes() {
  try {
    await Recipe.deleteMany({});
    await Recipe.insertMany(recipes);
    console.log('Recipes loaded successfully');
  } catch (error) {
    console.error('Error loading recipes:', error);
  } finally {
    mongoose.disconnect();
  }
}

loadRecipes();