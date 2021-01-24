import {getDataAboutBuckwheat} from '../parser/parser.js';

export const getBuckweatData = async (req, res) => {
  res.json(await getDataAboutBuckwheat());
}
