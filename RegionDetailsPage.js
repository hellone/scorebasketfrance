import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const RegionDetailsPage = ({ route }) => {
  const navigation = useNavigation();
  const { regionId, regionName } = route.params;
  const [region, setRegion] = useState([]);
  const [loading, setLoading] = useState(true);

  const dataPost = new FormData();
  dataPost.append('type', 'championship');
  dataPost.append('id', regionId);

  useEffect(() => {

    const base64Credentials = "RkZCQkFwcDpVTXJBRXBnNWtNOE5SRUdsc0hvemNTb2ZvM0J4";

    console.log("parametre d'enrée : " + regionId);

    fetch('http://mobiles.ffbb.com/php/v1_0_5/leagueCompetitions.php', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
      },
      body: dataPost,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("DATA :   " + JSON.stringify(data));
        setRegion(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, [regionId]);

  const handleUserClick = (item) => {
    if (item.id.length === 4) {
      navigation.navigate('RegionDetails', { regionId: item.id, regionName: item.name });
    } else {
      navigation.navigate('ResultList', { idChamp : item.id });
    }

    console.log("région, championnat selectionné : " + JSON.stringify(item));
    //navigation.navigate('RegionDetails', { regionId: item.id, regionName: item.name });
    // Ajoutez votre logique ici pour gérer le clic de l'utilisateur sur un élément
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const sections = region.reduce((acc, item) => {
    const existingSection = acc.find(section => section.title === item.groupField);

    if (existingSection) {
      existingSection.data.push(item);
    } else {
      acc.push({
        title: item.groupField,
        data: [item],
      });
    }

    return acc;
  }, []);

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserClick(item)}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Icon name="chevron-right" size={20} color="#000" style={{ marginLeft: 'auto' }} />
            </View>
          </TouchableOpacity>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionText}>{title}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  sectionContainer: {
    padding: 10,
    backgroundColor: '#b3e0ff',
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionText: {
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
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
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginLeft: 15,
  },
});


export default RegionDetailsPage;
