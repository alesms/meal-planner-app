import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, Chip, Card, CardContent,
  List, ListItem, ListItemText, Box, AppBar, Toolbar, Grid, Paper,
  Checkbox, Dialog, DialogTitle, DialogContent, DialogActions,
  useMediaQuery, IconButton, Collapse
} from '@mui/material';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { motion, AnimatePresence } from 'framer-motion';

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
    h4: {
      fontSize: '1.75rem',
      '@media (max-width:600px)': {
        fontSize: '1.2rem',
      },
    },
    h5: {
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1rem',
      },
    },
    h6: {
      fontSize: '1.25rem',
      '@media (max-width:600px)': {
        fontSize: '0.9rem',
      },
    },
    body1: {
      fontSize: '1rem',
      '@media (max-width:600px)': {
        fontSize: '0.85rem',
      },
    },
    body2: {
      fontSize: '0.875rem',
      '@media (max-width:600px)': {
        fontSize: '0.75rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            fontSize: '0.8rem',
            padding: '6px 12px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            height: '24px',
            fontSize: '0.7rem',
          },
        },
      },
    },
  },
});


const MotionCard = motion(Card);

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
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleExpandClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };


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
    if (recipes.length === 0) {
      setError("Non ci sono ricette disponibili. Riprova più tardi.");
      return;
    }

    setError(null);
    const weekPlan = [];
    const usedRecipes = new Set(selectedRecipes.map(recipe => recipe._id));
    let currentDateCopy = new Date(currentDate);

    // Assicuriamoci di iniziare dal lunedì della settimana corrente
    while (currentDateCopy.getDay() !== 1) {
      currentDateCopy.setDate(currentDateCopy.getDate() + 1);
    }

    for (let i = 0; i < 4; i++) {
      const dinner = getRandomRecipe(usedRecipes);
      if (dinner) {
        usedRecipes.add(dinner._id);
        const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
        weekPlan.push({
          day: days[currentDateCopy.getDay()],
          date: new Date(currentDateCopy),
          dinner
        });
      } else {
        setError("Non ci sono abbastanza ricette uniche per completare il piano. Riprova.");
        return;
      }
      currentDateCopy.setDate(currentDateCopy.getDate() + 1);
    }

    setMealPlan(weekPlan);
    setAvailableIngredients([]);
  };



  const getRandomRecipe = (usedRecipes) => {
    let availableRecipes = recipes.filter(recipe =>
      !usedRecipes.has(recipe._id) &&
      (recipe.season === currentSeason || recipe.season === 'all')
    );

    if (availableRecipes.length === 0) {
      // Se non ci sono ricette disponibili, includiamo tutte le ricette della stagione
      availableRecipes = recipes.filter(recipe =>
        recipe.season === currentSeason || recipe.season === 'all'
      );
    }

    if (availableIngredients.length > 0) {
      const recipesWithIngredients = availableRecipes.filter(recipe =>
        recipe.ingredients.some(ing =>
          availableIngredients.some(avail =>
            ing.toLowerCase().includes(avail.toLowerCase())
          )
        )
      );

      if (recipesWithIngredients.length > 0) {
        return recipesWithIngredients[Math.floor(Math.random() * recipesWithIngredients.length)];
      }
    }

    return availableRecipes.length > 0 ? availableRecipes[Math.floor(Math.random() * availableRecipes.length)] : null;
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

  const handleCloseShoppingList = () => {
    setOpenShoppingList(false);
    setShoppingList([]);
    setSelectedRecipes([]);
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
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}>
        <AppBar position="static" sx={{ backgroundColor: 'rgba(255, 111, 0, 0.9)', boxShadow: 'none' }}>
          <Toolbar sx={{ minHeight: isMobile ? '48px' : '64px' }}>
            <RestaurantMenuIcon sx={{ mr: 1, fontSize: isMobile ? '1.2rem' : '2rem' }} />
            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                fontSize: isMobile ? '1rem' : '1.5rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Pianificatore Cene Gourmet
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 2 : 4, px: isMobile ? 1 : 3 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '15px' }}>
              <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
                Ingredienti Disponibili
              </Typography>
              <Box sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'stretch' : 'center',
                mb: 2
              }}>
                <TextField
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  placeholder="Aggiungi un ingrediente"
                  variant="outlined"
                  size="small"
                  fullWidth={isMobile}
                  sx={{
                    mr: isMobile ? 0 : 2,
                    mb: isMobile ? 1 : 0,
                    flexGrow: isMobile ? 0 : 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '25px',
                      fontSize: isMobile ? '0.9rem' : '1rem'
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: isMobile ? '10px 14px' : '14px 14px',
                    }
                  }}
                />
                <Button
                  variant="contained"
                  onClick={addIngredient}
                  fullWidth={isMobile}
                  sx={{
                    bgcolor: theme.palette.secondary.main,
                    py: 1,
                    px: 3,
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    borderRadius: '25px',
                    minWidth: isMobile ? 'auto' : '120px'
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
                    sx={{
                      bgcolor: theme.palette.primary.light,
                      color: 'white',
                      mb: 1,
                      fontWeight: 500,
                      fontSize: isMobile ? '0.8rem' : '0.9rem'
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </motion.div>

          <Box sx={{ mt: 5, mb: 5, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={generateMealPlan}
              size="large"
              sx={{
                fontSize: '1.2rem',
                padding: '12px 40px',
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

          {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          {mealPlan.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: isMobile ? '1rem' : '2rem' }}>
                Piano Cene - {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)}
              </Typography>
              <Grid container spacing={2}>
                {mealPlan.map((day, index) => (
                  <Grid item xs={12} key={index}>
                    <Card
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '15px',
                        overflow: 'hidden'
                      }}
                    >
                      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6" sx={{ color: theme.palette.secondary.main, fontWeight: 'bold' }}>
                            {day.day} ({day.date.toLocaleDateString()})
                          </Typography>
                          <Box>
                            <Checkbox
                              checked={selectedRecipes.some(r => r._id === day.dinner._id)}
                              onChange={() => handleRecipeSelection(day.dinner)}
                              color="primary"
                              size={isMobile ? "small" : "medium"}
                            />
                            <IconButton onClick={() => regenerateRecipe(index)} color="primary" size={isMobile ? "small" : "medium"}>
                              <RefreshIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => handleExpandClick(index)}
                              sx={{
                                transform: expandedCard === index ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s',
                              }}
                              size={isMobile ? "small" : "medium"}
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Box>
                        </Box>
                        <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold', my: 1 }}>
                          {day.dinner.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666' }}>
                          <strong>Tempo:</strong> {day.dinner.prepTime} min
                        </Typography>
                        <Collapse in={expandedCard === index}>
                          <Box mt={2}>
                            <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                              <strong>Ingredienti (3 persone):</strong> {day.dinner.ingredients.join(", ")}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                              Istruzioni:
                            </Typography>
                            <List dense disablePadding>
                              {day.dinner.instructions.map((step, i) => (
                                <ListItem key={i} sx={{ pl: 0, py: 0.5 }}>
                                  <ListItemText
                                    primary={`${i + 1}. ${step}`}
                                    primaryTypographyProps={{
                                      sx: { fontSize: '0.8rem', lineHeight: 1.4 }
                                    }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        </Collapse>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 5, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={generateShoppingList}
                  startIcon={<ShoppingCartIcon />}
                  disabled={selectedRecipes.length === 0}
                  sx={{
                    fontSize: '1rem',
                    padding: '10px 30px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: '0 6px 10px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  Genera Lista della Spesa
                </Button>
              </Box>

              <Card sx={{ bgcolor: 'rgba(255, 249, 196, 0.9)', mt: 5, borderRadius: '15px' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold', mb: 2 }}>
                    Nota
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                    Questo piano si basa sulla stagione corrente ({currentSeason}) e include 4 giorni lavorativi a partire da lunedì.
                    Le ricette sono pensate per cene veloci da preparare dopo il lavoro, escludendo il weekend.
                    Gli ingredienti inseriti vengono considerati solo per la generazione del piano.
                    Si consiglia di preparare porzioni extra per il pranzo del giorno successivo.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}

          <Dialog
            open={openShoppingList}
            onClose={handleCloseShoppingList}
            PaperProps={{
              style: {
                borderRadius: '15px',
                padding: '20px',
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>Lista della Spesa</DialogTitle>
            <DialogContent>
              {shoppingList.map((recipe, index) => (
                <Box key={index} sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.secondary.main, mb: 2 }}>{recipe.name}</Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 'bold' }}>Ingredienti:</Typography>
                  <List dense>
                    {recipe.ingredients.map((item, idx) => (
                      <ListItem key={idx} sx={{ pl: 0 }}>
                        <ListItemText primary={item} primaryTypographyProps={{ sx: { fontSize: '0.9rem' } }} />
                      </ListItem>
                    ))}
                  </List>
                  <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>Istruzioni:</Typography>
                  <List dense>
                    {recipe.instructions.map((step, idx) => (
                      <ListItem key={idx} sx={{ pl: 0 }}>
                        <ListItemText primary={`${idx + 1}. ${step}`} primaryTypographyProps={{ sx: { fontSize: '0.9rem' } }} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </DialogContent>
            <DialogActions>
              <Button onClick={exportShoppingList} color="primary">Esporta</Button>
              <Button onClick={shareToPhone} color="primary">Invia al Telefono</Button>
              <Button onClick={handleCloseShoppingList} color="primary">Chiudi</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;