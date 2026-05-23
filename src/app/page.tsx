import Image from "next/image";
import Link from "next/link";
import CharacterSearch from "@/components/CharacterSearch";
import { getCharactersPage } from "@/lib/rick-and-morty";

export default async function Home() {
  const data = await getCharactersPage(1);

  return (
    <main className="min-h-screen bg-[#07110f] text-white">
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-lime-300">
              Next.js App Router
            </p>
            <h1 className="mt-4 text-5xl font-black leading-tight md:text-7xl">
              Rick and Morty Explorer
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-300">
              Lista principal renderizada en servidor con cache forzado para
              obtener una pagina estatica rapida.
            </p>
          </div>

          <div className="rounded-lg border border-lime-300/30 bg-lime-300/10 p-6">
            <p className="text-5xl font-black text-lime-300">
              {data.info.count}
            </p>
            <p className="mt-2 text-slate-200">personajes disponibles</p>
            <p className="mt-6 text-sm text-slate-300">
              La API pagina hasta 20 resultados por solicitud. Esta pantalla
              muestra la primera pagina con cache forzado.
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.results.map((character) => (
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
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-black group-hover:text-lime-700">
                    {character.name}
                  </h2>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    #{character.id}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {character.status} - {character.species}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {character.location.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CharacterSearch />

    </main>
  );
}
