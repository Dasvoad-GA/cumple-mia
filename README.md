# Tarjeta "Mis 15 Años" — despliegue

Directorio listo para desplegar en Vercel. Contenido: `index.html`, `styles.css`, `config.js`, `app.js`, `images/`.

Instrucciones rápidas:

- Deploy inmediato desde CLI (sin crear repo remoto):

```bash
cd path/to/cumple-mia
npx vercel --prod
```

- Si prefieres usar GitHub + Vercel:

```bash
cd path/to/cumple-mia
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

Luego en Vercel, crea un nuevo proyecto vinculando ese repo y usa la rama `main`. No requiere build command; es un sitio estático.
