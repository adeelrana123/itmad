// theme/useAppTheme.js
import { useColorScheme } from 'react-native';
import appTheme from './colors';


const useAppTheme = () => {
  const scheme = useColorScheme(); 
  return appTheme[scheme || 'light'];
};
export default useAppTheme;
