import { Repository } from "../Base/Repository";

export type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorNick: string;
  likes: number;
  createdAt: string
};

class PostRepository extends Repository<Post> {
  endpoint = 'posts'

  like (id: number) {
    return this.$axios.useBearerToken().post(`${this.endpoint}/${id}/like`)
  }

  unlike (id: number) {
    return this.$axios.useBearerToken().post(`${this.endpoint}/${id}/unlike`)
  }
}

export default new PostRepository()
