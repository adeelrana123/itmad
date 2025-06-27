import * as React from 'react';

// This reference will be used to access navigation outside of components
export const navigationRef = React.createRef();

/**
 * Use this function to navigate from anywhere (even outside React components)
 * Example: navigate('ChatScreen', { chatId: 'abc123' });
 */
export function navigate(name, params) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}
