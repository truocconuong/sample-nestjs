import { Injectable } from '@nestjs/common';
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const appRoot = require('app-root-path');
import * as upath from 'upath'
const converter = require('number-to-words');
const { merge } = require('merge-pdf-buffers');
const PromiseBlueBird = require('bluebird');
const slugify = require('slugify');
const fs = require('fs');
import { MasterdataService } from 'src/modules/masterdata/providers';

@Injectable()
export class PdfService {
    constructor(private masterdataService: MasterdataService) { }
    public async createPdf(user: any) {
        for (let i = 0; i < user.investments.length; i++) {
            const masterData = await this.masterdataService.findById(user.investments[i].type_id)
            user.investments[i].investmentType = masterData!.value
        }
        const firstPageLayout = {
            "height": "11.25in",
            "header": {
                "height": "25mm",
            },
            "footer": {
                "height": "30mm",
            },
        };
        const bodyLayout = {
            "border": {
                "bottom": "20mm"
            },
            "height": "11.25in",
            "header": {
                "height": "20mm",
            },
            "footer": {
                "height": "60mm",
            },
        };
        let firstPageFileData
        let bodyPageFileData
        const dataSrc = `file:///${appRoot.path}/public/TheSansPlain.ttf`
        const pathSrc = upath.toUnix(dataSrc)
        const currency = new Intl.NumberFormat('en-US');
        ejs.renderFile(path.join('public/view/', "first-page.ejs"), {
            user: user,
            dataSrc: pathSrc
        }, (err: any, data: any) => {
            if (err) {
                console.log(err)
            }
            firstPageFileData = data
        });
        ejs.renderFile(path.join('public/view/', "body.ejs"), {
            user: user,
            dataSrc: pathSrc,
            convert: converter,
            currency: currency,
        }, (err: any, data: any) => {
            if (err) {
                console.log(err)
            }
            bodyPageFileData = data
        });
        const firstBuffer = await this.createBuffer(firstPageFileData, firstPageLayout)
        const bodyBuffer = await this.createBuffer(bodyPageFileData, bodyLayout)
        const date = new Date()
        const merged = await merge([firstBuffer, bodyBuffer]);
        const timeStamp = date.getTime()
        const pdfSrc = `public/pdf/${slugify(user.full_legal_name, { replacement: '_', lower: true })}_${timeStamp}.pdf`
        const pdfLink = `pdf/${slugify(user.full_legal_name, { replacement: '_', lower: true })}_${timeStamp}.pdf`
        await fs.createWriteStream(pdfSrc)
        fs.writeFile(pdfSrc, merged, function (err: any) {
            if (err) throw err;
        })
        return "/" + pdfLink
    }


    public createBuffer = (html: any, options: any) => new PromiseBlueBird(((resolve: any, reject: any) => {
        pdf.create(html, options).toBuffer((err: any, buffer: any) => {
            if (err !== null) { reject(err); }
            else { resolve(buffer); }
        });
    }));

}


