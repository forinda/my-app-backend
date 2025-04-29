import path from 'path';
import fs from 'fs';
import util from 'util';
import moment from 'moment';
import puppeteer from 'puppeteer';
import { renderFile as renderHtmlString } from 'ejs';
import { dependency } from '@/common/di';
import { inject } from 'inversify';
import { Config } from '@/common/config';

const unlink = util.promisify(fs.unlink);

export type PrintFormat = 'A4' | 'A5' | 'A6' | 'Legal' | 'Letter' | 'Tabloid';

export type FinanceTemplates = 'user-invoice';

export type TemplatesTypeTuple = FinanceTemplates;

type Templates<TR extends TemplatesTypeTuple> = {
  [T in TR]:
    | `${T}.ejs`
    | `${T}.html`
    | `${T}.pdf`
    | `${T}-${number}.pdf`
    | `${T}-${number}.html`
    | `${T}-${number}.ejs`;
};
type ModuleTypeTuple = 'finance';
type PrintProps<T extends TemplatesTypeTuple, Data = unknown> = {
  response: any;
  template: T;
  fileName:
    | `${T}.ejs`
    | `${T}.html`
    | `${T}.pdf`
    | `${T}-${number}.pdf`
    | `${T}-${number}.html`
    | `${T}-${number}.ejs`;
  fileClassName: T;
  printData: Data;
  margin?: {
    right: number;
    left: number;
    top: number;
    bottom: number;
  };
};

@dependency()
export class Printer {
  private readonly PRINT_EJS_TEMPLATES: Templates<TemplatesTypeTuple> = {
    'user-invoice': 'user-invoice.ejs'
  };
  @inject(Config) private config: Config;

  /**
   * Print document to PDF
   *
   * @param props Properties for printing
   * @param module Module name (finance, academics, or transport)
   * @param format Page format (A4, A5, etc.)
   * @param orientation Page orientation (portrait or landscape)
   */
  async print<Temp extends TemplatesTypeTuple, Data = unknown>(
    props: PrintProps<Temp, Data>,
    module: ModuleTypeTuple,
    format: PrintFormat = 'A4',
    orientation: 'landscape' | 'portrait' = 'portrait'
  ) {
    const { response, template, fileClassName, printData } = props;

    let fileName = props.fileName;
    let browser: puppeteer.Browser | null = null;
    let page: puppeteer.Page | null = null;

    try {
      if (!this.PRINT_EJS_TEMPLATES[template]) {
        throw new Error('Invalid template');
      }
      if (!printData) {
        throw new Error('Invalid print data');
      }
      if (!fileClassName) {
        throw new Error('Invalid file class name');
      }

      const templateFile = this.PRINT_EJS_TEMPLATES[template];
      const templateName = templateFile.split('.')[0];
      const templatePath = path.join(
        this.config.paths.BASE_DIR || '',
        'src/templates',
        module,
        templateFile
      );

      const htmlFilePath = path.join(
        this.config.paths.BASE_DIR || '',
        'src/templates',
        module,
        `${templateName}_${Date.now()}.html`
      );

      const pdfFilePath = path.join(
        process.env.PROJECT_ROOT || '',
        'src/templates',
        module,
        `${templateName}.pdf`
      );

      const html = await renderHtmlString(templatePath, {
        data: printData,
        moment: moment
      });

      await fs.promises.writeFile(htmlFilePath, html);

      browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security'
        ]
      });

      page = await browser.newPage();

      await page.setContent(html, {
        waitUntil: 'load',
        timeout: 0
      });

      await page.waitForSelector('img', { visible: true }).catch(() => {
        // Continue if no images are present
        console.log('No images found in template, continuing...');
      });

      const margin = props.margin
        ? {
            right: `${props.margin.right}in`,
            left: `${props.margin.left}in`,
            top: `${props.margin.top}in`,
            bottom: `${props.margin.bottom}in`
          }
        : {
            right: '0.05in',
            left: '0.05in',
            top: '0.05in',
            bottom: '0.05in'
          };

      await page.pdf({
        path: pdfFilePath,
        format: format || 'A4',
        printBackground: true,
        margin,
        timeout: 0,
        landscape: orientation === 'landscape',
        displayHeaderFooter: true,
        footerTemplate: `<div style="width: 100%; text-align: center; font-size: 10px; color: #444;">
					<span>Generated on ${moment().format('MMM DD, YYYY')}</span>
				</div>`
      });

      fileName = `${templateName}-${new Date().getTime()}.pdf` as any;

      response.setHeader('Content-Type', 'application/pdf');
      response.setHeader(
        'Content-Disposition',
        `attachment; filename=${fileName}`
      );

      const fileStream = fs.createReadStream(pdfFilePath);

      fileStream.pipe(response);

      await new Promise<void>((resolve) => {
        fileStream.on('end', async () => {
          resolve();

          await Promise.all([unlink(htmlFilePath), unlink(pdfFilePath)]);
        });
      });
    } catch (error) {
      console.error('Error generating PDF:', error);

      response.status(500).send({
        message: error.message,
        code: 'PRINT_ERROR',
        resultData: {}
      });
    } finally {
      if (page) {
        await page.close();
      }
      if (browser) {
        await browser.close();
      }
    }
  }
}
