/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {
  ApolloProvider,
  ApolloClient,
  HttpLink,
  InMemoryCache,
  split
} from '@apollo/client';
import { WebSocketLink } from '@apollo/link-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { store, persistor } from './redux/store/index';
import LoadingScreen from './components/Shared/Loading';
import App from './App';

/*
* configure GraphQL, and Hasura
*/
const GRAPHQL_ENDPOINT = 'ENTER_HASURA_ENDPOINT_HERE';

const httpLink = new HttpLink({
  headers: {
    'x-hasura-admin-secret': 'ENTER_HASURA_ADMIN_SECRET_HERE' 
  },
  uri: `https://${GRAPHQL_ENDPOINT}`,
});

const wsLink = new WebSocketLink({
  uri: `ws://${GRAPHQL_ENDPOINT}`,
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        'x-hasura-admin-secret': 'ENTER_HASURA_ADMIN_SECRET_HERE' 
      }
    }
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Subscription: {
        fields: {
          DatasetsTable: {
            merge: false
          }
        }
      }
    }
  }),
  link: splitLink,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <PersistGate
        loading={<LoadingScreen />}
        persistor={persistor}
      >
        <App client={client} />
      </PersistGate>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root'),
);
