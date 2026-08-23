# MH Prueba Técnica — E-commerce Angular

SPA de e-commerce consumiendo [Fake Store API](https://fakestoreapi.com), desarrollada como prueba técnica para posición híbrida Angular-Laravel. Autenticación JWT real, catálogo con filtro por categoría, carrito reactivo con persistencia, y guards de rutas protegidas.

🌐 [Demo en vivo](https://mh-prueba-tecnica.vercel.app/catalog) · 📦 Prueba técnica — Agosto 2026 · 📝 [GitHub Project](https://github.com/users/manuelhm1993/projects/13) · ⛓️ [GitHub Repository](https://github.com/manuelhm1993/mh-prueba-tecnica)

---

### Stack tecnológico 💻

![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![RxJS](https://img.shields.io/badge/rxjs-%23B7178C.svg?style=for-the-badge&logo=reactivex&logoColor=white) ![SCSS](https://img.shields.io/badge/sass-%23CC6699.svg?style=for-the-badge&logo=sass&logoColor=white) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

<details>
<summary>Ranking por uso 📈</summary>

| Ranking | Tecnología |
|--------:|------------|
| 1 | **Angular 21** (standalone components) |
| 2 | **TypeScript** |
| 3 | **Signals** (estado reactivo de sesión y carrito) |
| 4 | RxJS (HttpClient, interceptores) |
| 5 | SCSS |
| 6 | Docker (entornos efímeros de desarrollo) |
| 7 | Fake Store API |
| 8 | Vercel (deploy) |
| 9 | Git / GitHub |

</details>

---

## Funcionalidades ✨

- **Autenticación real** contra `POST /auth/login` — persistencia de sesión en `localStorage`, interceptor de token automático, logout forzado en cualquier `401`.
- **Catálogo** con filtro por categoría (tabs en desktop, selector en mobile), vista de detalle por producto, skeleton loading.
- **Carrito reactivo** con Signals — agregar, incrementar, decrementar, eliminar, vaciar. Contador en vivo en el header. Persistencia en `localStorage`, sobrevive a refresh.
- **Rutas protegidas**: `/cart` requiere sesión activa (guard funcional); el catálogo es navegable como invitado.
- **Arquitectura de layouts**: `AuthLayout` (sin navegación, solo login) y `MainLayout` (header + footer, sticky footer vía flexbox).
- **Lazy loading** en dos niveles: por layout y por feature — cada ruta es su propio chunk JS.
- **Branding propio**: paleta de colores, tipografías (Chakra Petch + Inter) self-hosted, logo real, favicon SVG.
- **Responsive** sin librería de UI — grid nativo, media queries puntuales, selector de categoría en mobile.

---

## Setup local ⚙️

**Requisitos:** Docker + WSL2/Ubuntu (proyecto vive en el filesystem nativo de Linux, nunca en `/mnt/c/`) — no requiere Node ni Angular CLI instalados en el host.

```bash
git clone https://github.com/manuelhm1993/mh-prueba-tecnica.git
cd mh-prueba-tecnica
```

Instalar dependencias vía contenedor efímero:
```bash
docker run --rm -it -u $(id -u):$(id -g) -v $(pwd):/app -w /app node:22.22.0-slim npm install
```

Levantar servidor de desarrollo:
```bash
docker run --rm -it -p 4200:4200 -u $(id -u):$(id -g) -v $(pwd):/app -w /app node:22.22.0-slim npx ng serve --host 0.0.0.0
```

App disponible en `http://localhost:4200`.

> Si prefieres Node/Angular CLI instalados directo en el host: `npm install` y `npx ng serve` funcionan igual, sin Docker.

---

## Variables de entorno 🔑

No requiere `.env` — `src/environments/environment.ts` (producción) y `environment.development.ts` (dev, vía `ng serve`) ya apuntan a la API pública:

```typescript
export const environment = {
  production: true, // false en development.ts
  apiUrl: 'https://fakestoreapi.com',
};
```

---

## Credenciales de prueba 🔐

Fake Store API valida contra usuarios reales de su propia base — no acepta credenciales inventadas. El login viene precargado con un usuario válido y ofrece un selector con más opciones reales (fetch en vivo a `GET /users`):

```
usuario: johnd
password: m38rmF$
```

---

## Estructura del proyecto 📁

```
src/app/
├── core/
│   ├── guards/          # authGuard (protege /cart)
│   ├── interceptors/    # authInterceptor, errorInterceptor
│   ├── models/           # Product, CartItem, LoginRequest, FakeStoreUser...
│   └── services/         # AuthService, CartService, ProductService, UsersService
├── features/
│   ├── auth/login/       # Formulario de login
│   ├── catalog/           # product-list, product-detail
│   └── cart/cart-page/    # Vista del carrito
├── layouts/
│   ├── auth-layout/       # Sin navegación — solo login
│   └── main-layout/       # Header + footer, sticky footer
└── shared/components/
    └── not-found/         # Página 404
```

---

## Decisiones técnicas 🧠

Registro completo, issue por issue, en [`docs/decisiones.md`](docs/decisiones.md). Resumen de las decisiones de mayor peso:

- **Standalone components**, sin NgModules — dirección oficial de Angular 17+, menor curva de entrada.
- **Signals** como mecanismo de estado (sesión y carrito) — reactividad sin RxJS explícito en los componentes; RxJS se reserva para el flujo de `HttpClient` e interceptores, donde sí aporta (operadores, cancelación).
- **Interceptores y guards funcionales** (`HttpInterceptorFn`, `CanActivateFn`), no basados en clases — coherente con el enfoque standalone-first.
- **Filtrado de catálogo server-side** (`/products/category/{cat}`), no client-side — más fiel a un patrón real de backend con paginación.
- **Guard de `/cart` protege la ruta, no la acción** de agregar productos — patrón estándar de e-commerce (carrito de invitado, login exigido solo al querer verlo).
- **Persistencia en `localStorage`** para sesión y carrito, ambos inicializados directo en la declaración del Signal — sobreviven a un refresh sin lógica de restauración aparte.
- **Vista de detalle de producto** agregada fuera del checklist original — decisión de scope tomada en desarrollo para enriquecer la experiencia de catálogo.
- **Tipografías self-hosted** (Chakra Petch + Inter, variable font) en vez de CDN de Google Fonts — sin dependencia externa en runtime, mejor performance.

---

## Deploy 🚀

Desplegado en **Vercel**, conectado directo al repositorio de GitHub — build y deploy automático en cada push a `master`.

Build de producción:
```bash
docker run --rm -it -u $(id -u):$(id -g) -v $(pwd):/app -w /app node:22.22.0-slim npx ng build
```

> El fallback de rutas para SPA (necesario para que refrescar en una ruta profunda como `/catalog/1` no devuelva 404) lo maneja Vercel automáticamente al detectar un proyecto Angular — sin configuración adicional de `.htaccess` o rewrites manuales.

---

## Flujo de trabajo 🔄

Desarrollo en un único sprint, issues con checklist en [GitHub Projects](https://github.com/manuelhm1993/mh-prueba-tecnica/issues), ramas por feature, PRs con merge a `master`.

### Convención de ramas

| Prefijo | Uso |
|---------|-----|
| `feature/` | Nueva funcionalidad |
| `fix/` | Corrección de bug |
| `chore/` | Mantenimiento, configs, documentación |

### Commits semánticos (español)

`feat:` `fix:` `refactor:` `chore:` `docs:` `style:`

---

## Colección Postman 📬

Endpoints documentados en [`postman/mh-prueba-tecnica.postman_collection.json`](postman/mh-prueba-tecnica.postman_collection.json) — importable directo en Postman/VS Code.

---

Desarrollado por [Manuel Henriquez](https://mhenriquez.com) · Maracaibo, Venezuela