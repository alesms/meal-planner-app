import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, Typography, TextField, Button, Chip, Card, CardContent, 
  List, ListItem, ListItemText, Box, AppBar, Toolbar, Grid, Paper,
  Checkbox, Dialog, DialogTitle, DialogContent, DialogActions,
  useMediaQuery, IconButton
} from '@mui/material';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useSpring, animated } from 'react-spring';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6f00',
    },
    secondary: {
      main: '#1e88e5',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
          transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
          '&:hover': {
            boxShadow: '0 7px 14px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.08)',
          },
        },
      },
    },
  },
});

const AnimatedCard = animated(Card);

function App() {
  const [recipes, setRecipes] = useState([]);
  const [mealPlan, setMealPlan] = useState([]);
  const [currentSeason, setCurrentSeason] = useState('');
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [newIngredient, setNewIngredient] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState({});
  const [openShoppingList, setOpenShoppingList] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('https://meal-planner-app-cmgk.onrender.com/api/recipes');
        setRecipes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const month = currentDate.getMonth();
    if (month >= 2 && month <= 4) setCurrentSeason('primavera');
    else if (month >= 5 && month <= 7) setCurrentSeason('estate');
    else if (month >= 8 && month <= 10) setCurrentSeason('autunno');
    else setCurrentSeason('inverno');

    const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    setCurrentDay(days[currentDate.getDay()]);
  }, [currentDate]);

  const addIngredient = () => {
    if (newIngredient && !availableIngredients.includes(newIngredient)) {
      setAvailableIngredients([...availableIngredients, newIngredient]);
      setNewIngredient('');
    }
  };

  const removeIngredient = (ingredient) => {
    setAvailableIngredients(availableIngredients.filter(i => i !== ingredient));
  };

  const generateMealPlan = () => {
    const weekPlan = [];
    const usedRecipes = new Set();
    let currentDateCopy = new Date(); // Data corrente
    const today = new Date(); // Salviamo la data di oggi per confronto

    // Troviamo il prossimo lunedì se non siamo già in un giorno valido (lun-gio)
    while (currentDateCopy.getDay() < 1 || currentDateCopy.getDay() > 4) {
      currentDateCopy.setDate(currentDateCopy.getDate() + 1);
    }

    while (weekPlan.length < 4) {  // Generiamo un piano per 4 giorni (lunedì a giovedì)
      const dayOfWeek = currentDateCopy.getDay();
      
      if (dayOfWeek >= 1 && dayOfWeek <= 4) {
        const isToday = currentDateCopy.toDateString() === today.toDateString();
        const dinner = getRandomRecipe(usedRecipes, isToday);
        
        if (dinner) {
          usedRecipes.add(dinner._id);

          const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
          weekPlan.push({ 
            day: `${days[dayOfWeek]}${isToday ? ' (oggi)' : ''}`,
            date: new Date(currentDateCopy),
            dinner 
          });
        }
      }

      // Passa al giorno successivo
      currentDateCopy.setDate(currentDateCopy.getDate() + 1);
    }

    setMealPlan(weekPlan);
    setSelectedRecipes([]); // Resetta le ricette selezionate
    setAvailableIngredients([]); // Resetta gli ingredienti disponibili
  };

  const getRandomRecipe = (usedRecipes, isToday) => {
    // Filtra le ricette per stagione e non ancora utilizzate
    let availableRecipes = recipes.filter(recipe => 
      !usedRecipes.has(recipe._id) &&
      (recipe.season === currentSeason || recipe.season === 'all')
    );

    // Se non ci sono ricette disponibili, resetta usedRecipes e riprova
    if (availableRecipes.length === 0) {
      usedRecipes.clear();
      availableRecipes = recipes.filter(recipe => 
        recipe.season === currentSeason || recipe.season === 'all'
      );
    }

    // Se è oggi e ci sono ingredienti disponibili, prova a trovare una ricetta che li usa
    if (isToday && availableIngredients.length > 0) {
      const recipesWithIngredients = availableRecipes.filter(recipe =>
        recipe.ingredients.some(ing => 
          availableIngredients.some(avail => 
            ing.toLowerCase().includes(avail.toLowerCase())
          )
        )
      );

      // Se troviamo ricette con gli ingredienti disponibili, scegliamo tra queste
      if (recipesWithIngredients.length > 0) {
        return recipesWithIngredients[Math.floor(Math.random() * recipesWithIngredients.length)];
      }
    }

    // Altrimenti, scegliamo una ricetta casuale tra quelle disponibili
    return availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
  };

  const handleRecipeSelection = (recipe) => {
    setSelectedRecipes(prev => {
      const isSelected = prev.some(r => r._id === recipe._id);
      if (isSelected) {
        return prev.filter(r => r._id !== recipe._id);
      } else {
        return [...prev, recipe];
      }
    });
  };

  const regenerateRecipe = (index) => {
    const newMealPlan = [...mealPlan];
    const usedRecipes = new Set(mealPlan.map(day => day.dinner._id));
    const newRecipe = getRandomRecipe(usedRecipes, false);
    if (newRecipe) {
      newMealPlan[index] = {
        ...newMealPlan[index],
        dinner: newRecipe
      };
      setMealPlan(newMealPlan);
    }
  };

  const generateShoppingList = () => {
    const list = {};
    selectedRecipes.forEach(recipe => {
      list[recipe.name] = recipe.ingredients.map(ing => `${ing} (per 3 persone)`);
    });
    setShoppingList(list);
    setOpenShoppingList(true);
  };

  const exportShoppingList = () => {
    let list = '';
    Object.entries(shoppingList).forEach(([recipeName, ingredients]) => {
      list += `${recipeName}:\n${ingredients.join('\n')}\n\n`;
    });
    const blob = new Blob([list], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shopping_list.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareToPhone = () => {
    if (navigator.share) {
      let text = '';
      Object.entries(shoppingList).forEach(([recipeName, ingredients]) => {
        text += `${recipeName}:\n${ingredients.join('\n')}\n\n`;
      });
      navigator.share({
        title: 'La mia lista della spesa',
        text: text,
      }).catch(console.error);
    } else {
      alert("La condivisione non è supportata su questo dispositivo. Prova ad esportare la lista invece.");
    }
  };

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 1000 },
  });

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        }}
      >
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', fontSize: isMobile ? '1.5rem' : '2.125rem' }}>
          Caricamento...
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh',
        backgroundImage: `url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}>
        <AppBar position="static" sx={{ backgroundColor: 'rgba(255, 111, 0, 0.8)' }}>
          <Toolbar>
            <RestaurantMenuIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', fontSize: isMobile ? '1rem' : '1.25rem' }}>
              Pianificatore Cene
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, px: isMobile ? 2 : 3 }}>
          <animated.div style={fadeIn}>
            <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold', fontSize: isMobile ? '1.5rem' : '2.125rem' }}>
                Ingredienti disponibili per oggi ({currentDay}, {currentDate.toLocaleDateString()})
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', mb: 2 }}>
                <TextField
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Aggiungi un ingrediente"
                  variant="outlined"
                  size="small"
                  sx={{ mr: isMobile ? 0 : 2, mb: isMobile ? 2 : 0, flexGrow: 1, width: isMobile ? '100%' : 'auto' }}
                />
                <Button 
                  variant="contained" 
                  onClick={addIngredient} 
                  sx={{ 
                    bgcolor: theme.palette.secondary.main,
                    width: isMobile ? '100%' : 'auto'
                  }}
                >
                  Aggiungi
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availableIngredients.map((ingredient, index) => (
                  <Chip 
                    key={index} 
                    label={ingredient} 
                    onDelete={() => removeIngredient(ingredient)} 
                    sx={{ bgcolor: theme.palette.primary.light, color: 'white', mb: 1 }}
                  />
                ))}
              </Box>
            </Paper>

            <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={generateMealPlan} 
                size="large"
                sx={{ 
                  fontSize: isMobile ? '1rem' : '1.2rem', 
                  padding: isMobile ? '8px 16px' : '10px 30px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
                  '&:hover': {
                    boxShadow: '0 7px 14px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.08)',
                  },
                  width: isMobile ? '100%' : 'auto'
                }}
              >
                Genera Piano Cene
              </Button>
            </Box>

            {mealPlan.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold', fontSize: isMobile ? '1.5rem' : '2.125rem' }}>
                  Piano Cene ({currentSeason})
                </Typography>
                <Grid container spacing={3}>
                  {mealPlan.map((day, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <AnimatedCard 
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                        }}
                      >
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" gutterBottom sx={{ color: theme.palette.secondary.main, fontWeight: 'bold', fontSize: isMobile ? '1rem' : '1.25rem' }}>
                              {day.day} ({day.date.toLocaleDateString()})
                            </Typography>
                            <Box>
                              <Checkbox
                                checked={selectedRecipes.some(r => r._id === day.dinner._id)}
                                onChange={() => handleRecipeSelection(day.dinner)}
                              />
                              <IconButton onClick={() => regenerateRecipe(index)}>
                                <RefreshIcon />
                              </IconButton>
                            </Box>
                          </Box>
                          <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 'bold', fontSize: isMobile ? '1.25rem' : '1.5rem' }}>
                            {day.dinner.name}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Tempo di preparazione:</strong> {day.dinner.prepTime} minuti
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Ingredienti (per 3 persone):</strong> {day.dinner.ingredients.join(", ")}
                          </Typography>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                            Istruzioni:
                          </Typography>
                          <List dense={isMobile}>
                            {day.dinner.instructions.map((step, i) => (
                              <ListItem key={i}>
                                <ListItemText primary={`${i + 1}. ${step}`} />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </AnimatedCard>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={generateShoppingList}
                    startIcon={<ShoppingCartIcon />}
                    disabled={selectedRecipes.length === 0}
                    sx={{
                      fontSize: isMobile ? '0.9rem' : '1rem',
                      padding: isMobile ? '6px 12px' : '8px 16px',
                    }}
                  >
                    Genera Lista della Spesa
                  </Button>
                </Box>

                <Card sx={{ bgcolor: 'rgba(255, 249, 196, 0.9)', mt: 4 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold', fontSize: isMobile ? '1rem' : '1.25rem' }}>
                      Nota
                    </Typography>
                    <Typography variant="body2">
                      Questo piano si basa sulla stagione corrente ({currentSeason}) e include 4 giorni lavorativi a partire da lunedì. 
                      Le ricette sono pensate per cene veloci da preparare dopo il lavoro, escludendo il weekend. 
                      Gli ingredienti inseriti vengono considerati solo per la generazione del piano.
                      Si consiglia di preparare porzioni extra per il pranzo del giorno successivo.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}

            <Dialog open={openShoppingList} onClose={() => setOpenShoppingList(false)}>
              <DialogTitle>Lista della Spesa</DialogTitle>
              <DialogContent>
                {Object.entries(shoppingList).map(([recipeName, ingredients]) => (
                  <Box key={recipeName} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{recipeName}</Typography>
                    <List dense>
                      {ingredients.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </DialogContent>
              <DialogActions>
                <Button onClick={exportShoppingList}>Esporta</Button>
                <Button onClick={shareToPhone}>Invia al Telefono</Button>
                <Button onClick={() => setOpenShoppingList(false)}>Chiudi</Button>
              </DialogActions>
            </Dialog>
          </animated.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;