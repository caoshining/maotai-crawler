import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskService } from './task/task.service';
import { LoginService } from './login/login.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductService } from './product/product.service';
import { WangyiService } from './wangyi/wangyi.service';
import { ExportExcelService } from './file/export-excel/export-excel.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    TaskService,
    LoginService,
    ProductService,
    WangyiService,
    ExportExcelService,
  ],
})
export class AppModule {}
