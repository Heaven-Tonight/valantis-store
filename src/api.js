import md5 from "md5";
import axios from "axios";

const BASE_URL = 'http://api.valantis.store:40000/';

const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
const authHeader = md5(`Valantis_${timestamp}`);

const config = {
  headers: { 'X-Auth': authHeader }
};

export const fetchByAction = async (action, params) => {
  const requestData = {
    action,
  };
  
  if (params) {
    requestData.params = params;
  }
  
  try {
    const { data: { result } } = await axios.post(BASE_URL, requestData, config);
    return result;
  } catch (error) {
    if (error.response?.data) {
      console.log('Идентификатор ошибки: ', error.response?.data)
    }
    console.log('FETCHING ERROR', error);
    // throw error;
  }
};