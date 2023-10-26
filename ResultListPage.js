import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ResultListPage = ({ route }) => {
  const navigation = useNavigation();
  const { idChamp, idGroup, idSubCompetition } = route.params;
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [day, setDay] = useState(null);
  const [showDayPicker, setShowDayPicker] = useState(false);
  
  const base64Credentials = "RkZCQkFwcDpVTXJBRXBnNWtNOE5SRUdsc0hvemNTb2ZvM0J4";
  const displayMatchs = result.matchs && result.matchs.length > 0;
  const displayGroups = result.groups && result.groups.length > 0;
  const displaySubCompetitions = result.subCompetitions && result.subCompetitions.length > 0;
  
  const dataPost = new FormData();
  dataPost.append('id', idChamp);
  dataPost.append('group', idGroup);
  dataPost.append('subCompetition', idSubCompetition);
  dataPost.append('day', day);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios.post('http://mobiles.ffbb.com/php/v1_0_5/results.php', dataPost, {
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then(response => {
        setResult(response.data);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idChamp, idGroup, idSubCompetition, day]);

  const handleTeamClick = (team) => {
    Alert.alert(
      'Ajouter aux favoris',
      `Voulez-vous ajouter l'équipe ${team} à vos favoris?`,
      [
        {
          text: 'Non',
          onPress: () => console.log('Non cliqué'),
          style: 'cancel',
        },
        {
          text: 'Oui',
          onPress: () => {
            const championnatName = result.subCompetitions[0].name;
            const params = { team, idChamp, idGroup, idSubCompetition, championnatName };
            addToFavorites( params );
          },
        },
      ],
      { cancelable: false },
    );
  };

  const addToFavorites = async (params) => {
    try {
      // Récupérez la liste des favoris actuels
      const currentFavorites = JSON.parse(await AsyncStorage.getItem('Favorites')) || [];
      // Vérifiez si l'équipe est déjà présente dans les favoris
      const isTeamInFavorites = currentFavorites.some(favorite => favorite.team === params.team);
      // Si l'équipe n'est pas présente, ajoutez-la aux favoris
      if (!isTeamInFavorites) {
        const updatedFavorites = [...currentFavorites, params];
        await AsyncStorage.setItem('Favorites', JSON.stringify(updatedFavorites));
        console.log(`ajouté aux favoris  ` +  JSON.stringify(params));
      } else {
        console.log('L\'équipe est déjà dans les favoris');
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris: ", error);
    }
  };

  const handleUserClick = (item) => {
    const params = { idChamp: result.subCompetitions[0].id, idGroup: item.id, idSubCompetition };
    navigation.navigate('ResultList', params);
  };

  const handleSubCompetitionClick = (item) => {
    const params = { idChamp: result.subCompetitions[0].id, idSubCompetition: item.id };
    navigation.navigate('ResultList', params);
  };

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleUserClick(item)}
      style={styles.cardContainer}
    >
      <Text style={styles.itemText}>{item.name}</Text>
      <Icon name="chevron-right" size={24} color="#333" />
    </TouchableOpacity>
  );

  const renderMatchItem = ({ item }) => (
    <View style={styles.matchRow}>
      <TouchableOpacity onPress={() => handleTeamClick(item.hometeam)}>
        <Text style={styles.column}>{item.hometeam}</Text>
      </TouchableOpacity>
      <View style={styles.scoreColumn}>
        <Text style={styles.scoreText}>{item.score}</Text>
      </View>
      <TouchableOpacity onPress={() => handleTeamClick(item.visitorteam)}>
        <Text style={styles.column}>{item.visitorteam}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSubCompetitionItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSubCompetitionClick(item)}
      style={styles.cardContainer}
    >
      <Text style={styles.itemText}>{item.name}</Text>
      <Icon name="chevron-right" size={24} color="#333" />
    </TouchableOpacity>
  );

  const renderDayItem = ({ item }) => (
    <TouchableOpacity onPress={() => selectDay(item)}>
      <Text style={styles.dayItem}>{item}</Text>
    </TouchableOpacity>
  );

  const selectDay = (day) => {
    setDay(day);
    setShowDayPicker(false);
    console.log("Jour sélectionné: ", day);
  };

  const toggleDayPicker = () => {
    setShowDayPicker(!showDayPicker);
  };

  const days = Array.from({ length: 34 }, (_, i) => i + 1);

  if (loading) {
    return (
      <View>
        <Text>Chargement des données...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>Erreur lors du chargement des données: {error.message}</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={require('./assets/background.jpg')} style={styles.backgroundImage}>
    <View style={styles.container}>
      {displayMatchs && (
        <TouchableOpacity style={styles.dayButton} onPress={toggleDayPicker}>
          <Text style={styles.dayButtonText}>
            {day ? `Jour ${day}` : 'Derniers résultats'}
          </Text>
        </TouchableOpacity>
      )}
      {showDayPicker && (
        <FlatList
          data={days}
          renderItem={renderDayItem}
          keyExtractor={(item) => item.toString()}
        />
      )}
      <FlatList
        data={
          displayMatchs ? result.matchs :
          displayGroups ? result.groups :
          displaySubCompetitions ? result.subCompetitions :
          []
        }
        renderItem={
          displayMatchs ? renderMatchItem :
          displayGroups ? renderGroupItem :
          displaySubCompetitions ? renderSubCompetitionItem :
          () => null
        }
        keyExtractor={(item) => item.id || item.matchId.toString()}
      />
    </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backgroundImage: {
    flex: 1,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  chevron: {
    fontSize: 22,
    color: '#333',
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  column: {
    width: Dimensions.get('window').width / 3,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  scoreColumn: {
    width: Dimensions.get('window').width / 4,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  dayButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  dayItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#fff',
  },
});

export default ResultListPage;
