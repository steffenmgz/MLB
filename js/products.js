/* ── Product data – images via AI-generated CDN URLs ──
   To swap in your own images: replace the URL strings with your local paths,
   e.g. "images/prod-01.jpg"
*/

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_37kumjbFc2lwdOwUfr0sGRm1URr/';

const PRODUCTS = [
  {
    id: 1,
    name: "Gastgeschenk Set „Kleine Seifenblase"",
    cat: "babyparty",
    catLabel: "Babyparty",
    price: 3.90,
    oldPrice: null,
    badge: "Bestseller",
    rating: 5.0,
    reviews: 128,
    image: CDN + "hf_20260512_000607_26035db2-aa9e-4a1f-898d-d9917fa5d2c8.png",
    images: [CDN + "hf_20260512_000607_26035db2-aa9e-4a1f-898d-d9917fa5d2c8.png"],
    desc: "Mini-Seifenblasen in transparenter Flasche mit Schleifchen und personalisiertem Etikett. Perfekt für Babypartys und als süßes Mitgebsel für Groß und Klein.",
    options: { menge: ["5 Stück", "10 Stück", "20 Stück", "50 Stück"] },
    tags: ["babyparty", "sets"],
    bestseller: true
  },
  {
    id: 2,
    name: "Gastgeschenk „Kleines Wunder" Honig",
    cat: "babyparty",
    catLabel: "Babyparty",
    price: 4.50,
    oldPrice: null,
    badge: "Neu",
    rating: 4.9,
    reviews: 87,
    image: CDN + "hf_20260512_000610_6497106b-b505-4809-a16d-05b7f6a39579.png",
    images: [CDN + "hf_20260512_000610_6497106b-b505-4809-a16d-05b7f6a39579.png"],
    desc: "Bio-Honig im Mini-Gläschen mit personalisiertem Etikett. Ein zuckersüßes Dankeschön für deine Gäste.",
    options: { menge: ["5 Stück", "10 Stück", "20 Stück", "50 Stück"] },
    tags: ["babyparty", "taufe"],
    bestseller: true
  },
  {
    id: 3,
    name: "Taufe Kerzen-Set „Engelsschein"",
    cat: "taufe",
    catLabel: "Taufe",
    price: 6.90,
    oldPrice: 8.90,
    badge: "Sale",
    rating: 5.0,
    reviews: 62,
    image: CDN + "hf_20260512_000617_5339dc68-582b-4b72-81eb-ec56eb124a2d.png",
    images: [CDN + "hf_20260512_000617_5339dc68-582b-4b72-81eb-ec56eb124a2d.png"],
    desc: "Kleine Taufkerzen in zartem Weiß mit handgemachter Banderole. Personalisierung mit Name und Datum möglich.",
    options: { menge: ["5 Stück", "10 Stück", "20 Stück"] },
    tags: ["taufe"],
    bestseller: true
  },
  {
    id: 4,
    name: "Gastgeschenk Blumensamen „Wachse groß"",
    cat: "babyparty",
    catLabel: "Babyparty",
    price: 2.90,
    oldPrice: null,
    badge: null,
    rating: 4.8,
    reviews: 45,
    image: CDN + "hf_20260512_000620_fd14ed70-c9a7-400b-90b1-bfd64f835aa2.png",
    images: [CDN + "hf_20260512_000620_fd14ed70-c9a7-400b-90b1-bfd64f835aa2.png"],
    desc: "Kleine Papiertüte mit Wildblumensamen – damit die Liebe weiterwächst. Mit personalisiertem Etikett.",
    options: { menge: ["5 Stück", "10 Stück", "20 Stück", "50 Stück"] },
    tags: ["babyparty", "geburtstag"],
    bestseller: false
  },
  {
    id: 5,
    name: "Geburtstag-Set „Erster Geburtstag" Seifenblase",
    cat: "geburtstag",
    catLabel: "1. Geburtstag",
    price: 3.50,
    oldPrice: null,
    badge: null,
    rating: 4.9,
    reviews: 34,
    image: CDN + "hf_20260512_000622_58ee3dcb-7988-4e09-9dba-2b49d8acaabc.png",
    images: [CDN + "hf_20260512_000622_58ee3dcb-7988-4e09-9dba-2b49d8acaabc.png"],
    desc: "Seifenblasen mit hübschem „Hurra, ich bin 1!"-Etikett – das ideale Gastgeschenk für den ersten Geburtstag.",
    options: { menge: ["5 Stück", "10 Stück", "20 Stück", "50 Stück"] },
    tags: ["geburtstag"],
    bestseller: false
  },
  {
    id: 6,
    name: "Premium Geschenkset „Stork Box"",
    cat: "sets",
    catLabel: "Geschenksets",
    price: 24.90,
    oldPrice: null,
    badge: "Exklusiv",
    rating: 5.0,
    reviews: 56,
    image: CDN + "hf_20260512_000625_a6cacaa4-e355-437a-802b-c7b3c0d9e760.png",
    images: [CDN + "hf_20260512_000625_a6cacaa4-e355-437a-802b-c7b3c0d9e760.png"],
    desc: "Liebevoll zusammengestellte Geschenkbox mit Honig, Seifenblasen, Kerze und Blumensamen – der perfekte Willkommensgruß für das neue Glück.",
    options: { farbe: ["Rosa", "Mint", "Blau", "Neutral"] },
    tags: ["sets", "babyparty"],
    bestseller: true
  },
  {
    id: 7,
    name: "Gastgeschenk „Baby Shower" Tee",
    cat: "babyparty",
    catLabel: "Babyparty",
    price: 3.20,
    oldPrice: null,
    badge: null,
    rating: 4.7,
    reviews: 29,
    image: CDN + "hf_20260512_000815_79dc49c1-c585-40a4-b630-3a0f1df6f3bf.png",
    images: [CDN + "hf_20260512_000815_79dc49c1-c585-40a4-b630-3a0f1df6f3bf.png"],
    desc: "Bio-Kräutertee-Beutel im Herzform mit personalisierter Karte. Nachhaltig, liebevoll, unvergesslich.",
    options: { menge: ["5 Stück", "10 Stück", "20 Stück"] },
    tags: ["babyparty"],
    bestseller: false
  },
  {
    id: 8,
    name: "Taufe Gastgeschenk „Segen & Liebe" Rosenkranz",
    cat: "taufe",
    catLabel: "Taufe",
    price: 5.90,
    oldPrice: null,
    badge: null,
    rating: 4.8,
    reviews: 41,
    image: CDN + "hf_20260512_000818_b6238858-3a3a-4d1f-abe5-4583547502c0.png",
    images: [CDN + "hf_20260512_000818_b6238858-3a3a-4d1f-abe5-4583547502c0.png"],
    desc: "Kleiner Holzrosenkranz mit Kärtchen und Satinband – ein stimmungsvolles Gastgeschenk zur Taufe.",
    options: { farbe: ["Weiß/Gold", "Weiß/Silber", "Natur"] },
    tags: ["taufe"],
    bestseller: false
  }
];

const CATEGORIES = [
  { id: "all",        label: "Alle" },
  { id: "babyparty", label: "Babyparty" },
  { id: "taufe",     label: "Taufe" },
  { id: "geburtstag",label: "1. Geburtstag" },
  { id: "sets",      label: "Geschenksets" }
];

/* Category card images */
const CAT_IMAGES = {
  babyparty:  CDN + "hf_20260512_000821_4244b566-cb2d-4dc2-9ccb-f7157bee53c3.png",
  taufe:      CDN + "hf_20260512_000824_7e8878d3-cdc7-4904-9c55-77a0c204a2a2.png",
  geburtstag: "images/cat-geburtstag-placeholder.jpg", /* pending – update once ready */
  sets:       CDN + "hf_20260512_000833_cb2ffaf8-6474-4ef6-b6cf-a854ce11c1ca.png"
};
