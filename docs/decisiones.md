# Decisiones Técnicas — MH Prueba Técnica E-commerce

Registro vivo de decisiones tomadas durante el desarrollo, issue por issue.
Este archivo alimenta el resumen de decisiones técnicas del README final.

---

## Issue 1 — Setup y arquitectura base
- **Standalone components** (sin NgModules): menor curva de entrada, es el
  default y la dirección oficial de Angular desde v17+.
- Estructura de carpetas: `core/` (services, guards, interceptors, models),
  `features/` (auth, catalog, cart), `layouts/` (auth-layout, main-layout),
  `shared/` (componentes reutilizables).
- Angular CLI resuelto localmente vía `npx` dentro de contenedores efímeros
  (Docker + WSL2), nunca instalación global — coherente con el patrón de
  aislamiento ya usado en otros proyectos de la organización MHenriquez.

## Issue 2 — Layouts y routing
- Dos layouts standalone (`AuthLayout` sin header/footer, `MainLayout` con
  header/footer) cargados vía `loadComponent` en la raíz de rutas.
- Cada feature (`auth`, `catalog`, `cart`) tiene su propio `*.routes.ts` con
  `loadChildren` — doble nivel de code-splitting (layout + feature).
- Redirect de raíz (`''` → `catalog`) como entrada independiente y PRIMERA
  en el array de rutas, con `pathMatch: 'full'` — evita que el bloque de
  `AuthLayout` (también con `path: ''`) capture el segmento vacío antes de
  que el redirect se evalúe.
- Ruta `**` (wildcard) al final del array para página 404.

## Issue 3 — Autenticación JWT
- Login real contra `POST /auth/login` de Fake Store API. Credenciales
  válidas deben existir en `GET /users` — la API rechaza usuarios
  inventados (confirmado contra la documentación oficial).
- `AuthService` con Signals: `tokenSignal`/`profileSignal` inicializados
  leyendo `localStorage` directo — sesión persiste sola al recargar,
  sin lógica de restauración aparte.
- Interceptores funcionales (`HttpInterceptorFn`), no basados en clases —
  coherente con standalone. `authInterceptor` inyecta Bearer token;
  `errorInterceptor` fuerza logout en cualquier 401.
- Guard funcional (`CanActivateFn`) protegiendo `/cart` — sin sesión,
  redirige a `/login` antes de activar la ruta.
- Nota: el JWT que devuelve Fake Store API es mock — el payload interno
  no siempre coincide con el usuario que hizo login (API de testing,
  no producción real). No afecta el flujo de la app.
- Selector de usuarios de prueba en el login: fetch real a `GET /users`
  (via `UsersService` nuevo), clic en un usuario reescribe el form.
  Registro local (`registerLocal()` en `AuthService`) queda implementado
  pero sin UI — candidato de plus si sobra tiempo, no requisito.

## Issue 4 — Catálogo de productos
- `ProductService`: filtrado por categoría vía endpoint dedicado de la API
  (`/products/category/{cat}`), no filtrado client-side — más fiel a un
  patrón real de backend con paginación/filtrado server-side.
- Grid responsivo nativo (`repeat(auto-fill, minmax(...))`) sin media
  queries — se adapta solo a cualquier viewport.
- Skeleton loading con shimmer CSS puro durante la carga de productos.
- Pendiente para Issue 6: estilizar el scroll horizontal de los tabs de
  categoría (funcional, falta pulido visual).

## Issue 5 — Carrito de compras (incluye vista de detalle, scope extendido)
- `CartService` con Signals: `itemsSignal` inicializado leyendo `localStorage`
  directo — mismo patrón que `AuthService` con el token, carrito persiste
  solo al recargar.
- `totalItems`/`totalPrice` como `computed()` — se recalculan automáticos,
  sin refresh manual desde ningún componente.
- Único punto de escritura (`updateItems()`) centraliza signal.set() +
  persistencia — evita que un método nuevo olvide guardar en localStorage.
- `decrement()` con guarda: si la cantidad llega a 0, elimina la línea en
  vez de dejar un `quantity: 0` — evita estado inválido en el carrito.
- Vista de detalle de producto (`/catalog/:id`) agregada dentro de este
  issue, fuera del checklist original de Issue 4 — decisión de scope
  tomada en desarrollo, no requisito explícito del enunciado.
- Pendiente para Issue 6: responsivo de `cart-item` en viewports < 480px
  (funcional, falta pulido en mobile angosto).

---

## Plantilla para nuevos issues
## Issue N — [nombre]
- Decisión: [qué se decidió]
- Por qué: [razón técnica, no solo "porque sí"]
- Alternativa descartada (si aplica): [qué se consideró y por qué no]