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

## Issue 3 — Autenticación JWT (en progreso)
- [pendiente de completar tras implementación]

---

## Plantilla para nuevos issues
## Issue N — [nombre]
- Decisión: [qué se decidió]
- Por qué: [razón técnica, no solo "porque sí"]
- Alternativa descartada (si aplica): [qué se consideró y por qué no]