import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Modal, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Icon } from 'react-native-elements';

const FavoritesAdminPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Récupérez les favoris du AsyncStorage
    AsyncStorage.getItem('Favorites')
      .then(favs => {
        const parsedFavorites = JSON.parse(favs);
        console.log("XXXXXXXXXXXXX :  "  + JSON.stringify(parsedFavorites) );
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
        }
      });
  }, []);

  const handleDelete = async () => {
    const updatedFavorites = favorites.filter(fav => fav.idChamp !== selectedFavorite.idChamp || fav.team !== selectedFavorite.team);
    setFavorites(updatedFavorites);
    setIsModalVisible(false);
    await AsyncStorage.setItem('Favorites', JSON.stringify(updatedFavorites));
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    backgroundImage: {
      flex: 1,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#fff', // Couleur du texte
    },
    favoriteItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fond semi-transparent blanc
      borderRadius: 10,
    },
    favoriteText: {
      flex: 1,
      justifyContent: 'center',
      color: '#333', // Couleur du texte
    },
    teamText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#333', // Couleur du texte
    },
    championnatNameText: {
      fontSize: 14,
      color: '#333', // Couleur du texte
    },
    deleteButton: {
      color: 'red',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
    },
    modalText: {
      marginBottom: 20,
      fontSize: 16,
    },
  });

  return (
    <ImageBackground source={require('./assets/background.jpg')} style={styles.backgroundImage}>
    <View style={styles.container}>
      <Text style={styles.title}>Mes Favoris</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idChamp + item.team}
        renderItem={({ item }) => (
          <View style={styles.favoriteItem}>
            <View style={styles.favoriteText}>
              <Text style={styles.teamText}>{item.team}</Text>
              <Text style={styles.championnatNameText}>{item.championnatName}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setSelectedFavorite(item);
                setIsModalVisible(true);
              }}
            >
              <Icon name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modalText}>Voulez-vous supprimer ce favori ?</Text>
            <Button title="Annuler" onPress={() => setIsModalVisible(false)} />
            <Button title="Supprimer" onPress={handleDelete} />
          </View>
        </View>
      </Modal>
    </View>
    </ImageBackground>
  );
};

export default FavoritesAdminPage;
