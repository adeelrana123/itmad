import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import useAppTheme from '../theme/useAppTheme';
import Icon from 'react-native-vector-icons/Ionicons';
const SettingsScreen = () => {
  const colors = useAppTheme();
  const [darkMode, setDarkMode] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <View style={{ flex: 1 }}>
      <Header title="Settings" />
      <View style={[styles.container, { backgroundColor: colors.background }]}>

        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.row}>
  <View style={styles.rowLeft}>
    <Icon name="moon-outline" size={20} color="#444" style={styles.icon} />
    <Text style={styles.label}>Dark Mode</Text>
  </View>
  <Switch
    value={darkMode}
    onValueChange={setDarkMode}
    trackColor={{ false: '#767577', true: '#FF6B00' }}
    thumbColor={darkMode ? '#fff' : '#f4f3f4'}
  />
</View>

       <View style={styles.row}>
  <View style={styles.rowLeft}>
    <Icon name="notifications-outline" size={20} color="#444" style={styles.icon} />
    <Text style={styles.label}>Notifications</Text>
  </View>
  <Switch
    value={notificationsEnabled}
    onValueChange={setNotificationsEnabled}
    trackColor={{ false: '#767577', true: '#FF6B00' }}
    thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
  />
</View>

<View style={styles.row}>
  <View style={styles.rowLeft}>
    <Icon name="language-outline" size={20} color="#444" style={styles.icon} />
    <Text style={styles.label}>Language</Text>
  </View>
  <Text style={styles.value}>English </Text>
</View>

<TouchableOpacity style={styles.row}>
  <View style={styles.rowLeft}>
    <Icon name="lock-closed-outline" size={20} color="#444" style={styles.icon} />
    <Text style={styles.label}>Change Password</Text>
  </View>
  <Text style={styles.value}>></Text>
</TouchableOpacity>
<TouchableOpacity style={styles.row}>
  <View style={styles.rowLeft}>
    <Icon name="shield-checkmark-outline" size={20} color="#444" style={styles.icon} />
    <Text style={styles.label}>Privacy Policy</Text>
  </View>
  <Text style={styles.value}>></Text>
</TouchableOpacity>

<TouchableOpacity style={styles.row}>
  <View style={styles.rowLeft}>
    <Icon name="document-text-outline" size={20} color="#444" style={styles.icon} />
    <Text style={styles.label}>Terms of Service</Text>
  </View>
  <Text style={styles.value}>></Text>
</TouchableOpacity>

      
        
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  rowLeft: {
  flexDirection: 'row',
  alignItems: 'center',
},
icon: {
  marginRight: 10,
},
  label: {
    fontSize: 16,
    color: '#444',
  },
  value: {
    fontSize: 16,
    color: '#999',
  },
});
