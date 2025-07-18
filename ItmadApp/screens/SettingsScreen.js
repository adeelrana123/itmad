import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppTheme } from '../theme/ThemeContext';

const SettingsScreen = () => {
  const colors = useAppTheme();
  const [darkMode, setDarkMode] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Settings" />
      <View style={[styles.container]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>

        <View style={[styles.row, { borderBottomColor: colors.borderColor }]}>
          <View style={styles.rowLeft}>
            <Icon name="moon-outline" size={20} color={colors.iconColor} style={styles.icon} />
            <Text style={[styles.label, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#767577', true: colors.buttonBackground }}
            thumbColor={darkMode ? colors.white : '#f4f3f4'}
          />
        </View>

        <View style={[styles.row, { borderBottomColor: colors.borderColor }]}>
          <View style={styles.rowLeft}>
            <Icon name="notifications-outline" size={20} color={colors.iconColor} style={styles.icon} />
            <Text style={[styles.label, { color: colors.text }]}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: colors.buttonBackground }}
            thumbColor={notificationsEnabled ? colors.white : '#f4f3f4'}
          />
        </View>

        <View style={[styles.row, { borderBottomColor: colors.borderColor }]}>
          <View style={styles.rowLeft}>
            <Icon name="language-outline" size={20} color={colors.iconColor} style={styles.icon} />
            <Text style={[styles.label, { color: colors.text }]}>Language</Text>
          </View>
          <Text style={[styles.value, { color: colors.mutedText }]}>English</Text>
        </View>

        <View style={[styles.row, { borderBottomColor: colors.borderColor }]}>
          <View style={styles.rowLeft}>
            <Icon name="lock-closed-outline" size={20} color={colors.iconColor} style={styles.icon} />
            <Text style={[styles.label, { color: colors.text }]}>Change Password</Text>
          </View>
          <Text style={[styles.value, { color: colors.mutedText }]}>›</Text>
        </View>

        <View style={[styles.row, { borderBottomColor: colors.borderColor }]}>
          <View style={styles.rowLeft}>
            <Icon name="shield-checkmark-outline" size={20} color={colors.iconColor} style={styles.icon} />
            <Text style={[styles.label, { color: colors.text }]}>Privacy Policy</Text>
          </View>
          <Text style={[styles.value, { color: colors.mutedText }]}>›</Text>
        </View>

        <View style={[styles.row, { borderBottomColor: colors.borderColor }]}>
          <View style={styles.rowLeft}>
            <Icon name="document-text-outline" size={20} color={colors.iconColor} style={styles.icon} />
            <Text style={[styles.label, { color: colors.text }]}>Terms of Service</Text>
          </View>
          <Text style={[styles.value, { color: colors.mutedText }]}>›</Text>
        </View>
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
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
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
  },
  value: {
    fontSize: 16,
  },
});
