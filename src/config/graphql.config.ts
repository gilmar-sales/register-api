import { GqlModuleOptions } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';

const graphqlConfig: GqlModuleOptions = {
  driver: ApolloDriver,
  autoSchemaFile: 'schema.gql',
};

export default graphqlConfig;
