import { Repository } from "../Base/Repository";

export type Token = {
  accessToken: string;
};

class AuthRepository extends Repository {
  endpoint = 'auth'

  login(params: { email: string; password: string; }) {
    this.$axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    return this.$axios.post<Token>(`${this.endpoint}/login`, params)
  }

  logout() {
    return this.$axios.useBearerToken().post(`${this.endpoint}/logout`)
  }
}

export default new AuthRepository()
