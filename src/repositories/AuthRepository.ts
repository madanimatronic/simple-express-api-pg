import { EmailVerificationDataFromDB } from '@/types/email-verification-data';
import { DatabaseService } from '@/types/services/DatabaseService';
import { UserFromDB } from '@/types/User';

export class AuthRepository {
  constructor(private readonly dbService: DatabaseService) {}

  async saveEmailVerificationUUID(userId: number, uuid: string) {
    const dbResponse = await this.dbService.query<EmailVerificationDataFromDB>(
      `INSERT INTO email_verifications
      (user_id, verification_uuid) VALUES ($1, $2)
      ON CONFLICT (user_id) DO UPDATE SET
      user_id = $1, verification_uuid = $2,
      created_at = DEFAULT, expires_at = DEFAULT
      RETURNING *`,
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
    const dbResponse = await this.dbService.query<EmailVerificationDataFromDB>(
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
    const dbResponse = await this.dbService.query<EmailVerificationDataFromDB>(
      'DELETE FROM email_verifications WHERE expires_at <= NOW() RETURNING *',
    );

    return dbResponse.rows;
  }
}
