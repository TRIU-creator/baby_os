export interface RecipeScaleRequest {
  servings: number;
  baseServings: number;
  ingredients: Record<string, number>;
}

export function scaleRecipe(input: RecipeScaleRequest): Record<string, number> {
  const factor = input.servings / input.baseServings;
  return Object.fromEntries(Object.entries(input.ingredients).map(([name, qty]) => [name, qty * factor]));
}
