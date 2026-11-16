# Chez Marc : infos à demander à Marc

Le site est en ligne avec ce qu'on a pu vérifier (fiche Google, carte affichée en vitrine, Instagram). Voici ce qui manque ou reste à confirmer, et où le mettre.

## À demander

1. **Son prénom complet et l'histoire du restaurant** : depuis quand il est rue des Volontaires, le nom de son village (lu « Mehmarch » sur la vitrine, à vérifier), s'il veut qu'on le cite. → `locales/*.json` (story)
2. **La carte complète et les prix** : relevés sur la photo de la vitrine (novembre 2026). À vérifier en priorité : menu découverte (59,90 € ?), mouhalabieh (8,90 € ?), softs et eaux, pichets de vin. → `data/carte.json`
3. **Halal ou non** : le restaurant sert du vin et de l'arak ; la FAQ dit « demandez-nous ». S'il est certifié, on l'écrit. → FAQ
4. **Végan** : quels mezzés sont sans produit animal (pour les signaler sur la carte).
5. **La capacité de la salle et les groupes** : nombre de couverts, taille maximale d'un groupe, privatisation possible ? → `data/site.json` (booking.maxGuests = 12 aujourd'hui)
6. **Le traiteur** : le fait-il vraiment ? Plateaux, prix par personne, délai, retrait seulement ou livraison ? (aujourd'hui le site parle de « demande, confirmée par Marc »). → `data/site.json` (catering.confirmed)
7. **À emporter** : possible pour tous les plats ? → FAQ
8. **Un portable pour WhatsApp** : un 06 87 93 06 80 figure sur une ancienne carte de visite (photo Google). Est-il actif et sur WhatsApp ? → `data/site.json` (whatsapp, format 33687930680)
9. **Instagram** : @restaurantchezmarc, à confirmer (204 abonnés, bio « Chez Marc Paris XV »).
10. **Un e-mail** pour recevoir les réservations et les demandes traiteur → variables Vercel `NOTIFY_EMAIL`, `RESEND_API_KEY`, `RESEND_FROM`.
11. **TheFork** : garde-t-il TheFork en parallèle ? (lien secondaire sur la page Réserver)
12. **Les moyens de paiement** (CB, tickets-restaurant, espèces, chèques vacances…) → `data/site.json` (paymentMethods) + FAQ
13. **Les horaires exacts** (Google : 12 h – 14 h 30, 18 h 45 – 22 h 45, 22 h 30 le lundi) et les fermetures annuelles → `data/horaires.json`
14. **Bons cadeaux** : en propose-t-il ? Sous quelle forme ? (aujourd'hui : « appelez-nous »)
15. **Des photos des plats et de la salle** : voir `assets/A-PHOTOGRAPHIER.md`
16. **Le logo d'origine** (fichier vectoriel) : redessiné d'après ses affiches, à remplacer dans `public/logo.svg` s'il en a un.
17. **SIRET, raison sociale, directeur de publication** pour les mentions légales → `data/site.json` (legal)
18. **Son accord pour reprendre quelques vrais avis Google** (prénom + date) → `data/avis.json`

## Ce qui a été relevé (sources)

- Fiche Google (16/11/2026) : 4,6/5, 885 avis, « Restaurant libanais », horaires, 01 43 06 82 96, réservation via TheFork.
- Carte en vitrine (photo Google) : tous les plats, prix, menus midi 16,90 € (lundi–vendredi), soir 26,90 €, du chef 36,90 €, Bambino 13,90 €, mezzés 24 / 25 / 27 €, vins libanais.
- Texte « Pour la petite histoire » en vitrine : origine de Marc, « fait maison », devise « La cuisine libanaise authentique, sans chichi & conviviale ».
