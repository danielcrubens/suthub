export const useApi = () => {
  const fetchRecipes = async () => {
    try {
      const data = await $fetch('https://dummyjson.com/recipes', {
        method: 'GET',
      });
      return data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  };

  return {
    fetchRecipes
  };
};