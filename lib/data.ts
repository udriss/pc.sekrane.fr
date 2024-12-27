
  export interface Activity {
    id: string;
    name: string;
    title: string;
    fileUrl: string;
  }

  export interface Course {
    id: string;
    title: string;
    description: string;
    classe: string;
    activities: Activity[];
  }

  export interface Classe {
    id: string;
    name: string;
  }

  export const classes: Classe[] = [
  {
    "id": "2",
    "name": "Classe B"
  },
  {
    "id": "3",
    "name": "Classe C"
  },
  {
    "id": "0",
    "name": "Autre"
  }
];

  export const courses: Course[] = [
  {
    "id": "1735071485630",
    "title": "WWWW",
    "description": "aazk:FLef",
    "classe": "Autre",
    "activities": [
      {
        "id": "1735310996128",
        "name": "TSTI_C4_TP1.tex_12.bak",
        "title": "Az",
        "fileUrl": "/1735071485630/autre/TSTI_C4_TP1.tex_12.bak"
      },
      {
        "id": "1735313741273",
        "name": "TSTI_C4_TP1.tex_13.bak",
        "title": "AZ",
        "fileUrl": "/1735071485630/autre/TSTI_C4_TP1.tex_13.bak"
      },
      {
        "id": "1735313793419",
        "name": "TSTI_C4_TP1.tex_14.bak",
        "title": "az",
        "fileUrl": "/1735071485630/autre/TSTI_C4_TP1.tex_14.bak"
      },
      {
        "id": "1735314184402",
        "name": "TSTI_C4_TP1.tex_15.bak",
        "title": "AZ",
        "fileUrl": "/1735071485630/autre/TSTI_C4_TP1.tex_15.bak"
      },
      {
        "id": "1735319476372",
        "name": "TSTI_C4_TP1.tex_2.bak",
        "title": "azaz",
        "fileUrl": "/1735071485630/autre/TSTI_C4_TP1.tex_2.bak"
      },
      {
        "id": "1735337828962",
        "name": "1735071589077-TSTI_C4_TP1-b3e95d6c717350715890771735071589077.ipynb",
        "title": "az",
        "fileUrl": "/1735071485630/notebook/1735071589077-TSTI_C4_TP1-b3e95d6c717350715890771735071589077.ipynb"
      }
    ]
  },
  {
    "id": "1735071570172",
    "title": "ZZZZ",
    "description": "=kwldjlqrsg",
    "classe": "Classe B",
    "activities": []
  },
  {
    "id": "17489292",
    "title": "TP 1",
    "description": "TP Python",
    "classe": "Classe B",
    "activities": []
  },
  {
    "id": "17542010",
    "title": "TP 1",
    "description": "AZAZ",
    "classe": "Autre",
    "activities": []
  },
  {
    "id": "17599042----1735317599042",
    "title": "TP 1",
    "description": "azaz",
    "classe": "Autre",
    "activities": []
  },
  {
    "id": "17655480----1735317655480",
    "title": "TP 2 ",
    "description": "CEZ",
    "classe": "Autre",
    "activities": []
  },
  {
    "id": "1735318060652",
    "title": "TP 1",
    "description": "jqdz",
    "classe": "Autre",
    "activities": []
  },
  {
    "id": "1735318103272",
    "title": "TP 1",
    "description": "lqfh",
    "classe": "Autre",
    "activities": []
  }
];
