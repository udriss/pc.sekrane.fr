
// ICI

  export interface FileDropConfig {
    enabled: boolean;
    acceptedTypes: string[];
    timeRestricted: boolean;
    startAt?: string | null;
    endAt?: string | null;
    maxSizeMb?: number;
    displayName?: string;
  }

  export interface FileDropSubmission {
    id: string;
    originalName: string;
    storedName: string;
    fileSize: number;
    mimeType: string;
    uploaderIp?: string | null;
    createdAt: string;
  }

  export interface Activity {
    id: string;
    name: string;
    title: string;
    fileUrl: string;
    isFileDrop?: boolean;
    isDisabled?: boolean;
    isHidden?: boolean;
    dropzoneConfig?: FileDropConfig | null;
    submissions?: FileDropSubmission[];
  }

  export interface Course {
    id: string;
    title: string;
    description: string;
    classe: string;
    theClasseId: string;
    activities: Activity[];
  }

  export interface Classe {
    id: string;
    name: string;
    associated_courses: string[];
  }

  export const classes: Classe[] = [
  {
    "id": "0",
    "name": "Autre",
    "associated_courses": []
  },
  {
    "id": "4",
    "name": "Tle STI2D",
    "associated_courses": [
      "1735830910883",
      "1735852668710",
      "1735873561101",
      "1735919772824",
      "1736155875748",
      "1737364460384"
    ]
  },
  {
    "id": "5",
    "name": "SNT",
    "associated_courses": [
      "1735756065585",
      "1735826771495"
    ]
  },
  {
    "id": "6",
    "name": "Seconde",
    "associated_courses": [
      "1735932402860",
      "1735932455070",
      "1736765412128"
    ]
  },
  {
    "id": "7",
    "name": "1 Spé",
    "associated_courses": [
      "1736153463063",
      "1736157779392",
      "1737011020612"
    ]
  }
];

  export const courses: Course[] = [
  {
    "id": "1735826771495",
    "title": "1 - Internet",
    "description": "Tracer l'évolution d'Internet, analyser ses défis, étudier ses protocoles, modéliser un réseau domestique et expliquer TCP/IP.",
    "classe": "SNT",
    "theClasseId": "5",
    "activities": []
  },
  {
    "id": "1735756065585",
    "title": "8 - IA",
    "description": "Exploration de l'IA en santé via des dessins, applications en ligne, création de modèles IA, et sensibilisation aux biais des données.",
    "classe": "SNT",
    "theClasseId": "5",
    "activities": [
      {
        "id": "1735757430960",
        "name": "2SNT_IA.pdf",
        "title": "Parcours d'activités",
        "fileUrl": "/1735756065585/pdf/2SNT_IA.pdf"
      }
    ]
  },
  {
    "id": "1735830910883",
    "title": "Documents de cours",
    "description": "Retrouvez tous les documents de cours de votre année de terminale en spécialité Physique chimie et mathématiques.",
    "classe": "Tle STI2D",
    "theClasseId": "4",
    "activities": [
      {
        "id": "1735863794003",
        "name": "TSTI_C1_incertitudes.pdf",
        "title": "Chapitre 1 — Unités et incertitudes de mesures expérimentales",
        "fileUrl": "/1735830910883/pdf/TSTI_C1_incertitudes.pdf"
      },
      {
        "id": "1735851878754",
        "name": "TSTI_C2_enjeux_energie.pdf",
        "title": "Chapitre 2 — L'énergie et ses enjeux",
        "fileUrl": "/1735830910883/pdf/TSTI_C2_enjeux_energie.pdf"
      },
      {
        "id": "1735851918509",
        "name": "TSTI_C3_piles.pdf",
        "title": "Chapitre 3 — Énergie chimique et réactions d'oxydoréduction",
        "fileUrl": "/1735830910883/pdf/TSTI_C3_piles.pdf"
      },
      {
        "id": "1735851950038",
        "name": "TSTI_C4_puissances.pdf",
        "title": "Chapitre 4 — Puissance active et puissance apparente",
        "fileUrl": "/1735830910883/pdf/TSTI_C4_puissances.pdf"
      },
      {
        "id": "1735851979537",
        "name": "TSTI_C5_transfert_therm.pdf",
        "title": "Chapitre 5 — Énergie interne",
        "fileUrl": "/1735830910883/pdf/TSTI_C5_transfert_therm.pdf"
      },
      {
        "id": "1735867147963",
        "name": "TSTI_C6_changement_etat.pdf",
        "title": "Chapitre 6 — Changements d'état et transferts thermiques",
        "fileUrl": "/1735830910883/pdf/TSTI_C6_changement_etat.pdf"
      },
      {
        "id": "1735852027323",
        "name": "TSTI_C7_combustions.pdf",
        "title": "Chapitre 7 — Combustions complètes",
        "fileUrl": "/1735830910883/pdf/TSTI_C7_combustions.pdf"
      },
      {
        "id": "1735852047003",
        "name": "TSTI_C8_pH.pdf",
        "title": "Chapitre 8 — Réactions chimiques acido-basiques",
        "fileUrl": "/1735830910883/pdf/TSTI_C8_pH.pdf"
      }
    ]
  },
  {
    "id": "1735852668710",
    "title": "Chapitre 1",
    "description": "Importance des unités et des incertitudes dans les mesures expérimentales, et leur évaluation avec analyse pour renforcer la fiabilité des résultats.",
    "classe": "Tle STI2D",
    "theClasseId": "4",
    "activities": [
      {
        "id": "1735871135346",
        "name": "TSTI_C1_supplement.pdf",
        "title": "Supplément : équation différentielle",
        "fileUrl": "/1735852668710/pdf/TSTI_C1_supplement.pdf"
      },
      {
        "id": "1735943693164",
        "name": "TSTI_C1_TP1.ipynb",
        "title": "TP1 — Notebook",
        "fileUrl": "/1735852668710/notebook/TSTI_C1_TP1.ipynb"
      },
      {
        "id": "1737051131472",
        "name": "TSTI_C1_TP1.pdf",
        "title": "TP1 — Sujet",
        "fileUrl": "/1735852668710/pdf/TSTI_C1_TP1.pdf"
      }
    ]
  },
  {
    "id": "1735873561101",
    "title": "Chapitre 2",
    "description": "Exploration des formes d'énergie, leurs unités, les convertisseurs d'énergie, et les notions de puissance et rendement.",
    "classe": "Tle STI2D",
    "theClasseId": "4",
    "activities": [
      {
        "id": "1735915782828",
        "name": "TSTI_C2_A1_Pyhton.pdf",
        "title": "TP2 — Sujet",
        "fileUrl": "/1735873561101/pdf/TSTI_C2_A1_Pyhton.pdf"
      },
      {
        "id": "1735943598957",
        "name": "TST_C2_TP_1.ipynb",
        "title": "TP2 — Notebook",
        "fileUrl": "/1735873561101/notebook/TST_C2_TP_1.ipynb"
      }
    ]
  },
  {
    "id": "1735919772824",
    "title": "Chapitre 4",
    "description": "Étude des puissances active et apparente dans les circuits électriques, leurs mesures et leurs applications.",
    "classe": "Tle STI2D",
    "theClasseId": "4",
    "activities": [
      {
        "id": "1735919853578",
        "name": "TSTI_C4_TP1.pdf",
        "title": "TP4 — Sujet",
        "fileUrl": "/1735919772824/pdf/TSTI_C4_TP1.pdf"
      },
      {
        "id": "1735943459471",
        "name": "TSTI_C4_TP1.ipynb",
        "title": "TP4 — Notebook",
        "fileUrl": "/1735919772824/notebook/TSTI_C4_TP1.ipynb"
      }
    ]
  },
  {
    "id": "1735932402860",
    "title": "T4 Chapitre 1",
    "description": "Description des mouvements d'un système : référentiels, trajectoires, vecteurs vitesse et variations de mouvements dans l'espace.",
    "classe": "Seconde",
    "theClasseId": "6",
    "activities": [
      {
        "id": "1735935491683",
        "name": "2MVT_aide_chronophys.pdf",
        "title": "Chronophys : prise en main",
        "fileUrl": "/1735932402860/pdf/2MVT_aide_chronophys.pdf"
      },
      {
        "id": "1735945063974",
        "name": "2MVT_shoot_vide.ipynb",
        "title": "Shoot Parfait — Notebook",
        "fileUrl": "/1735932402860/notebook/2MVT_shoot_vide.ipynb"
      },
      {
        "id": "1735949333562",
        "name": "2MVT_shoot_parfait.pdf",
        "title": "Shoot Parfait — Sujet",
        "fileUrl": "/1735932402860/pdf/2MVT_shoot_parfait.pdf"
      },
      {
        "id": "1735949931075",
        "name": "2MVT_vitesse_limite.pdf",
        "title": "Vitesse limite — Sujet",
        "fileUrl": "/1735932402860/pdf/2MVT_vitesse_limite.pdf"
      },
      {
        "id": "1735949971981",
        "name": "2MVT_vitesse_lim_vide.ipynb",
        "title": "Vitesse limite — Notebook",
        "fileUrl": "/1735932402860/notebook/2MVT_vitesse_lim_vide.ipynb"
      },
      {
        "id": "1735950123859",
        "name": "2MVT_parabolique.avi",
        "title": "Shoot parfait : parabole.avi",
        "fileUrl": "/1735932402860/autre/2MVT_parabolique.avi"
      },
      {
        "id": "1735952644219",
        "name": "2MVT_chute_glycerol.avi",
        "title": "Vitesse limite : chute.avi",
        "fileUrl": "/1735932402860/autre/2MVT_chute_glycerol.avi"
      }
    ]
  },
  {
    "id": "1735932455070",
    "title": "T4 Chapitre 2",
    "description": "Étude des forces mécaniques : définition, représentation vectorielle, poids, réactions des supports et interactions gravitationnelles.",
    "classe": "Seconde",
    "theClasseId": "6",
    "activities": []
  },
  {
    "id": "1736153463063",
    "title": "T1 Chapitre 4",
    "description": "Concepts essentiels des réactions chimiques incluant l'évolution des quantités des réactifs et de produits : introduction du tableau d'avancement.",
    "classe": "1 Spé",
    "theClasseId": "7",
    "activities": [
      {
        "id": "1736153524872",
        "name": "1S_C4_intro.pdf",
        "title": "Fabrication de sandwichs",
        "fileUrl": "/1736153463063/pdf/1S_C4_intro.pdf"
      },
      {
        "id": "1736756665426",
        "name": "1S_C4_fiche_1.ipynb",
        "title": "Avancement : Python 1",
        "fileUrl": "/1736153463063/notebook/1S_C4_fiche_1.ipynb"
      },
      {
        "id": "1736756679477",
        "name": "1S_C4_fiche_2.ipynb",
        "title": "Avancement : Python 2",
        "fileUrl": "/1736153463063/notebook/1S_C4_fiche_2.ipynb"
      },
      {
        "id": "1736756688678",
        "name": "1S_C4_fiche_3.ipynb",
        "title": "Avancement : Python 3",
        "fileUrl": "/1736153463063/notebook/1S_C4_fiche_3.ipynb"
      }
    ]
  },
  {
    "id": "1736155875748",
    "title": "Chapitre 6",
    "description": "Exploration des états de l'eau (solide, liquide, gazeux), leurs transitions et leurs impacts sur notre environnement.",
    "classe": "Tle STI2D",
    "theClasseId": "4",
    "activities": [
      {
        "id": "1736155906779",
        "name": "TSTI_C6_A1.pdf",
        "title": "Exploration des états de l'eau (solide, liquide, gazeux), leurs transitions et leurs impacts sur notre environnement.",
        "fileUrl": "/1736155875748/pdf/TSTI_C6_A1.pdf"
      }
    ]
  },
  {
    "id": "1736765412128",
    "title": "Documents de cours",
    "description": "Retrouvez tous les documents de cours de votre année de seconde en Physique chimie",
    "classe": "Seconde",
    "theClasseId": "6",
    "activities": [
      {
        "id": "1737028835331",
        "name": "2matE_bilan_chap4.pdf",
        "title": "T1 Chapitre 4",
        "fileUrl": "/1736765412128/pdf/2matE_bilan_chap4.pdf"
      }
    ]
  },
  {
    "id": "1736157779392",
    "title": "T1 Chapitre 1",
    "description": "Ondes mécaniques, leur propagation, leurs types (transversales et longitudinales), célérité, retard, fréquence et double périodicité.",
    "classe": "1 Spé",
    "theClasseId": "7",
    "activities": [
      {
        "id": "1736157814914",
        "name": "1S_T4_C1_A4.pdf",
        "title": "Double périodicité (spatiale et temporelle)",
        "fileUrl": "/1736157779392/pdf/1S_T4_C1_A4.pdf"
      }
    ]
  },
  {
    "id": "1737011020612",
    "title": "T1 Chapitre 5",
    "description": "",
    "classe": "1 Spé",
    "theClasseId": "7",
    "activities": [
      {
        "id": "1737011062105",
        "name": "1S_C5_A1.pdf",
        "title": "AE : dosage d'un anti mousse",
        "fileUrl": "/1737011020612/pdf/1S_C5_A1.pdf"
      },
      {
        "id": "1737356496655",
        "name": "1S_C5_A2.pdf",
        "title": "AE : contrôle qualité d’une solution de bétadine",
        "fileUrl": "/1737011020612/pdf/1S_C5_A2.pdf"
      }
    ]
  },
  {
    "id": "1737364460384",
    "title": "Chapitre 7",
    "description": "",
    "classe": "Tle STI2D",
    "theClasseId": "4",
    "activities": [
      {
        "id": "1737364519049",
        "name": "TSTI_C7_Act1.pdf",
        "title": "AE : combustion complète",
        "fileUrl": "/1737364460384/pdf/TSTI_C7_Act1.pdf"
      }
    ]
  }
];
