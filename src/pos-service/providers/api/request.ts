import axios from 'axios';
enum METHOD {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
};

function Request() {
  async function requestApi(
    method: METHOD,
    url: string,
    options?: any,
    dataRequest?: any,
    token?: string
  ) {
    try {
      const requestToken = `Bearer ${token}`;
      let response = await axios({
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: requestToken
        },
        ...options,
        data: dataRequest,
        url,
        method,
      });
      let { data } = response;
      return [data, data?.message];
    } catch (error) {
      return [null, error, error?.message];
    }
  }

  function get(url: string, options = {}, token?: string) {
    return requestApi(METHOD.GET, url, options, null, token);
  }

  async function post(url: string, data: any, options = {}, token?: string) {
    return requestApi(METHOD.POST, url, options, data, token);
  }

  function put(url: string, data: any, options = {}, token?: string) {
    return requestApi(METHOD.PUT, url, options, data, token);
  }

  function remove(url: string, data = {}, options = {}, token?: string) {
    return requestApi(METHOD.DELETE, url, options, data, token);
  }

  function patch(url: string, data: any, options = {}, token?: string) {
    return requestApi(METHOD.PATCH, url, options, data, token);
  }

  return { get, post, put, patch, delete: remove };
}

export default Request();
