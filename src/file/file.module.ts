import { Module } from '@nestjs/common';
import { UploadExcelService } from './upload-excel/upload-excel.service';
import { ExportExcelService } from './export-excel/export-excel.service';

@Module({
  providers: [UploadExcelService, ExportExcelService],
  exports: [UploadExcelService, ExportExcelService],
})
export class FileModule {}
