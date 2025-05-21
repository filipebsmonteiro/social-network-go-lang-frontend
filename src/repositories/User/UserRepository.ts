import { Repository } from "../Base/Repository";

export type User = {
  id: string;
  name: string;
  nick: string;
  email: string;
  password: string;
};

class UserRepository extends Repository<User> {
  endpoint = 'users'

  followers (id: string) {
    return this.$axios.useBearerToken().get<User[]>(`${this.endpoint}/${id}/followers`)
  }

  following (id: string) {
    return this.$axios.useBearerToken().get<User[]>(`${this.endpoint}/${id}/following`)
  }

  follow (id: string) {
    return this.$axios.useBearerToken().post(`${this.endpoint}/${id}/follow`)
  }

  unFollow (id: string) {
    return this.$axios.useBearerToken().post(`${this.endpoint}/${id}/unfollow`)
  }
  
}

export default new UserRepository()
