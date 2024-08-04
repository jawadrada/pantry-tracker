"use client"; // Add this line at the top of your file

import { Typography, Box, Stack, Button, TextField, Card, CardContent, CardActions, Snackbar, Alert, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { firestore } from "@/firebase";
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Add, Remove, Delete } from "@mui/icons-material";

function Home() {
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];

    docs.forEach((doc) => {
      inventoryList.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async () => {
    if (!itemName.trim()) {
      showSnackbar("Item name cannot be empty", "error");
      return;
    }

    const existingItem = inventory.find(item => item.name.toLowerCase() === itemName.toLowerCase());

    if (existingItem) {
      await updateDoc(doc(firestore, "pantry", existingItem.id), {
        count: existingItem.count + 1,
      });
      showSnackbar(`Increased count of ${itemName}`, "success");
    } else {
      await addDoc(collection(firestore, "pantry"), {
        name: itemName.toLowerCase(),
        count: 1,
      });
      showSnackbar(`Added ${itemName} to the pantry`, "success");
    }

    setItemName("");
    updateInventory();
  };

  const updateItemCount = async (id, newCount) => {
    if (newCount <= 0) {
      await deleteDoc(doc(firestore, "pantry", id));
      showSnackbar("Item removed from pantry", "success");
    } else {
      await updateDoc(doc(firestore, "pantry", id), {
        count: newCount,
      });
      showSnackbar("Updated item count", "success");
    }
    updateInventory();
  };

  const deleteItem = async (id) => {
      await deleteDoc(doc(firestore, "pantry", id));
      showSnackbar("Item removed from pantry", "success");
      
    updateInventory();
  }

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f5f5f5"
    >
      <Box border="1px solid #333" borderRadius="8px" boxShadow={3} p={3} bgcolor="#fff">
        <Box
          width="800px"
          height="100px"
          bgcolor="#1976d2"
          display="flex"
          justifyContent="center"
          alignItems="center"
          borderRadius="8px 8px 0 0"
        >
          <Typography variant="h2" color="#fff" textAlign="center">
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" maxHeight="400px" spacing={2} overflow="auto" p={2}>
          {inventory.map((item) => (
            <Card key={item.id} variant="outlined" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <CardContent>
                <Typography variant="h5" color="#333">
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}: {item.count}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton color="primary" onClick={() => updateItemCount(item.id, item.count + 1)}>
                  <Add />
                </IconButton>
                <IconButton color="primary" onClick={() => updateItemCount(item.id, item.count - 1)}>
                  <Remove />
                </IconButton>
                <IconButton color="secondary" onClick={() => deleteItem(item.id)}>
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Stack>
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <TextField
            label="Item Name"
            variant="outlined"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{ mr: 2, width: '300px' }}
          />
          <Button variant="contained" color="primary" onClick={addItem}>
            Add Item
          </Button>
        </Box>
      </Box>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Home;




