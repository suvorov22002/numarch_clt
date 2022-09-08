import {name, version} from '../../package.json';

export const environment = {
  production: false,
  name: name,
  version: version,//
  //API_BASE_URL:"http://192.168.11.75:9001/numarch-service/rest/api/numarch",
  API_BASE_URL:"http://127.0.0.1:8086/rest/api/numarch"
};