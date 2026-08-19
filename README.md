# My Little Data Company — Landing Page

Landing page de **My Little Data Company** — *Big Data Power. Zero Corporate BS.*
Construida con **Next.js 14 (App Router) + TypeScript + Tailwind CSS**.

Incluye:
- Hero con placa patente + consola JSON interactiva simulando una respuesta de API en vivo (demo del source vehicular).
- Tabla comparativa "Consultoras Tradicionales vs. MLDC".
- Catálogo de Data Sources (Parque Vehicular, Perfilamiento Financiero/Sociodemográfico, Inmobiliario/Territorial).
- Sección de Industrias con caso de uso y producto DaaS por vertical (Seguros, Banca/Fintech, Automotoras, Logística, Real Estate, Retail).
- Simulador interactivo de PoC / Data Quality Check.
- Sección de Compliance (Ley N° 21.719 / 19.628).
- Sección de servicios de consultoría boutique (Modern Data Stack).
- Footer con badge legal.

---

## 1. Desarrollo local

Requisitos: [Node.js 18+](https://nodejs.org/) instalado.

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## 2. Guardar el código en GitHub

### 2.1. Crear el repositorio local

Desde la carpeta del proyecto (`mylittledatacompany/`):

```bash
git init
git add .
git commit -m "Initial commit: MLDC landing page"
```

### 2.2. Crear el repositorio en GitHub

1. Ve a [github.com/new](https://github.com/new).
2. Nombre del repo: `mylittledatacompany` (puede ser público o privado, ambos funcionan gratis con Vercel).
3. **No** marques "Add a README" (ya tienes uno local) para evitar conflictos.
4. Clic en **Create repository**.

### 2.3. Subir tu código

GitHub te mostrará los comandos, pero en resumen:

```bash
git branch -M main
git remote add origin https://github.com/TU_USUARIO/mylittledatacompany.git
git push -u origin main
```

---

## 3. Deploy gratis en Vercel (recomendado — 2 minutos)

Vercel es la empresa creadora de Next.js, por lo que el soporte es nativo y el plan gratuito (Hobby) es más que suficiente para esta landing.

### 3.1. Crear cuenta

1. Ve a [vercel.com/signup](https://vercel.com/signup).
2. Elige **Continue with GitHub** y autoriza el acceso.

### 3.2. Importar el proyecto

1. En el dashboard de Vercel, clic en **Add New… → Project**.
2. Selecciona el repositorio `mylittledatacompany` de la lista.
3. Vercel detecta automáticamente que es un proyecto **Next.js** — no necesitas tocar el Build Command ni el Output Directory, quedan por defecto:
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`
4. Clic en **Deploy**.

En ~1-2 minutos tendrás una URL pública tipo `mylittledatacompany.vercel.app` con tu landing ya online.

> Alternativa: **Netlify** — el flujo es idéntico ([app.netlify.com](https://app.netlify.com)): "Add new site → Import an existing project → GitHub", seleccionas el repo, y Netlify autodetecta Next.js usando su plugin oficial `@netlify/plugin-nextjs`. Build command: `next build`, Publish directory: `.next`.

### 3.3. Deploys automáticos

A partir de ahora, cada `git push` a `main` dispara un nuevo deploy automáticamente. Los Pull Requests generan *preview deployments* con su propia URL para revisar cambios antes de fusionarlos.

---

## 4. Conectar tu dominio de Namecheap (mylittledatacompany.com)

### 4.1. Agregar el dominio en Vercel

1. En tu proyecto dentro de Vercel, ve a **Settings → Domains**.
2. Escribe `mylittledatacompany.com` y clic en **Add**.
3. Vercel te ofrecerá agregar también `www.mylittledatacompany.com` con un redirect automático hacia el dominio raíz (o viceversa) — acepta la sugerencia por defecto.
4. Vercel te mostrará los registros DNS que debes configurar. Normalmente son:

   | Tipo  | Host / Name | Valor / Target        |
   |-------|-------------|------------------------|
   | A     | `@`         | `76.76.21.21`           |
   | CNAME | `www`       | `cname.vercel-dns.com`  |

   > Los valores exactos siempre se muestran en tu panel de Vercel al agregar el dominio — usa esos, ya que pueden variar.

### 4.2. Configurar los DNS en Namecheap

1. Entra a [ap.www.namecheap.com](https://ap.www.namecheap.com/) → **Domain List** → clic en **Manage** junto a `mylittledatacompany.com`.
2. Ve a la pestaña **Advanced DNS**.
3. Asegúrate de que **Namecheap BasicDNS** esté activo (no uses "Namecheap FreeDNS" con host de terceros si quieres usar sus propios nameservers — el flujo por defecto de un dominio recién comprado ya sirve).
4. En **Host Records**, agrega/edita:

   - **Registro A**
     - Type: `A Record`
     - Host: `@`
     - Value: `76.76.21.21` (o el valor exacto que te dio Vercel)
     - TTL: `Automatic`

   - **Registro CNAME** (para el subdominio `www`)
     - Type: `CNAME Record`
     - Host: `www`
     - Value: `cname.vercel-dns.com.` (con el punto final si Namecheap lo requiere)
     - TTL: `Automatic`

5. Elimina cualquier registro `A` o `CNAME` preexistente en `@` o `www` que apunte a un "parking page" de Namecheap (suelen venir por defecto en dominios nuevos).
6. Guarda los cambios (ícono de check verde ✅ junto a cada fila).

### 4.3. Esperar propagación y verificar

- La propagación de DNS puede tardar entre 10 minutos y 24-48 horas (normalmente es rápida, <1h).
- En el panel de Vercel (**Settings → Domains**), el estado pasará de "Invalid Configuration" a **"Valid Configuration"** automáticamente.
- Vercel emite un certificado **SSL/HTTPS gratuito** (Let's Encrypt) de forma automática una vez verificado el dominio — no necesitas hacer nada adicional.
- Puedes verificar la propagación en [dnschecker.org](https://dnschecker.org) buscando `mylittledatacompany.com`.

### 4.4. (Opcional) Usar los Nameservers de Vercel en vez de registros A/CNAME

Si prefieres delegar el DNS completo a Vercel (más simple de mantener a futuro):

1. En Namecheap, en la pestaña principal del dominio (no "Advanced DNS"), busca **Nameservers**.
2. Cambia de "Namecheap BasicDNS" a **Custom DNS**.
3. Ingresa los nameservers que Vercel te indique (ej. `ns1.vercel-dns.com`, `ns2.vercel-dns.com`).
4. Guarda. Esto delega toda la gestión DNS a Vercel, incluyendo registros MX si usas correo con otro proveedor (deberás recrearlos ahí).

---

## 5. Checklist final

- [ ] `npm run build` corre sin errores localmente.
- [ ] Repo subido a GitHub.
- [ ] Proyecto importado y deployado en Vercel.
- [ ] Dominio `mylittledatacompany.com` agregado en Vercel.
- [ ] Registros A/CNAME configurados en Namecheap.
- [ ] Estado "Valid Configuration" en Vercel y candado HTTPS activo en el navegador.

---

## Stack técnico

- **Framework:** Next.js 14 (App Router, Server Components + Client Components para interactividad)
- **Estilos:** Tailwind CSS (dark mode, paleta custom `accent`/`base`)
- **Tipografías:** Inter (UI) + JetBrains Mono (consola JSON / código)
- **Hosting sugerido:** Vercel (gratis, Hobby plan)
- **DNS:** Namecheap
