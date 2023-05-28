import '@azure/core-asynciterator-polyfill'//datastore not working..async iterator warning
import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/navigation';

import { Amplify } from 'aws-amplify';
import awsconfig from "./src/aws-exports";
import { withAuthenticator } from 'aws-amplify-react-native';

import AuthContextProvider from './src/contexts/AuthContext';
import OrderContextProvider from './src/contexts/OrderContext';

Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});

function App() {
  return (
    <NavigationContainer>
      <AuthContextProvider>
        <OrderContextProvider>
        <Navigation />
        </OrderContextProvider>
      </AuthContextProvider>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default withAuthenticator(App);

