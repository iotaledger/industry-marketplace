import { stringify } from 'query-string';
import { domain } from '../config.json';

const parseSettings = ({ method, data } = {}) => ({
  headers: { 'Content-Type': 'application/json' },
  method,
  body: data ? JSON.stringify(data) : undefined,
});

const parseEndpoint = (endpoint, params) => {
  const querystring = params ? `?${stringify(params)}` : '';
  return `${endpoint}${querystring}`;
};

const request = async (endpoint, { params, ...settings } = {}) => {
  if (!endpoint) return null;
  const response = await fetch(parseEndpoint(endpoint, params), parseSettings(settings));
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
  return body;
};

export default {
  get: async (endpoint, params) => {
    return await request(`${domain}/${endpoint}`, { method: 'get', params });
  },
  post: async (endpoint, data = {}) => {
    return await request(`${domain}/${endpoint}`, { method: 'post', data });
  }
};
