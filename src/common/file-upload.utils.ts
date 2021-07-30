
export const imageFileFilter = (_req: any, file: any, callback: any) => {
  if (!file.originalname.match(/\.(pdf)$/)) {
    return callback(new Error('Only pdf files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (_req: any, file: any, callback:any) => {
  const name = file.originalname.replace(".pdf", "");
  const date = new Date()
  callback(null, `${name}_${date.getTime()}.pdf`);
};