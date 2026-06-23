import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskProvider } from '../context/TaskContext';
import { TaskDetailsScreen } from '../screens/TaskDetailsScreen';
import { TaskFormScreen } from '../screens/TaskFormScreen';
import { colors } from '../constants/theme';
import { MainTabNavigator } from './MainTabNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.groupedBackground,
    text: colors.text,
    border: colors.separator,
    primary: colors.primary,
  },
};

export function AppNavigator() {
  return (
    <TaskProvider>
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerTintColor: colors.primary,
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 17,
              color: colors.text,
            },
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen
            name="Main"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddTask"
            component={TaskFormScreen}
            options={{
              presentation: 'modal',
              headerLargeTitle: false,
            }}
          />
          <Stack.Screen
            name="EditTask"
            component={TaskFormScreen}
            options={{
              presentation: 'modal',
              headerLargeTitle: false,
            }}
          />
          <Stack.Screen
            name="TaskDetails"
            component={TaskDetailsScreen}
            options={{
              title: 'Details',
              headerLargeTitle: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TaskProvider>
  );
}
