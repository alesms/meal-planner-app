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
  // ... (il resto del tema rimane invariato)
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
  const [shoppingList, setShoppingList] = useState([]);
  const [openShoppingList, setOpenShoppingList] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ... (useEffect e altre funzioni rimangono invariate)

  const generateMealPlan = () => {
    const weekPlan = [];
    const usedRecipes = new Set(selectedRecipes.map(recipe => recipe._id));
    let currentDateCopy = new Date();
    const today = new Date();

    while (currentDateCopy.getDay() < 1 || currentDateCopy.getDay() > 4) {
      currentDateCopy.setDate(currentDateCopy.getDate() + 1);
    }

    while (weekPlan.length < 4) {
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
      currentDateCopy.setDate(currentDateCopy.getDate() + 1);
    }

    setMealPlan(weekPlan);
    setAvailableIngredients([]);
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

  const generateShoppingList = () => {
    const list = selectedRecipes.map(recipe => ({
      name: recipe.name,
      ingredients: recipe.ingredients.map(ing => `${ing} (per 3 persone)`),
      instructions: recipe.instructions
    }));
    setShoppingList(list);
    setOpenShoppingList(true);
  };



  const exportShoppingList = () => {
    let list = '';
    shoppingList.forEach(recipe => {
      list += `${recipe.name}:\n\nIngredienti:\n${recipe.ingredients.join('\n')}\n\nIstruzioni:\n${recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\n`;
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
      shoppingList.forEach(recipe => {
        text += `${recipe.name}:\n\nIngredienti:\n${recipe.ingredients.join('\n')}\n\nIstruzioni:\n${recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n')}\n\n`;
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
            {/* ... (il codice per gli ingredienti disponibili rimane invariato) */}

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
                            <Checkbox
                              checked={selectedRecipes.some(r => r._id === day.dinner._id)}
                              onChange={() => handleRecipeSelection(day.dinner)}
                            />
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
                {shoppingList.map((recipe, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{recipe.name}</Typography>
                    <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>Ingredienti:</Typography>
                    <List dense>
                      {recipe.ingredients.map((item, idx) => (
                        <ListItem key={idx}>
                          <ListItemText primary={item} />
                        </ListItem>
                      ))}
                    </List>
                    <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>Istruzioni:</Typography>
                    <List dense>
                      {recipe.instructions.map((step, idx) => (
                        <ListItem key={idx}>
                          <ListItemText primary={`${idx + 1}. ${step}`} />
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