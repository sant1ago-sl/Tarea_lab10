import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#07110f] px-4 text-white">
      <section className="max-w-xl rounded-lg border border-white/10 bg-white/10 p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-lime-300">
          404
        </p>
        <h1 className="mt-3 text-4xl font-black">Personaje no encontrado</h1>
        <p className="mt-4 text-slate-300">
          La ruta solicitada no existe o el personaje no esta disponible en la
          API.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-lime-300 px-5 py-3 font-black text-lime-950 transition hover:bg-lime-200"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
