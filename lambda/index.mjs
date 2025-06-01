/**
 * @file 妖精占い
 * @author koyamaru
 * @copyright (c) 2007,2025 ムルモ屋本舗
 * @license MIT
 * @version v1.0.0
 * 
 * https://api.murumoya.com/v1/uranai?birth=2001-04-01
 * のように、誕生日をbirthで指定する。
 */

import { getUranaiNumber, getFairy } from "./modules/fairy-uranai.mjs";
/**
 * 指定した誕生日をもとに妖精情報を返します。
 * @param {*} event 
 * @param {*} context 
 * @param {*} callback 
 */
export const handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // 誕生日指定の有無をチェックする
  if (event.queryStringParameters == null || event.queryStringParameters.birth === undefined) {
    return getErrorResponse("birthが指定されていません。");
  }

  const birth = event.queryStringParameters.birth;

  // 誕生日のフォーマットをチェックする
  const regexp = new RegExp(/^\d{4}-\d{2}-\d{2}$/);
  if (!regexp.test(birth)) {
    return getErrorResponse("birthの指定誤りです。");
  }

  // 誕生日を数値に変換して保持する
  const birthAry = birth.split('-');
  const year = Number(birthAry[0]);
  const month = Number(birthAry[1]);
  const day = Number(birthAry[2]);
  console.log(year, month, day);

  if (!(month >= 1 && month <= 12)) {
    return getErrorResponse("誕生月の指定誤りです。");
  }

  if (!(day >= 1 && day <= 31)) {
    return getErrorResponse("誕生日の指定誤りです。");
  }

  // 誕生日から番号を取得し、さらに番号から妖精情報を取得する
  const number = getUranaiNumber(year, month, day);
  const res = getFairy(number);
  console.log(res);

  const response = {
    statusCode: 200,
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(res)
  }

  return response;
};

/**
 * エラーレスポンスを作成して返却します。
 * @param  {} _message
 */
function getErrorResponse(message) {
  const response = {
    statusCode: 400,
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({
      error: message
    })
  }

  return response;
}

