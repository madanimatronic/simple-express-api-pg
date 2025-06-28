import { Client, Pool } from 'pg';

export type DatabaseService = Pool | Client;
