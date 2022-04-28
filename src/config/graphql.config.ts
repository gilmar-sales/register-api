import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

const graphqlConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: 'schema.gql',
  subscriptions: {
    'graphql-ws': true,
    'subscriptions-transport-ws': true,
  },
};

export default graphqlConfig;
