# Setup: editare din browser (Decap CMS)

Pentru ca cineva să poată edita site-ul din browser, fără Git sau cod, urmează pașii de mai jos.

## 1. Site-ul e deja pe Netlify

- Dacă nu: pune proiectul pe GitHub/GitLab/Bitbucket și conectează-l la Netlify.
- Asigură-te că build-ul reușește: **Build command** = `npm run build`, **Publish directory** = `.` (sunt și în `netlify.toml`).

## 2. Activează Netlify Identity

1. În Netlify: **Site** → **Identity**.
2. Click **Enable Identity**.
3. (Opțional) La **Settings and usage** → **Registration preferences** alege **Invite only** ca doar cei invitați să aibă cont.

## 3. Activează Git Gateway

1. Tot în **Identity**, mergi la **Services**.
2. Găsești **Git Gateway** → click **Enable Git Gateway**.
3. Confirmă. Asta permite CMS-ului să facă commit-uri în repo în numele utilizatorilor autentificați.

## 4. Verifică ramura (branch)

În `admin/config.yml` e setat `branch: main`. Dacă repo-ul tău folosește ramura **master**, schimbă:

```yaml
backend:
  name: git-gateway
  branch: master
```

Apoi salvează și fă push.

## 5. Invită editorii

1. **Identity** → **Invite users**.
2. Introdu adresa de email a persoanei.
3. Trimite invitația.
4. Persoana primește un link, își seteză parola și poate accesa admin-ul.

## 6. Link pentru editori

După ce totul e activ:

- **URL admin:** `https://[numele-site-ului-tau].netlify.app/admin/`
- Editorii deschid acest link, se loghează cu email + parola și editează conținutul; la **Publish** se actualizează site-ul.

---

**Rezumat:** Enable Identity → Enable Git Gateway → Invite users → partajezi link-ul `/admin/`. Nimic de instalat pe PC pentru editori.
