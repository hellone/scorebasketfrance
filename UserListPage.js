import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserListPage = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clickedUsers, setClickedUsers] = useState([]);

  useEffect(() => {

    const base64Credentials = "RkZCQkFwcDpVTXJBRXBnNWtNOE5SRUdsc0hvemNTb2ZvM0J4";

    fetch('http://mobiles.ffbb.com/php/v1_0_5/topChampionships.php?type=championship', {
    //fetch('https://jsonplaceholder.typicode.com/users', {
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
        'Connection': 'Keep-Alive',
        'Host': 'mobiles.ffbb.com',
        'Access-Control-Allow-Origin': '*',
        // Ajoute d'autres en-têtes ici si nécessaire
      },
    })
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  const handleUserClick = (item) => {

    if(item.name == "CHAMPIONNATS DEPARTEMENTAUX") {
        navigation.navigate('DepartmentList', { itemId: item.name });
        console.log("DEPARTEMENTAUX");
    }
    else if(item.name == "CHAMPIONNATS REGIONAUX") {
        navigation.navigate('RegionList');
        console.log("REGIONAUX");
    }
    else{
      console.log("ResultList  :  " + item.id);
        navigation.navigate('ResultList', { idChamp: item.id });
    }

    if (!clickedUsers.find(u => u.id === item.id)) {
      setClickedUsers([...clickedUsers, item]);
    }
    //navigation.navigate('UserDetails', { userId: user.id });
    //navigation.navigate('RegionList', { itemId: item.id });

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
      <FlatList
        data={users}
//        keyExtractor={item => item.id.toString()}
        keyExtractor={item => ("id" in item?item.id:item.name)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserClick(item)}>
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
  itemContainer: {
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
  itemText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default UserListPage;