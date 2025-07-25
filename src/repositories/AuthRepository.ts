import { DatabaseService } from '@/types/services/DatabaseService';
import { UserFromDB } from '@/types/User';

// TODO: написать типы для значений из БД
export class AuthRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async saveEmailVerificationUUID(userId: number, uuid: string) {
    const dbResponse = await this.dbService.query<any>(
      'INSERT INTO email_verifications (user_id, verification_uuid) VALUES ($1, $2) RETURNING *',
      [userId, uuid],
    );

    return dbResponse.rows[0];
  }

  async getUserByEmailVerificationUUID(verificationUUID: string) {
    const dbResponse = await this.dbService.query<UserFromDB>(
      `SELECT u.* FROM 
      users u INNER JOIN email_verifications ev 
      ON u.id = ev.user_id 
      WHERE ev.verification_uuid = $1
      AND ev.expires_at > NOW()`,
      [verificationUUID],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  async deleteEmailVerificationUuidByUserId(userId: number) {
    const dbResponse = await this.dbService.query<any>(
      'DELETE FROM email_verifications WHERE user_id = $1 RETURNING *',
      [userId],
    );

    if (!dbResponse.rowCount) {
      return null;
    }

    return dbResponse.rows[0];
  }

  // TODO: можно использовать в cron или ещё как-то
  async deleteExpiredVerificationUUIDs() {
    const dbResponse = await this.dbService.query<any>(
      'DELETE FROM email_verifications WHERE expires_at <= NOW() RETURNING *',
    );

    return dbResponse.rows;
  }
}
