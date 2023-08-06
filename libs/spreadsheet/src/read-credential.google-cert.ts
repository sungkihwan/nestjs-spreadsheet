import * as fs from 'fs';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library/build/src/auth/googleauth';
import { OAuth2Client } from 'google-auth-library/build/src/auth/oauth2client';

import { GoogleCert } from '@libs/spreadsheet/google-cert';
import { NotAcceptableException } from '@nestjs/common';

const TOKEN_PATH = './resource/token.json';
const CREDENTIAL_PATH = './resource/credentials_desktop.json';

export class ReadCredentialGoogleCert implements GoogleCert {
  private isInitialized = false;

  async init(): Promise<GoogleAuth | OAuth2Client> {
    const oAuth2Client = await this.readCredentials();
    await this.authorize(oAuth2Client);
    this.isInitialized = true;
    return oAuth2Client;
  }

  get isInitialize(): boolean {
    return this.isInitialized;
  }

  private async readCredentials(): Promise<OAuth2Client> {
    return new Promise((resolve, reject) => {
      fs.readFile(CREDENTIAL_PATH, 'utf8', (err, content) => {
        if (err) {
          reject(err);
        }

        // Authorize a client with credentials, then call the Google Sheets API.
        try {
          const credentials = JSON.parse(content);
          const { client_secret, client_id, redirect_uris } =
            credentials.installed;
          const oAuth2Client = new google.auth.OAuth2(
            client_id,
            client_secret,
            redirect_uris[0],
          );
          resolve(oAuth2Client);
        } catch (e) {
          reject(
            new NotAcceptableException(
              `Read cert file not valid: ${CREDENTIAL_PATH}: ${e.message}`,
            ),
          );
        }
      });
    });
  }

  private async authorize(credentials): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.readFile(TOKEN_PATH, 'utf8', (err, token) => {
        if (err) {
          reject(new Error('Take token failed!! set token first: ' + err));
        }
        try {
          credentials.setCredentials(JSON.parse(token));
          resolve();
        } catch (e) {
          reject(
            new NotAcceptableException(
              `Read cert file not valid: ${TOKEN_PATH}: ${e.message}`,
            ),
          );
        }
      });
    });
  }
}
