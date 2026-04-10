# Ghid de configurare Sanity CMS / Sanity CMS Setup Guide

Acest ghid explică cum să configurezi Sanity Studio pentru Centrul Medical Moșnița și cum să conectezi build-ul Netlify la Sanity.

---

## Pași de configurare / Setup Steps

### 1. Creează un cont Sanity / Create a Sanity account

Accesează [https://www.sanity.io](https://www.sanity.io) și înregistrează-te (gratuit).

### 2. Creează un proiect nou / Create a new project

- Conectează-te la [https://www.sanity.io/manage](https://www.sanity.io/manage)
- Click pe **"New project"**
- Nume proiect: `Centrul Medical Moșnița`
- Dataset: `production`
- Click **"Create project"**

### 3. Notează Project ID-ul / Note the Project ID

Din dashboard-ul Sanity, copiază **Project ID**-ul (un șir alfanumeric scurt, ex. `abc12xyz`).

### 4. Instalează Sanity CLI / Install Sanity CLI

```bash
npm install -g sanity@latest
```

### 5. Intră în folderul sanity/ / Enter the sanity/ folder

```bash
cd sanity
```

### 6. Instalează dependențele / Install dependencies

```bash
npm install
```

### 7. Actualizează Project ID / Update Project ID

Deschide și editează **ambele** fișiere de mai jos, înlocuind `YOUR_PROJECT_ID` cu ID-ul tău real:

- `sanity/sanity.config.js` — linia cu `projectId: 'YOUR_PROJECT_ID'`
- `sanity/sanity.cli.js` — câmpul `projectId: 'YOUR_PROJECT_ID'`

De asemenea, actualizează valoarea implicită din `build.js` (rădăcina proiectului):
- Caută linia cu `process.env.SANITY_PROJECT_ID || 'YOUR_PROJECT_ID'` și înlocuiește `YOUR_PROJECT_ID`.

### 8. Pornește Sanity Studio local / Run Sanity Studio locally

```bash
npm run dev
```

Studio-ul se va deschide la [http://localhost:3333](http://localhost:3333).

### 9. Introdu conținutul / Enter all content

În Sanity Studio, completează toate documentele:

| Document | Conținut |
|----------|----------|
| **Setări site** | Header (titlu, telefoane, navigație), Hero, Despre noi, Contact, Footer |
| **Servicii medicale** | Lista serviciilor (iconița, titlu, descriere) |
| **Medici / Personal** | Fiecare medic cu nume, rol, fotografie |
| **Testimoniale** | Testimonialele pacienților |
| **Galerie foto** | Imaginile din galerie |

> **Notă despre migrarea datelor:** Conținutul existent din fișierele YAML (`content/`) trebuie introdus manual în Sanity Studio o singură dată. Aceasta este o migrare de date unică. Fișierele YAML rămân în repozitor ca referință, dar nu mai sunt folosite de `build.js`.

### 10. Deploy Sanity Studio (opțional) / Deploy Sanity Studio (optional)

```bash
npm run deploy
```

Vei primi o adresă de tipul `https://centru-medical-mosnita.sanity.studio/`.
Actualizează URL-ul din `admin/index.html` dacă adresa diferă.

### 11. Configurează variabilele de mediu în Netlify / Set environment variables in Netlify

În Netlify: **Site Settings → Environment Variables**, adaugă:

| Variabilă | Valoare |
|-----------|---------|
| `SANITY_PROJECT_ID` | ID-ul tău de proiect Sanity |
| `SANITY_DATASET` | `production` |
| `SANITY_TOKEN` | (opțional) token de citire dacă dataset-ul este privat |

### 12. Declanșează un nou deploy Netlify / Trigger a new Netlify deploy

După configurarea variabilelor de mediu, declanșează un nou deploy din Netlify. Build-ul va descărca conținutul din Sanity și va genera `index.html`.

### 13. Configurare CORS / CORS Configuration

În [Sanity project settings](https://www.sanity.io/manage) → **API → CORS origins**, adaugă:

- URL-ul site-ului tău Netlify (ex. `https://your-site.netlify.app`)
- `http://localhost:3333` (pentru dezvoltare locală)

### 14. Invită editori / Invite editors

În [Sanity project settings](https://www.sanity.io/manage) → **Members**, invită editorii de conținut.

---

## Migrarea datelor / Data Migration

Fișierele YAML existente din `content/` conțin tot conținutul curent al site-ului. Acestea **nu mai sunt folosite** de `build.js` după migrarea la Sanity. Procesul de migrare este:

1. Deschide fiecare fișier YAML (`content/site.yml`, `content/services.yml`, `content/doctors.yml`, `content/testimonials.yml`, `content/gallery.yml`)
2. Copiază manual fiecare câmp în documentul corespunzător din Sanity Studio
3. Încarcă imaginile în Sanity (nu se referă la căi locale — Sanity le va gestiona prin CDN-ul propriu)
4. Verifică că toate câmpurile sunt completate corect
5. Declanșează un deploy Netlify și verifică site-ul

---

## Structura proiectului / Project Structure

```
/
├── build.js              # Script de build — acum folosește @sanity/client
├── package.json          # Dependențe: @sanity/client, @sanity/image-url
├── netlify.toml          # Configurare Netlify
├── src/index.html        # Template HTML cu token-uri __PLACEHOLDER__
├── admin/index.html      # Pagină redirect către Sanity Studio
├── content/              # Fișiere YAML (referință — nu mai sunt folosite)
└── sanity/               # Sanity Studio (aplicație separată)
    ├── sanity.config.js  # Configurare Studio
    ├── sanity.cli.js     # Configurare CLI
    ├── package.json      # Dependențe Studio
    └── schemas/
        ├── index.js      # Export toate schemele
        ├── site.js       # Schema setări site
        ├── services.js   # Schema servicii medicale
        ├── doctors.js    # Schema medici
        ├── testimonials.js # Schema testimoniale
        └── gallery.js    # Schema galerie foto
```

---

## Suport / Support

- Documentație Sanity: [https://www.sanity.io/docs](https://www.sanity.io/docs)
- Documentație @sanity/client: [https://www.sanity.io/docs/js-client](https://www.sanity.io/docs/js-client)
- GROQ query language: [https://www.sanity.io/docs/groq](https://www.sanity.io/docs/groq)
