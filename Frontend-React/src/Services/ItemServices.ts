import { ItemModel } from '../Models/ItemModel';
import ItemAPILocalService from "./ItemAPILocalService";

class ItemServices extends ItemAPILocalService {
    async getAllItems() {
        const data: any = await this.getAsync('');
        return data;
    }

    async getItem(id: string) {
        const data: any = await this.getAsync(id);
        return data;
    }

    async deleteItem(id: string) {
        const data: any = await this.deleteAsync(id);
        console.log("deleted item response", data);
        return data;
    }
    
    async updateItem(id: string, body: ItemModel) {
        const { data, errors, isSuccess } = await this.putAsync<{ data: any }>(id, body);
        console.log("updated item response", data);
        return data;
    }
   
    async createItem(body: ItemModel) {
        try {
            const data = await this.postAsync<{ data: any }>('', body);
            return data;
            
        } catch (ex) {
            console.log("exxxccception", ex);
        }
    }
}

export default ItemServices;
