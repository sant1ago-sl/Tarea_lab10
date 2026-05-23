import {
  Character,
  CharacterFilters,
  CharacterListResponse,
} from "@/types/rick-and-morty";

const API_URL = "https://rickandmortyapi.com/api/character";
export const TEN_DAYS = 60 * 60 * 24 * 10;
export const TOTAL_CHARACTER_IDS = 826;

export async function getCharactersPage(
  page = 1,
): Promise<CharacterListResponse> {
  const res = await fetch(`${API_URL}?page=${page}`, {
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error("No se pudo cargar la lista de personajes");
  }

  return res.json();
}

export async function getAllCharacters(): Promise<Character[]> {
  const ids = Array.from(
    { length: TOTAL_CHARACTER_IDS },
    (_, index) => index + 1,
  );
  const chunks: number[][] = [];

  for (let index = 0; index < ids.length; index += 100) {
    chunks.push(ids.slice(index, index + 100));
  }

  const responses = await Promise.all(
    chunks.map(async (chunk) => {
      const res = await fetch(`${API_URL}/${chunk.join(",")}`, {
        next: { revalidate: TEN_DAYS },
      });

      if (!res.ok) {
        throw new Error("No se pudo cargar el total de personajes");
      }

      const data: Character[] | Character = await res.json();
      return Array.isArray(data) ? data : [data];
    }),
  );

  return responses.flat();
}

export async function getCharacterById(id: string): Promise<Character> {
  const characters = await getAllCharacters();
  const character = characters.find((item) => item.id.toString() === id);

  if (!character) {
    throw new Error("Personaje no encontrado");
  }

  return character;
}

export function buildCharacterSearchUrl(filters: CharacterFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    const cleanValue = value.trim();
    if (cleanValue) params.set(key, cleanValue);
  });

  const query = params.toString();
  return query ? `${API_URL}?${query}` : API_URL;
}
