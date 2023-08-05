import { join } from 'path';

import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

interface OriginalError {
  message: string;
}

export const graphqlConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), '../schema.gql'),
  formatError: (err: GraphQLError) => {
    const graphQLFormattedError: GraphQLFormattedError = {
      message:
        (err.extensions.originalError as OriginalError)?.message ||
        err?.message,
    };

    return graphQLFormattedError;
  },
};
