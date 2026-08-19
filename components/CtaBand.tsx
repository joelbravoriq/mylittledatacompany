export default function CtaBand() {
  return (
    <section className="py-20 border-t border-base-800">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl border border-amber/25 bg-gradient-to-br from-base-850 to-base-900 px-8 py-14 sm:px-16 text-center">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-amber/[0.08] blur-[100px]" />
          <div className="relative">
            <h2 className="font-display font-semibold uppercase tracking-tight text-2xl sm:text-3xl text-base-50">
              ¿Listos para dejar de trabajar con datos de hace un año?
            </h2>
            <p className="mt-3 text-base-300 max-w-lg mx-auto">
              Agenda una PoC de 30 minutos y evalúa la calidad y frescura de
              nuestros feeds con tus propios casos de uso.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:hello@mylittledatacompany.com"
                className="inline-flex items-center justify-center rounded-lg bg-amber px-6 py-3 text-sm font-semibold text-base-950 hover:bg-amber-bright transition-colors glow"
              >
                Agendar Demo PoC
              </a>
              <a
                href="#api-daas"
                className="inline-flex items-center justify-center rounded-lg border border-base-600 px-6 py-3 text-sm font-medium text-base-100 hover:border-base-500 hover:bg-base-800/60 transition-colors"
              >
                Ver Documentación
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
