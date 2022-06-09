import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  api = 'http://localhost:8080';

  createEntry(entry: any) {
    const query = {
      query: `
        mutation {
          createPost(title: "${entry.title}", content: "${entry.content}") {
          _id
          title
          content
          user_id
          }
        }
      `
    }

    return this.http.post<any>(`${this.api}/graphql`, query);
  }

  loadAll() {
    const query = {
      query: `
      query {
       posts {
          _id
          title
          content
        }
      }
      `
    }
    return this.http.post<any>(`${this.api}/graphql`, query);
  }

  deleteOne(_id: any) {
    const query = {
      query: `
      mutation {
        deletePost(_id: "${_id}") {
          _id
        }
      }
      `
    }
    return this.http.post<any>(`${this.api}/graphql`, query);
  }

  signUpUser(userData: any) {
    const query = {
      query: `
      mutation {
        createUser(userData: { name: "${userData.name}", password: "${userData.password}" , email: "${userData.email}" }) {
        _id
        }
      }
      `
    }
    return this.http.post<any>(`${this.api}/graphql`, query);
  }

  login(loginData: any) {
    const query = {
      query: `
      query {
        login(email: "${loginData.email}", password: "${loginData.password}" ) {
          _id
          token
        }
      }`
    }
    return this.http.post<any>(`${this.api}/graphql`, query);
  }


}
