import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet } from 'react-native';
import { TaskListScreen } from '../screens/TaskListScreen';
import { colors, typography } from '../constants/theme';
import { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIconName = keyof typeof Ionicons.glyphMap;

const TAB_ICONS: Record<keyof MainTabParamList, { active: TabIconName; inactive: TabIconName }> = {
  All: { active: 'layers', inactive: 'layers-outline' },
  Pending: { active: 'ellipse', inactive: 'ellipse-outline' },
  Completed: { active: 'checkmark-circle', inactive: 'checkmark-circle-outline' },
};

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.active : icons.inactive;
          return <Ionicons name={iconName} size={size - 2} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="All"
        component={TaskListScreen}
        options={{ tabBarLabel: 'All' }}
      />
      <Tab.Screen
        name="Pending"
        component={TaskListScreen}
        options={{ tabBarLabel: 'To Do' }}
      />
      <Tab.Screen
        name="Completed"
        component={TaskListScreen}
        options={{ tabBarLabel: 'Done' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.tabBar,
    borderTopColor: colors.separator,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 6,
    height: Platform.OS === 'ios' ? 84 : 64,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      default: { elevation: 8 },
    }),
  },
  tabLabel: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '500',
    marginBottom: Platform.OS === 'ios' ? 0 : 4,
  },
});
