"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Character,
  CharacterFilters,
  CharacterListResponse,
} from "@/types/rick-and-morty";
import { buildCharacterSearchUrl } from "@/lib/rick-and-morty";

const emptyFilters: CharacterFilters = {
  name: "",
  status: "",
  type: "",
  gender: "",
};

export default function CharacterSearch() {
  const [filters, setFilters] = useState<CharacterFilters>(emptyFilters);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Escribe o selecciona filtros.");

  const searchUrl = useMemo(() => buildCharacterSearchUrl(filters), [filters]);

  useEffect(() => {
    const controller = new AbortController();
    const hasFilters = Object.values(filters).some((value) => value.trim());

    if (!hasFilters) {
      setCharacters([]);
      setMessage("Escribe o selecciona filtros.");
      setLoading(false);
      return;
    }

    async function searchCharacters() {
      setLoading(true);
      setMessage("");

      try {
        const res = await fetch(searchUrl, {
          signal: controller.signal,
        });

        if (res.status === 404) {
          setCharacters([]);
          setMessage("No se encontraron personajes con esos filtros.");
          return;
        }

        if (!res.ok) {
          throw new Error("No se pudo buscar personajes");
        }

        const data: CharacterListResponse = await res.json();
        setCharacters(data.results);
        setMessage(`${data.info.count} resultado(s) encontrados.`);
      } catch (error) {
        if (!controller.signal.aborted) {
          setCharacters([]);
          setMessage("Ocurrio un error durante la busqueda.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    const timeout = window.setTimeout(searchCharacters, 350);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [filters, searchUrl]);

  function updateFilter(key: keyof CharacterFilters, value: string) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <section className="border-y border-white/10 bg-black/25 py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-lime-300">
              CSR en tiempo real
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">
              Busqueda de personajes
            </h2>
          </div>
          <p className="max-w-xl text-sm text-slate-300">
            Usa useState y useEffect para consultar la API desde el cliente por
            name, status, type y gender.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <input
            value={filters.name}
            onChange={(event) => updateFilter("name", event.target.value)}
            placeholder="name: rick"
            className="rounded-lg border border-white/10 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-lime-300"
          />

          <select
            value={filters.status}
            onChange={(event) => updateFilter("status", event.target.value)}
            className="rounded-lg border border-white/10 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-lime-300"
          >
            <option value="">status</option>
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
            <option value="unknown">unknown</option>
          </select>

          <input
            value={filters.type}
            onChange={(event) => updateFilter("type", event.target.value)}
            placeholder="type: parasite"
            className="rounded-lg border border-white/10 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-lime-300"
          />

          <select
            value={filters.gender}
            onChange={(event) => updateFilter("gender", event.target.value)}
            className="rounded-lg border border-white/10 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-lime-300"
          >
            <option value="">gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="genderless">Genderless</option>
            <option value="unknown">unknown</option>
          </select>
        </div>

        <div className="mt-6 min-h-6 text-sm font-semibold text-lime-200">
          {loading ? "Buscando..." : message}
        </div>

        {characters.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {characters.map((character) => (
              <Link
                key={character.id}
                href={`/character/${character.id}`}
                className="group overflow-hidden rounded-lg bg-white text-slate-950 shadow-xl transition hover:-translate-y-1 hover:shadow-lime-500/30"
              >
                <Image
                  src={character.image}
                  alt={character.name}
                  width={300}
                  height={300}
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold group-hover:text-lime-700">
                    {character.name}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {character.status} - {character.species}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
