import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const SearchCityPage = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const base64Credentials = "RkZCQkFwcDpVTXJBRXBnNWtNOE5SRUdsc0hvemNTb2ZvM0J4";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = new FormData();
        formData.append('name', query);

        const response = await axios.post('http://mobiles.ffbb.com/webservices/v1/communes.php', formData, {
          headers: {
            'Authorization': `Basic ${base64Credentials}`,
          },
        });

        setCities(response.data);
      } catch (error) {
        console.error('There was an error fetching the data:', error);
      }
    };

    if (query.length > 2) {
      fetchData();
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [query]);

  const handleCitySelect = (city) => {
    setQuery(city.libelle);
    setShowResults(false);
    navigation.navigate('CityDetail', { cityName: city.libelle,  cityId: city.id});
  };

  return (
    <ImageBackground source={require('./assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Rechercher une ville par nom ou code postal"
          placeholderTextColor="#7f8c8d" // Couleur grise pour le placeholder
          value={query}
          onChangeText={setQuery}
        />
        {showResults && (
          <FlatList
            style={styles.list}
            data={cities}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleCitySelect(item)}>
                <Text style={styles.city}>{item.libelle}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backgroundImage: {
    flex: 1,
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 5, // Bordures arrondies
  },
  list: {
    maxHeight: 200,
  },
  city: {
    padding: 15,
    fontSize: 18,
    backgroundColor: '#ecf0f1', // Fond légèrement gris
    borderRadius: 5, // Bordures arrondies
    marginBottom: 5, // Espacement entre les éléments de la liste
    shadowColor: '#000', // Ombre noire
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
});

export default SearchCityPage;
