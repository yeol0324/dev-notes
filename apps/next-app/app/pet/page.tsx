"use client";

import { useState, useEffect } from "react";
import type { components } from "@/shared/generated/openapi";
import { petsApi } from "@/shared/api/pets/api";
import { PetCard } from "@/entities/pet/ui/pet-card";

type Pet = components["schemas"]["Pet"];
type PetStatus = "available" | "pending" | "sold";

export default function Page() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<PetStatus>("available");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await petsApi.findByStatus(status);
        setPets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch pets");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [status]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pet Store</h1>

      <div className="mb-6 flex gap-2">
        {(["available", "pending", "sold"] as PetStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              status === s
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading pets...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {pets.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No pets found with status: {status}
            </p>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                Found {pets.length} {pets.length === 1 ? "pet" : "pets"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pets.map((pet, index) => (
                  <PetCard key={`${pet.id}${index}`} pet={pet} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
