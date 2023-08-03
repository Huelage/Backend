import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

interface OriginalError {
  message: string;
}

export const graphqlConfig: ApolloDriverConfig = {
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  formatError: (err: GraphQLError) => {
    const graphQLFormattedError: GraphQLFormattedError = {
      message:
        (err.extensions.originalError as OriginalError)?.message ||
        err?.message,
    };

    return graphQLFormattedError;
  },
};
