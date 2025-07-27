export type MainCategoryDataUsedInForm = {
  id: number;
  name: string;
  subCategories: {
    id: number;
    name: string;
  }[];
};
