import md5 from "md5";
import axios from "axios";

const BASE_URL = 'https://api.valantis.store:41000/';

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
    throw error;
  }
};
