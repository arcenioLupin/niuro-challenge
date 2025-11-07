Niuro – Take-Home FE Tech Test (Next.js + Angular + .NET)

Demostración de sesión por cookie compartida entre múltiples apps (Next.js, Angular User y Angular Admin) con un backend .NET. Incluye flujos de navegación sin re-login, configuración CORS con credenciales y dockerización opcional.

Estructura del repositorio
/backend-dotnet/Niuro.AuthApi     # .NET 8 Minimal API (auth + sesión)
/frontend-nextjs                  # Next.js 14 (hub + login + Resume)
/frontend-angular1                # Angular 17 (User App, standalone)
/frontend-angular2                # Angular 17 (Admin App, standalone)
docker-compose.yml                # Levanta los 4 servicios

Requisitos

.NET 8 SDK

Node.js 20 + npm

Angular CLI 17 (solo si corres Angular fuera de Docker)

Docker y Docker Compose (opcional, para levantar todo en contenedores)

Navegador moderno (Chrome/Edge)

1) Correr localmente (sin Docker)
1.1 Backend (.NET)
cd backend-dotnet/Niuro.AuthApi
dotnet run
# escucha en http://localhost:5272

1.2 Next.js (hub)
cd frontend-nextjs
npm i
npm run dev
# http://localhost:3000

1.3 Angular User (Angular1)
cd frontend-angular1
npm i
ng serve --port 4200
# http://localhost:4200

1.4 Angular Admin (Angular2)
cd frontend-angular2
npm i
ng serve --port 4300
# http://localhost:4300


CORS y cookies ya están configurados en la API para localhost:3000/4200/4300.
En dev, la cookie usa HttpOnly=true, SameSite=Lax, Secure=false.

2) Correr con Docker (plus)

Desde la raíz del repo:

docker compose build
docker compose up -d


Servicios:

API → http://localhost:5272

Next → http://localhost:3000

Angular User → http://localhost:4200

Angular Admin → http://localhost:4300

Las imágenes usan Node 20 (alpine) y Nginx para Angular; .NET 8 oficial para la API.

3) Flujos de prueba (criterios de aceptación)
A) Next.js → Angular User (sin re-login)

Abre http://localhost:3000.

Inicia sesión con OTP 123456 (teléfono cualquiera).

La API setea cookie niuro_session (HttpOnly, SameSite=Lax).

Clic en “Resume Application” → redirige a http://localhost:4200.

En Angular User verás Welcome, User Demo (o el teléfono).

Clic en “Go Back to Home (Next)” → regresa a Next manteniendo sesión.

B) Angular Admin → Angular User (manteniendo sesión)

Abre http://localhost:4300.

Inicia sesión admin con email admin@demo.com / password admin123.

Clic en “Open First Application” → redirige a http://localhost:4200/?adminName=Alice%20Admin.

Angular User muestra Admin: Alice Admin y el Welcome del usuario.

La sesión se mantiene; puedes volver a Next sin re-login.

Verifica en DevTools → Application → Cookies que existe niuro_session.

4) Endpoints de la API

POST /auth/login/next
Body: { phone: string, otp: "123456" }
Efecto: setea cookie niuro_session (usuario rol user).

POST /auth/login/admin
Body: { email: "admin@demo.com", password: "admin123" }
Efecto: setea cookie niuro_session (usuario rol admin).

GET /auth/me
Devuelve 401 si no hay cookie válida; si existe, retorna payload { role, name, ... }.

POST /auth/logout
Borra la cookie y la sesión en memoria.

Notas:

credentials: "include" en todos los fetch/HttpClient.

CORS permite orígenes http://localhost:3000, :4200, :4300 con Allow-Credentials.

5) Decisiones y consideraciones de producción

Sesión por cookie (HttpOnly): protege frente a XSS; en prod debe ir con Secure=true.

SameSite:

En dev usamos Lax (localhost y puertos siguen siendo mismo site).

En prod (dominio único bajo Cloudflare/Azure), Lax funciona si todo vive en el mismo dominio.

Si fueran subdominios distintos, usar SameSite=None + Secure=true.

Dominio único/HTTPS: la consigna indica desplegar bajo el mismo dominio con HTTPS (Cloudflare delante).

CORS: habilitado para frontends de localhost; en prod, restringir a tu dominio.

Persistencia de sesión: para el reto se usa memoria; en prod considerar Redis u otro store.

Seguridad adicional: CSRF tokens si se exponen mutaciones sensibles desde navegadores de terceros.

6) Troubleshooting rápido

No se setea la cookie al loguear:

Verifica credentials: "include" (Next) y el interceptor con withCredentials (Angular).

Revisa que llames a la API 5272 (no 5000).

Confirma que la API imprime Now listening on: http://localhost:5272.

Angular muestra 401 y redirige a Next:

Asegúrate de loguearte en Next antes de ir a Angular User.

Si estás probando directamente Angular User, no tendrá cookie.

CORS error:

Revisa que el origen sea http://localhost:3000/4200/4300 y que la API permita credenciales.

7) Credenciales de demo

OTP (Next login): 123456

Admin (Angular2): admin@demo.com / admin123

8) Scripts útiles (local)
# API
cd backend-dotnet/Niuro.AuthApi && dotnet run

# Next
cd frontend-nextjs && npm run dev

# Angular User
cd frontend-angular1 && ng serve --port 4200

# Angular Admin
cd frontend-angular2 && ng serve --port 4300

9) Roadmap opcional (si hubiera más tiempo)

logout visible en frontends.

Persistir sesión en Redis y agregar expiración.

Tests smoke e2e (Playwright/Cypress) para ambos flujos.

Nginx reverse proxy único en local para simular dominio raíz.

10) Notas de implementación

Angular 17 en modo standalone (sin AppModule).

Interceptor HttpInterceptorFn para withCredentials.

Next.js App Router con página simple (app/page.tsx).

API .NET 8 Minimal API con diccionario en memoria para sesiones.

11) Licencia

Uso exclusivo para evaluación técnica de Niuro.