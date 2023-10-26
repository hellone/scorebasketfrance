import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DepartmentListPage = ({ route }) => {
  const navigation = useNavigation();
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const base64Credentials = "RkZCQkFwcDpVTXJBRXBnNWtNOE5SRUdsc0hvemNTb2ZvM0J4";

    
    fetch('http://mobiles.ffbb.com/php/v1_0_5/areas.php', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${base64Credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: "championship",
        }),
      })
        .then(response => response.json())
        .then(data => {
          setDepartements(data);
          setLoading(false);
        });
    }, []);


  const handleDepartementClick = (departement) => {
//    if (!clickedDepartements.find(u => u.id === departement.id)) {
//      setClickedDepartements([...clickedDepartements, departement]);
//    }
    console.log("departement selectionné : " + JSON.stringify(departement));
    navigation.navigate('DepartementDetails', { departementId: departement.id, departementName: departement.name });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={departements}
//        keyExtractor={item => item.id.toString()}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleDepartementClick(item)}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 18,
  },
  button: {
    marginTop: 10,
    padding: 10,
  },
});

export default DepartmentListPage;