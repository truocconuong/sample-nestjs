const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
import PDFMerger from 'pdf-merger-js';
const appRoot = require('app-root-path');
import * as upath from 'upath'
const converter = require('number-to-words');

function createPDF(user: any, updateService: any, id: string){
    let merger = new PDFMerger();
        (async () => {
            merger.add('public/pdf/first-page.pdf', ['1']);
            merger.add('public/pdf/body.pdf');   
            const d = new Date();
            merger.save(`public/pdf/${user.full_legal_name} ${d.getTime()}.pdf`); 
            updateService.update(id, {pdf_link: `${user.full_legal_name} ${d.getTime()}.pdf`})
        })();
}

export async function createBody(user: any, updateService: any, id: string){
    const currency = new Intl.NumberFormat('en-US');
    const dataSrc = `file:///${appRoot.path}/public/TheSansPlain.ttf`
    const pathSrc = upath.toUnix(dataSrc)
    await ejs.renderFile(path.join('public/view/', "body.ejs"), {
        user: user,
        dataSrc: pathSrc,
        convert: converter,
        currency: currency
    },(err: any, data: any) => {
        if (err) {
			console.log(err)
        } else {
            let options_1 = {
                "border":{
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
            pdf.create(data, options_1).toFile("public/pdf/body.pdf",async function(err: any, res: any) {
                if (err) return console.log(err);
                console.log(res);
                createPDF(user, updateService, id)
            })
        }
    });
}

export async function createFirstPage(user: any){
    const dataSrc = `file:///${appRoot.path}/public/TheSansPlain.ttf`
    const pathSrc = upath.toUnix(dataSrc)
    await ejs.renderFile(path.join('public/view/', "first-page.ejs"), {
        user: user,
        dataSrc: pathSrc
    },(err: any, data: any) => {
        if (err) {
			console.log(err)
        } else {
            let options_2 = {
                "height": "11.25in",
                "header": {
                    "height": "25mm",
                },
                "footer": {
                    "height": "30mm",
                },
            };
            pdf.create(data, options_2).toFile("public/pdf/first-page.pdf", function (err: any, res: any) {
                if (err) return console.log(err);
                console.log(res); 
            });
        }       
    });
}

