import { CategoryAPI, ACategory } from './CategoryAPI';

const categoryAPI = new CategoryAPI();

export const getCategories = async (): Promise<ACategory> => categoryAPI.getList().then((response) => response.json());
