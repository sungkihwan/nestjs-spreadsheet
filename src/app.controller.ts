import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { SpreadsheetService } from '@libs/spreadsheet';

interface KeyData {
  [key: string]: any;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly spreadsheetService: SpreadsheetService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/test')
  async test(): Promise<any> {
    const result = await this.spreadsheetService.getValuesByMultiEditor(
      '1KK36IHmo5vKZBQ72ZA_hAW_9mgpjrkzzwvnjTvdZ-jE',
      '시트1!A1:W1000',
    );
    const transformedData = this.transform(result);
    console.log(transformedData);
  }

  private transform(data: string[][]): KeyData[] {
    const years = data[0];
    const rows = data.slice(1);

    return rows.map((row) => {
      return row.reduce((obj: KeyData, value: string, index: number) => {
        obj[years[index]] = value;
        return obj;
      }, {});
    });
  }
}
