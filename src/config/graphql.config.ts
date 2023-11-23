import { join } from 'path';

import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

interface OriginalError {
  message: string;
  statusCode: number;
}

export const graphqlConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  subscriptions: { 'graphql-ws': true },
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  formatError: (err: GraphQLError) => {
    const graphQLFormattedError = (err.extensions
      .originalError as OriginalError) || { message: err.message };

    return graphQLFormattedError as GraphQLFormattedError;
  },
};
