import request from 'superagent';

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

class Client {
  agent: request.SuperAgentStatic;
  tokenKey = 'jwt_token';

  constructor() {
    this.agent = request.agent();
  }

  async request(method: Method, endpoint: string, data?: Record<string, unknown>) {
    // Checking token validity, refreshing it if necessary.

    let promise = this.agent[method](endpoint).accept('application/json').withCredentials();
    const token = this.getToken();
    if (token) {
      promise = promise.set('Authorization', `Bearer ${token}`);
    }

    if (['post', 'put', 'patch'].includes(method) && data) {
      promise = promise.send(data);
    }

    const { body } = await promise;
    return body;
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  updateToken(token: string) {
    return localStorage.setItem(this.tokenKey, token);
  }

  get(endpoint: string) {
    return this.request('get', endpoint);
  }

  post(endpoint: string, data: Record<string, unknown>) {
    return this.request('post', endpoint, data);
  }

  put(endpoint: string, data: Record<string, unknown>) {
    return this.request('put', endpoint, data);
  }

  async login(username: string, password: string) {
    const base64Creds = Buffer.from(`${username}:${password}`).toString('base64');
    const result = await this.agent
      .get('.netlify/functions/users-get-token')
      .accept('application/json')
      .set('Authorization', `Basic ${base64Creds}`)
      .send();

    const token: string | undefined = result.body.token;
    if (token) this.updateToken(token);
    return token;
  }

  logout() {
    this.updateToken('');
  }

  async register(
    username: string,
    password: string,
    firstname: string,
    lastname: string,
    isNikingMarine: boolean,
  ) {
    return this.post('.netlify/functions/users-create', {
      username,
      password,
      firstname,
      lastname,
      isNikingMarine,
    });
  }
}

const client = new Client();

export default client;
