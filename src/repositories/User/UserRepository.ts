import { Repository } from "../Base/Repository";

export type User = {
  id: number;
  name: string;
  nick: string;
  email: string;
  password: string;
};

class UserRepository extends Repository<User> {
  endpoint = 'users'

  followers (id: number | string) {
    return this.$axios.useBearerToken().get<User[]>(`${this.endpoint}/${id}/followers`)
  }

  following (id: number | string) {
    return this.$axios.useBearerToken().get<User[]>(`${this.endpoint}/${id}/following`)
  }

  follow (id: number | string) {
    return this.$axios.useBearerToken().post(`${this.endpoint}/${id}/follow`)
  }

  unFollow (id: number | string) {
    return this.$axios.useBearerToken().post(`${this.endpoint}/${id}/unfollow`)
  }

  posts (id: number | string) {
    return this.$axios.useBearerToken().get(`${this.endpoint}/${id}/posts`)
  }
}

export default new UserRepository()
