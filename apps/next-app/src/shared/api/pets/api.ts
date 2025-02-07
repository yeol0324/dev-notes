import type { components, operations } from "@/shared/generated/openapi";
import { fetcher } from "../client";

type Pet = components["schemas"]["Pet"];
type PetStatus = "available" | "pending" | "sold";

export const petsApi = {
  findByStatus: async (status: PetStatus): Promise<Pet[]> => {
    return fetcher<Pet[]>(`/pet/findByStatus?status=${status}`);
  },

  getById: async (petId: number): Promise<Pet> => {
    return fetcher<Pet>(`/pet/${petId}`);
  },
};
