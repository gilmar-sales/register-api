import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

const graphqlConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: 'schema.gql',
  context: async ({ req, connection }) => {
    if (connection) {
      return { req: connection.context };
    }
    return { req };
  },
  subscriptions: {
    'subscriptions-transport-ws': {
      onConnect: (connectionParams) => {
        return {
          req: { ...connectionParams },
        };
      },
    },
  },
};

export default graphqlConfig;
