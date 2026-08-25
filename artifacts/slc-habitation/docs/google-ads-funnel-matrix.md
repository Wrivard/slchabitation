# Google Ads Funnel Matrix

| Service | Final /pub URL | Exact H1 | Head Keyword Intent | Ad-Title Guidance | Tracking Suffix | Primary Conversion | Secondary |
|---------|----------------|----------|---------------------|-------------------|-----------------|--------------------|-----------|
| Sous-sol | `/pub/renovation-sous-sol` | Rénovation de sous-sol à Laval et dans les Laurentides | "finition sous sol", "entrepreneur rénovation sous-sol" | Reprendre le service et la zone du H1, sans promesse de prix ou de délai | `utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}&gad_source=1&gad_campaignid={campaignid}` | `lead_submitted` | `phone_click` |
| Salle de bain | `/pub/renovation-salle-de-bain` | Rénovation de salle de bain à Laval et dans les Laurentides | "renovation salle de bain laval", "entrepreneur salle de bain" | Reprendre le service, la zone et la licence RBQ vérifiée | `utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}&gad_source=1&gad_campaignid={campaignid}` | `lead_submitted` | `phone_click` |
| Cuisine | `/pub/renovation-cuisine` | Rénovation de cuisine à Laval et dans les Laurentides | "renovation cuisine", "entrepreneur rénovation cuisine" | Reprendre le service et la zone du H1, sans promesse « clé en main » non confirmée | `utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}&gad_source=1&gad_campaignid={campaignid}` | `lead_submitted` | `phone_click` |

*Configuration client requise : identifiants du compte Google Ads, action de conversion et adaptateur serveur destinataire. La conversion primaire est expédiée par le serveur après validation du lead; GTM ne doit pas la déclencher une seconde fois. Ne jamais placer de PII ou de noms de campagne codés en dur dans l’URL.*

## Politique d’attribution

- Dernier contact publicitaire dans l’onglet, conservé pendant 30 minutes.
- Une nouvelle URL contenant un paramètre publicitaire remplace le contact précédent.
- L’horodatage et la page d’atterrissage sont joints à la demande.
- La conversion serveur n’est expédiée que si Cookiebot indique un consentement marketing accordé au moment de l’envoi.
