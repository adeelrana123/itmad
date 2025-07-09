import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppTheme } from '../theme/ThemeContext';
// import useAppTheme from '../theme/useAppTheme';

const Header = ({ title }) => {
  const navigation = useNavigation();
  const colors = useAppTheme();
 

  return (
    <View
      style={[
        styles.headerContainer,
        { backgroundColor: colors.buttonBackground },
      ]}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color={colors.white || '#fff'} />
      </TouchableOpacity>

      <View style={styles.titleWrapper}>
        <Text style={[styles.headerText, { color: colors.white || '#fff' }]}>
          {title}
        </Text>
      </View>

      {/* Empty view to balance space for back icon */}
      <View style={styles.backButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default Header;
