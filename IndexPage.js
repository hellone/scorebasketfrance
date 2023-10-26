import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const IndexPage = () => {
  const navigation = useNavigation();
  const [overlayVisible, setOverlayVisible] = useState(false);

  const options = [
    { title: 'Scores des équipes favoris', screen: 'FavoritesScores' },
    { title: 'Listes des championnats', screen: 'UserList' },
    { title: 'Recherche d\'une équipe', screen: 'SearchCity' },
    { title: 'Configuration', screen: 'FavoritesAdmin' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer} 
      onPress={() => navigation.navigate(item.screen)}
    >
      <Text style={styles.itemText}>{item.title}</Text>
      <TouchableOpacity onPress={() => console.log('Chevron Pressed')}>
        <Image source={require('./assets/chevron-right.png')} style={styles.chevron} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('./assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <FlatList
            data={options}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond semi-transparent noir
  },
  icon: {
    fontSize: 24,
    color: '#fff',
    position: 'absolute',
    top: 20,
    left: 20,
  },
  chevron: {
    width: 24,
    height: 24,
  },
  listContainer: {
    flex: 0.7,
    justifyContent: 'center', // Pour centrer la liste verticalement
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fond semi-transparent blanc
    borderRadius: 10,
  },
  itemText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default IndexPage;
