import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, StyleSheet, Dimensions, FlatList, ImageBackground, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesScoresPage = () => {
  const [favorites, setFavorites] = useState([]);
  const base64Credentials = "RkZCQkFwcDpVTXJBRXBnNWtNOE5SRUdsc0hvemNTb2ZvM0J4";
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [day, setDay] = useState(null);
  const [showDayPicker, setShowDayPicker] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('Favorites')
      .then(favs => {
        const parsedFavorites = JSON.parse(favs);
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
        }
      });
  }, []);

  useEffect(() => {
    if (favorites.length > 0) {
      const promises = favorites.map(item => {
        const dataPost = new FormData();
        dataPost.append('id', item.idChamp);
        dataPost.append('group', item.idGroup);
        dataPost.append('subCompetition', item.idSubCompetition);
        dataPost.append('day', day);
        return axios.post(`http://mobiles.ffbb.com/php/v1_0_5/results.php`, dataPost, {
          headers: {
            'Authorization': `Basic ${base64Credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      });

      Promise.all(promises)
        .then(responses => {
          const dataArray = responses.map(response => response.data);
          const teamNames = favorites.map(fav => fav.team);

          const filteredMatchs = dataArray.reduce((acc, item) => {
            if (item.matchs) {
              const { id, name, type } = item.subCompetitions[0];
              const enrichedMatchs = item.matchs.map(match => ({ ...match, subCompetitionId: id, subCompetitionName: name, subCompetitionType: type }));
              const filtered = enrichedMatchs.filter(match => teamNames.includes(match.hometeam) || teamNames.includes(match.visitorteam));
              return acc.concat(filtered);
            } else {
              return acc;
            }
          }, []);

          const groupedMatchs = filteredMatchs.reduce((acc, match) => {
            const competitionName = match.subCompetitionName;
            const date = match.date;
            const key = `${competitionName}_${date}`;

            if (!acc[key]) {
              acc[key] = {
                competitionName,
                date,
                matches: [],
              };
            }

            acc[key].matches.push(match);
            return acc;
          }, {});

          const sections = Object.values(groupedMatchs).map(group => ({
            title: `${group.competitionName} - ${group.date}`,
            data: group.matches,
          }));

          setSections(sections);
        })
        .catch(error => {
          console.error('There was an error fetching the data:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [favorites, day]);

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeader}>{section.title}</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.matchRow}>
      <Text style={styles.column}>{item.hometeam}</Text>
      <Text style={styles.scoreColumn}>{item.score}</Text>
      <Text style={styles.column}>{item.visitorteam}</Text>
    </View>
  );

  const handleDayPickerToggle = () => {
    setShowDayPicker(!showDayPicker);
  };

  const handleDaySelect = (day) => {
    setDay(day);
    setShowDayPicker(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
  <ImageBackground source={require('./assets/background.jpg')} style={styles.backgroundImage}>
   <View style={styles.container}>
      <TouchableOpacity
        style={styles.dayPickerButton}
        onPress={handleDayPickerToggle}
      >
        <Text style={styles.dayPickerButtonText}>
          Choisir un jour ({day ? `Jour ${day}` : 'Non sélectionné'})
        </Text>
      </TouchableOpacity>
      {showDayPicker && (
        <FlatList
          data={Array.from({ length: 34 }, (_, i) => i + 1)}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleDaySelect(item)}>
              <Text style={styles.dayItem}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.matchId.toString()}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
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
  sectionHeaderContainer: {
    backgroundColor: '#f4f4f4',
    padding: 10,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayPickerButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPickerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dayItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#fff',
  },
});

export default FavoritesScoresPage;
