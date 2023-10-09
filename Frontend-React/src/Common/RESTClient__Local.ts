import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export class RESTClient__Local {
    private readonly _config: AxiosRequestConfig;

    constructor(public baseURL: string) {
        this._config = {
            baseURL: baseURL 
        };
    }

    async get<T>(url: string, params?: AxiosRequestConfig<any>): Promise<RESTResponse<T>> {
        let result = new RESTResponse<T>();

        try {
            
            const config = params ? { ...params, ...this._config } : this._config;
            const response = await axios.get<any>(url, config);
            result = this.extractObj(response);
        } catch (err) {
            result = this.extractError<T>(err);
        }

        return result;
    }

    async post<T>(url: string, data: any): Promise<RESTResponse<T>> {
        let result = new RESTResponse<T>();

        try {
            
            const response = await axios.post<any>(url, data, this._config);
            result = this.extractObj(response);
        } catch (err) {
            result = this.extractError<T>(err);
        }

        return result;
    }

    async put<T>(url: string, data: any): Promise<RESTResponse<T>> {
        let result = new RESTResponse<T>();

        try {
            
            const response = await axios.put<any>(url, data, this._config);
            result = this.extractObj(response);
        } catch (err) {
            result = this.extractError<T>(err);
        }

        return result;
    }

    async delete<T>(url: string): Promise<RESTResponse<T>> {
        let result = new RESTResponse<T>();

        try {
            
            const response = await axios.delete<any>(url, this._config);
            result = this.extractObj(response);
        } catch (err) {
            result = this.extractError<T>(err);
        }

        return result;
    }

    private extractObj<T>(response: AxiosResponse<any>): RESTResponse<T> {
        const result = new RESTResponse<T>();

        result.data = response.data;
        result.message = response.data.message;
        result.isSuccess = true;
        result.statusCode = response.status;

        return result;
    }

    private extractError<T>(err: any): RESTResponse<T> {
        const result = new RESTResponse<T>();
        const error = err as AxiosError<any, any>;

        result.message = error.message;

        if (error.response) {
            console.log("error.message", error.message)
            result.isSuccess = false;
            result.statusCode = error.response.status;

            if (error.response.data) {
                result.message = error.response.data.message;
                result.data = error.response.data.data;
            }

            const errors: Error[] = [];
            
            console.log("error.response", error)
            if (error.response.data.data && error.response.data.data.errors) {
                for (let [key, value] of Object.entries(error.response.data.data.errors)) {
                    const v = value as string[];
                    errors.push({ key, values: v });
                }
            } else {
                errors.push({ key: error.response.status.toString(), values: [error.response.data] });
            }
            result.errors = errors;
        }

        return result;
    }
}

export interface Error {
    key: string;
    values: string[];
}
export class RESTResponse<T> {
    isSuccess!: boolean;
    statusCode!: number;
    data!: T;
    message!: string;
    errors!: Error[];
}