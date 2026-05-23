import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCharacterById,
  TOTAL_CHARACTER_IDS,
} from "@/lib/rick-and-morty";

interface CharacterPageProps {
  params: Promise<{
    id: string;
  }>;
}

export const revalidate = 864000;

export async function generateStaticParams() {
  return Array.from({ length: TOTAL_CHARACTER_IDS }, (_, index) => ({
    id: (index + 1).toString(),
  }));
}

export async function generateMetadata({
  params,
}: CharacterPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const character = await getCharacterById(id);
    return {
      title: `${character.name} - Rick and Morty`,
      description: `Detalle del personaje ${character.name}`,
    };
  } catch {
    return {
      title: "Personaje no encontrado",
    };
  }
}

function getStatusClass(status: string) {
  if (status === "Alive") return "bg-lime-400 text-lime-950";
  if (status === "Dead") return "bg-red-500 text-white";
  return "bg-slate-500 text-white";
}

function getEpisodeId(episodeUrl: string) {
  return episodeUrl.split("/").pop();
}

export default async function CharacterDetail({ params }: CharacterPageProps) {
  const { id } = await params;

  let character;

  try {
    character = await getCharacterById(id);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#07110f] px-4 py-10 text-white">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-lg border border-white/10 bg-white text-slate-950 shadow-2xl">
        <div className="grid lg:grid-cols-[420px_1fr]">
          <div className="bg-gradient-to-br from-lime-300 via-cyan-300 to-violet-500 p-8">
            <Link
              href="/"
              className="inline-block rounded-full bg-black/80 px-4 py-2 text-sm font-bold text-white transition hover:bg-black"
            >
              Volver al inicio
            </Link>
            <Image
              src={character.image}
              alt={character.name}
              width={300}
              height={300}
              className="mx-auto mt-8 aspect-square w-full max-w-[300px] rounded-lg object-cover shadow-2xl"
              priority
            />
          </div>

          <div className="p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-lime-700">
                  Character #{character.id}
                </p>
                <h1 className="mt-2 text-4xl font-black md:text-5xl">
                  {character.name}
                </h1>
              </div>
              <span
                className={`w-fit rounded-full px-4 py-2 text-sm font-black ${getStatusClass(
                  character.status,
                )}`}
              >
                {character.status}
              </span>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Info label="Species" value={character.species} />
              <Info label="Type" value={character.type || "Sin tipo"} />
              <Info label="Gender" value={character.gender} />
              <Info label="Origin" value={character.origin.name} />
              <Info label="Last location" value={character.location.name} />
              <Info label="Created" value={new Date(character.created).toLocaleDateString("es-PE")} />
              <Info label="Origin URL" value={character.origin.url || "Sin URL"} />
              <Info label="Location URL" value={character.location.url || "Sin URL"} />
              <Info label="API URL" value={character.url} />
              <Info label="Image URL" value={character.image} />
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-black">Episodes</h2>
              <p className="mt-2 text-slate-600">
                Aparece en {character.episode.length} episodio(s).
              </p>
              <div className="mt-4 flex max-h-52 flex-wrap gap-2 overflow-auto rounded-lg bg-slate-100 p-4">
                {character.episode.map((episodeUrl) => (
                  <span
                    key={episodeUrl}
                    className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-700 shadow-sm"
                  >
                    Episodio {getEpisodeId(episodeUrl)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-100 p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 break-words font-bold text-slate-900">{value}</p>
    </div>
  );
}
