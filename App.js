import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserListPage from './UserListPage';
import DepartmentListPage from './DepartmentListPage';
import RegionListPage from './RegionListPage';
import FavoritesAdminPage from './FavoritesAdminPage';
import SearchCityPage from './SearchCityPage';
import CityDetailPage from './CityDetailPage';
import FavoritesScoresPage from './FavoritesScoresPage';
import IndexPage from './IndexPage';
import RegionDetailsPage from './RegionDetailsPage';
import DepartementDetailsPage from './DepartementDetailsPage';
import ResultListPage from './ResultListPage';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Index">
        <Stack.Screen name="UserList" component={UserListPage} />
        <Stack.Screen name="DepartmentList" component={DepartmentListPage} />
        <Stack.Screen name="RegionList" component={RegionListPage} /> 
        <Stack.Screen name="FavoritesAdmin" component={FavoritesAdminPage} />
        <Stack.Screen name="SearchCity" component={SearchCityPage} />
        <Stack.Screen name="CityDetail" component={CityDetailPage} />
        <Stack.Screen name="FavoritesScores" component={FavoritesScoresPage} />
        <Stack.Screen name="Index" component={IndexPage} />
        <Stack.Screen name="DepartementDetails" component={DepartementDetailsPage} />
        <Stack.Screen name="RegionDetails" component={RegionDetailsPage} />
        <Stack.Screen name="ResultList" component={ResultListPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
