import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Container, Typography, TextField, Button, Chip, Card, CardContent, 
  List, ListItem, ListItemText, Box, AppBar, Toolbar, Grid, Paper
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
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

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5100/api/recipes');
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
    let currentDateCopy = new Date(currentDate);

    for (let i = 0; i < 4; i++) {
      while (currentDateCopy.getDay() === 5 || currentDateCopy.getDay() === 6) {
        currentDateCopy.setDate(currentDateCopy.getDate() + 1);
      }

      const isToday = i === 0;
      const dinner = getRandomRecipe(usedRecipes, isToday);
      if (dinner) {
        usedRecipes.add(dinner._id);

        const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
        weekPlan.push({ 
          day: days[currentDateCopy.getDay()], 
          date: new Date(currentDateCopy),
          dinner 
        });
      }

      currentDateCopy.setDate(currentDateCopy.getDate() + 1);
    }

    setMealPlan(weekPlan);
    setAvailableIngredients([]);
  };

  const getRandomRecipe = (usedRecipes, isToday) => {
    let availableRecipes = recipes.filter(recipe => 
      !usedRecipes.has(recipe._id) &&
      (recipe.season === currentSeason || recipe.season === 'all')
    );

    if (isToday && availableIngredients.length > 0) {
      availableRecipes = availableRecipes.sort((a, b) => {
        const aMatches = a.ingredients.filter(ing => 
          availableIngredients.some(avail => ing.toLowerCase().includes(avail.toLowerCase()))
        ).length;
        const bMatches = b.ingredients.filter(ing => 
          availableIngredients.some(avail => ing.toLowerCase().includes(avail.toLowerCase()))
        ).length;
        return bMatches - aMatches;
      });
    }

    if (availableRecipes.length === 0) {
      return recipes.find(recipe => !usedRecipes.has(recipe._id));
    }

    return availableRecipes[0];
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
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Pianificatore Cene
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <animated.div style={fadeIn}>
            <Paper elevation={3} sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                Ingredienti disponibili per oggi ({currentDay}, {currentDate.toLocaleDateString()})
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Aggiungi un ingrediente"
                  variant="outlined"
                  size="small"
                  sx={{ mr: 2, flexGrow: 1 }}
                />
                <Button variant="contained" onClick={addIngredient} sx={{ bgcolor: theme.palette.secondary.main }}>
                  Aggiungi
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {availableIngredients.map((ingredient, index) => (
                  <Chip 
                    key={index} 
                    label={ingredient} 
                    onDelete={() => removeIngredient(ingredient)} 
                    sx={{ bgcolor: theme.palette.primary.light, color: 'white' }}
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
                  fontSize: '1.2rem', 
                  padding: '10px 30px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
                  '&:hover': {
                    boxShadow: '0 7px 14px rgba(0,0,0,0.1), 0 3px 6px rgba(0,0,0,0.08)',
                  },
                }}
              >
                Genera Piano Cene
              </Button>
            </Box>

            {mealPlan.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
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
                          <Typography variant="h6" gutterBottom sx={{ color: theme.palette.secondary.main, fontWeight: 'bold' }}>
                            {day.day} ({day.date.toLocaleDateString()})
                            {index === 0 && " - Oggi"}
                          </Typography>
                          <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                            {day.dinner.name}
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Tempo di preparazione:</strong> {day.dinner.prepTime} minuti
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Ingredienti:</strong> {day.dinner.ingredients.join(", ")}
                          </Typography>
                          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                            Istruzioni:
                          </Typography>
                          <List>
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

                {/* Nota che appare solo dopo la generazione del piano pasti */}
                <Card sx={{ bgcolor: 'rgba(255, 249, 196, 0.9)', mt: 4 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                      Nota
                    </Typography>
                    <Typography variant="body2">
                      Questo piano si basa sulla stagione corrente ({currentSeason}) e parte dal giorno odierno. 
                      Le ricette sono pensate per cene veloci da preparare dopo il lavoro, escludendo il weekend. 
                      Gli ingredienti inseriti vengono considerati solo per la cena di oggi. 
                      Si consiglia di preparare porzioni extra per il pranzo del giorno successivo.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}
          </animated.div>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;