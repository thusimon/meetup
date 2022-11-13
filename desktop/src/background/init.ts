import fs from 'fs'

const fsp = fs.promises;
export const init = async () => {
  // create init file is not exits
  try {
    await fsp.access('./info.json');
  } catch (e) {
    const initData = {}
    await fsp.writeFile('./info.json', JSON.stringify(initData))
  }
};
