import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { LoginService } from 'src/login/login.service';
import * as cheerio from 'cheerio';
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { ExportExcelService } from 'src/file/export-excel/export-excel.service';

const excelPath = path.resolve(__dirname, '../', 'sheet.xls');

const stock = process.env.STOCK;
console.log(stock,'stock')
@Injectable()
export class WangyiService {
  private readonly logger = new Logger(WangyiService.name);
  constructor(
    private readonly loginService: LoginService,
    private readonly exportExcelService: ExportExcelService,
  ) {}

  async getContent() {
    const url = `http://quotes.money.163.com/f10/zycwzb_${stock}.html`;
    this.logger.log('获取内容: ', url);
    const res = await axios.get(url, {
      headers: {
        'User-Agent': this.loginService.ua,
        cookie: this.loginService.cookieToHeader(),
      },
    });

    this.loginService.cookieStore(res.headers);
    const $ = cheerio.load(res.data);
    const headers = $('.col_r tbody .dbrow')[0].childNodes;
    const years = headers
      .filter((v: any) => v && v.children && v.children[0])
      .map((node: any) => ({
        label: node.children[0].data,
        value: node.children[0].data,
      }));
    console.log('years', years);

    const data = $('.col_r tbody tr')[11]
      .childNodes.filter((v: any) => v && v.children && v.children[0])
      .reduce((obj: any, node: any, i: number) => {
        obj[years[i].value] = node.children[0].data;
        return obj;
      }, {});
    console.log('data', data);

    /**
     * exportExcel(
    titleList: Array<{ label: string; value: string }>,
    dataList: ObjectType[],
    xlsName = 'sheet1',
  )
     */
    const buffer = this.exportExcelService.exportExcel(years, [data], 'sheet1');
    if (buffer) {
      this.logger.log('获取流成功');
      fs.writeFile(excelPath, buffer, err => {
        if (err) throw err;
        this.logger.log('文件写入成功');
      });
    }
  }
}
