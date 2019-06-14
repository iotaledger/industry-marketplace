import { domain } from '../config.json';

const parseSettings = ({ data } = {}) => ({
  headers: { 'Content-Type': 'application/json' },
  method: 'post',
  body: data ? JSON.stringify(data) : undefined,
});

const request = async (endpoint, { params, ...settings } = {}) => {
  if (!endpoint) return null;
  const response = await fetch(endpoint, parseSettings(settings));
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);
  return body;
};

export default {
  post: async (endpoint, data = {}) => {
    return await request(`${domain}/${endpoint}`, { data });
  }
};
