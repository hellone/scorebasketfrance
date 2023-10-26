import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, ImageBackground, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements'; 

const CityDetailPage = ({ route }) => {
  const { cityName, cityId } = route.params;
  const navigation = useNavigation();
  const [teams, setTeams] = useState([]);
  const base64Credentials = "RkZCQkFwcDpVTXJBRXBnNWtNOE5SRUdsc0hvemNTb2ZvM0J4";

  useEffect(() => {
    const getIdTowns = async () => {
      try {
        const formData = new FormData();
        formData.append('idCmne', cityId);

        const formData2 = new FormData();

        const response = await axios.post('http://mobiles.ffbb.com/webservices/v1/search_club.php', formData, {
          headers: {
            'Authorization': `Basic ${base64Credentials}`,
          },
        });

        const idTownHexa = response.data[0].id.toString(16);

        formData2.append('id', idTownHexa);

        const response2 = await axios.post('http://mobiles.ffbb.com/php/v1_0_5/club.php', formData2, {
          headers: {
            'Authorization': `Basic ${base64Credentials}`,
          },
        });

        const data2 = response2.data;

        if ("teams" in data2) {
          setTeams(data2.teams);
        }
      } catch (error) {
        console.error('There was an error fetching the data:', error);
      }
    };

    getIdTowns();
  }, []);

  const handleClick = (championnat) => {
    navigation.navigate('ResultList', { idChamp: championnat.id, idGroup: championnat.group, idSubCompetition : championnat.subCompetition});
  };

  if (Object.keys(teams).length === 0) {
    return (
      <ImageBackground source={require('./assets/background.jpg')} style={styles.backgroundImage}>
        <View style={styles.noTeamContainer}>
          <Text style={styles.noTeamText}>Il n'y a pas d'équipe pour cette ville.</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('./assets/background.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <FlatList
          data={teams}
          keyExtractor={item => item.id + item.subCompetition + item.group}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleClick(item)} style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Image source={require('./assets/chevron-right.png')} style={styles.chevron} />
          </TouchableOpacity>
          )}
        />
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
  },
  noTeamContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
    color: '#333', 
  },
  noTeamText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
  chevron: {
    width: 24,
    height: 24,
  },
});

export default CityDetailPage;
