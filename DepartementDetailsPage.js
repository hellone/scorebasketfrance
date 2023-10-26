import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, StyleSheet, TouchableOpacity  } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const DepartementDetailsPage = ({ route }) => {
  const navigation = useNavigation();
  const { departementId, departementName } = route.params;
  const [region, setRegion] = useState([]);
  const [loading, setLoading] = useState(true);

  const dataPost = new FormData();
  dataPost.append('type', 'championship');
  dataPost.append('id', departementId);

  useEffect(() => {

    const base64Credentials = "RkZCQkFwcDpVTXJBRXBnNWtNOE5SRUdsc0hvemNTb2ZvM0J4";



    console.log("parametre d'enrée : " + departementId);

    fetch('http://mobiles.ffbb.com/php/v1_0_5/areaCompetitions.php', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${base64Credentials}`,
          'Content-Type': 'application/json',
        },
        body: dataPost,
      })
        .then(response => response.json())
        .then(data => {
          console.log("DATA :   " + JSON.stringify(data));

          setRegion(data);
          setLoading(false);
        });
    }, []);

  const handleUserClick = (item) => {
    console.log("departement détail selectionné : " + JSON.stringify(item));
    navigation.navigate('ResultList', { context: item, idChamp : item.id, idGroup : "" });
   // console.log(JSON.stringify(item));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
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
  },
  sectionContainer: {
    padding: 10,
    backgroundColor: '#b3e0ff',
  },
  sectionText: {
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  itemText: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginLeft: 15,
  },
});

export default DepartementDetailsPage;