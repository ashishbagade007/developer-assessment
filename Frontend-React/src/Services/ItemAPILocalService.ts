import { AxiosRequestConfig } from 'axios';
import { RESTClient__Local, RESTResponse } from '../Common/RESTClient__Local';
// Import the JSON data using require (CommonJS syntax)
const config = require('../../src/config.json');

abstract class ItemAPILocalService {
    private readonly _client: RESTClient__Local;

    constructor() {
        const baseURL = config.Enviroment.dev.BASE_API_URL ?? '';
        console.log("config json baseURL", baseURL)
        this._client = new RESTClient__Local(baseURL);
    }

    protected async getAsync<T>(url: string, params?: AxiosRequestConfig<any>): Promise<RESTResponse<T>> {
        const response = await this._client.get<T>(url, params);
        return response;
    }

    protected async postAsync<T>(url: string, data: any): Promise<RESTResponse<T>> {
        const response = await this._client.post<T>(url, data);
        return response;
    }

    protected async putAsync<T>(url: string, data: any): Promise<RESTResponse<T>> {
        const response = await this._client.put<T>(url, data);
        return response;
    }

    protected async deleteAsync<T>(url: string): Promise<RESTResponse<T>> {
        const response = await this._client.delete<T>(url);
        return response;
    }    
}

export default ItemAPILocalService;