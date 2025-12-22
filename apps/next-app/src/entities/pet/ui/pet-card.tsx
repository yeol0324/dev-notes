import type { components } from "@/shared/generated/openapi";

type Pet = components["schemas"]["Pet"];

interface PetCardProps {
  pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg">{pet.name}</h3>
          {pet.category && (
            <span className="text-sm text-gray-500">{pet.category.name}</span>
          )}
        </div>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            pet.status === "available"
              ? "bg-green-100 text-green-800"
              : pet.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {pet.status}
        </span>
      </div>

      {pet.tags && pet.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {pet.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
