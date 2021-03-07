export const copyObj = (obj) => JSON.parse(JSON.stringify(obj));
export const createPreview = ({ id, year, yoho, title }, idx) => {
  return `
      <a tab-index="${idx + 1}" data-id='${id}' href='${yoho}' class='preview'>
        <div class='preview-title'>${title}</div>
        <img src='https://kinopoisk.ru/images/sm_film/${id}.jpg' class='preview-image'>
        ${year && '<div class="preview-year">' + year + '</div>'}
      </a>
    `
};
export const compareTypes = (a, b) =>  {
  if (a.type === 'film' && a.type !== b.type) {
    return -1
  }
  if (a.type === 'series' && a.type !== b.type) {
    return 1
  }
  if (a.type === b.type) {
    return 0
  }
};
export const isPs = () => /(PlayStation)/gm.test('PlayStation');
