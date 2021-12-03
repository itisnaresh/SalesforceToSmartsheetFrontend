import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

let loginHeaders = new Headers();
loginHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

@Injectable({ providedIn: 'root' })


export class ApiHttpService {
    constructor(
        private http: HttpClient
    ) { }

    public get(url: string) {
        return this.http.get(url, {
            withCredentials: true
        });
    }
    public post(url: string, data: any) {
        return this.http.post(url, data, {
            withCredentials: true
        });
    }
    public put(url: string, data: any) {
        return this.http.put(url, data, {
            withCredentials: true
        });
    }
    public delete(url: string, options?: any) {
        return this.http.delete(url, options);
    }
}
