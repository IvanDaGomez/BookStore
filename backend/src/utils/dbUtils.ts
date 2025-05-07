import { Pool, QueryResult, QueryResultRow } from 'pg'

const MAX_QUERY_RETRIES = 3;
const QUERY_RETRY_DELAY = 1000; // 1 second

export class DatabaseError extends Error {
  constructor(message: string, public readonly originalError?: any) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export async function executeQuery<T extends QueryResultRow>(
  pool: Pool,
  queryFn: () => Promise<QueryResult<T>>,
  errorMessage: string,
  retries = 0
): Promise<any[]> {
  try {
    const result = await queryFn();
    return result.rows;
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    
    if (retries < MAX_QUERY_RETRIES) {
      console.log(`Retrying query in ${QUERY_RETRY_DELAY/1000} seconds... (Attempt ${retries + 1}/${MAX_QUERY_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, QUERY_RETRY_DELAY));
      return executeQuery(pool, queryFn, errorMessage, retries + 1);
    }
    
    throw new DatabaseError(errorMessage, error);
  }
}

export async function executeSingleResultQuery<T>(
  pool: Pool,
  queryFn: () => Promise<QueryResult<T extends QueryResultRow? T : never>>,
  errorMessage: string,
  retries = 0
): Promise<T> {
  const results = await executeQuery(pool, queryFn, errorMessage, retries);

  return results[0];
}

