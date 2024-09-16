import { config } from 'dotenv';
import { Connection, createConnection } from 'mysql2';

config({ path: '.env' });
class DbConnection {
  // This function is used to make a database connection
  public connectDb(): Connection | undefined {
    try {
      const connection: Connection = createConnection({
        host: process.env.MYSQL_DB_HOST as string, 
        user: process.env.MYSQL_DB_USER as string,
        password: process.env.MYSQL_DB_PASSWORD as string,
        database: process.env.MYSQL_DB_NAME as string,
      });

      // Connects to the database
      connection.connect((err: Error | null) => {
        if (err) throw err;
        console.log('Connected to MySQL database!');
      });

      return connection;
    } catch (error) {
      console.error('Error connecting database', error);
      return undefined;
    }
  }
}

export default DbConnection;
