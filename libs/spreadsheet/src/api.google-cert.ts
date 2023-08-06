import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library/build/src/auth/googleauth';

import { GoogleCert } from '@libs/spreadsheet/google-cert';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive',
];

export class ApiGoogleServiceCert implements Partial<GoogleCert> {
  isInitialize: boolean;

  async init(): Promise<GoogleAuth> {
    this.isInitialize = true;
    return new google.auth.GoogleAuth({
      keyFile: 'resource/companylabs-1615274998871-ada5e1b1c539.json',
      scopes: SCOPES,
    });
  }
}
