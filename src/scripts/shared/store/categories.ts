import { ACategory, ICategory } from '../api/CategoryAPI';

export const setCategories = (categories: ACategory): { payload: Array<ICategory>; type: string } => ({
  type: '@categories/set',
  payload: categories.categories,
});
export const deleteCategory = (categoryId: string): { payload: string; type: string } => ({
  type: '@categories/delete',
  payload: categoryId,
});

export const addCategory = (category: ICategory): { payload: ICategory; type: string } => ({
  type: '@categories/add',
  payload: category,
});

export const putCategory = (category: ICategory): { payload: ICategory; type: string } => ({
  type: '@categories/put',
  payload: category,
});

type Actions = ReturnType<typeof setCategories | typeof deleteCategory | typeof addCategory | typeof putCategory>;
export const categories = (state: ACategory['categories'] = [], action: Actions): Array<ICategory> | string | ICategory => {
  if (action.type === '@categories/set') return action.payload;
  if (action.type === '@categories/delete') {
    const categoryIndex = action.payload;
    return state.filter((data) => data._id !== categoryIndex);
  }
  if (action.type === '@categories/add') {
    const data = action.payload as ICategory;
    return state.concat(data);
  }
  if (action.type === '@categories/put') {
    const data = action.payload as ICategory;
    return state.map((item) => {
      if (item._id === data._id) {
        return {
          ...item,
          name: data.name,
          image: data.image,
        };
      }
      return item;
    });
  }
  return state;
};
