import { join } from 'path';

import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

interface OriginalError {
  message: string;
  statusCode: number;
}

export const graphqlConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  formatError: (err: GraphQLError) => {
    const graphQLFormattedError =
      (err.extensions.originalError as OriginalError) || err;

    return graphQLFormattedError as GraphQLFormattedError;
  },
};
