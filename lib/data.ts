export interface Activity {
  id: string;
  title: string;
  pdfUrl: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  activities: Activity[];
}

export const courses: Course[] = [
  {
    id: "math",
    title: "Mathématiques",
    description: "Cours de mathématiques avancées",
    activities: [
      {
        id: "math-1",
        title: "Algèbre linéaire",
        pdfUrl: "/pdfs/math/algebra.pdf"
      },
      {
        id: "math-2",
        title: "Calcul différentiel",
        pdfUrl: "/pdfs/math/calculus.pdf"
      },
      {
        id: "math-1734927474821",
        title: "az",
        pdfUrl: "/pdfs/math/1734927474821-2sigE_bilan_chap3.pdf"
      }
    ]
  },
  {
    id: "physics",
    title: "Physique",
    description: "Cours de physique générale",
    activities: [
      {
        id: "physics-1",
        title: "Mécanique classique",
        pdfUrl: "/pdfs/physics/mechanics.pdf"
      },
      {
        id: "physics-2",
        title: "Électromagnétisme",
        pdfUrl: "/pdfs/physics/electromagnetism.pdf"
      },
      {
        id: "physics-1734927607412",
        title: "az",
        pdfUrl: "/pdfs/physics/1734927607411-2sigE_bilan_chap2.pdf"
      },
      {
        id: "physics-1734968547918",
        title: "AZ",
        pdfUrl: "/pdfs/physics/1734968547918-2sigE_bilan_chap3.pdf"
      },
      {
        id: "physics-1734968583050",
        title: "az",
        pdfUrl: "/pdfs/physics/1734968583048-document_cours_chap4.pdf"
      }
    ]
  },
  {
    id: "history",
    title: "Histoire",
    description: "Cours d'histoire mondiale",
    activities: [
      {
        id: "history-1",
        title: "La Révolution française",
        pdfUrl: "/pdfs/history/french-revolution.pdf"
      },
      {
        id: "history-2",
        title: "La Seconde Guerre mondiale",
        pdfUrl: "/pdfs/history/ww2.pdf"
      },
      {
        id: "history-1734928041956",
        title: "az",
        pdfUrl: "/pdfs/history/1734928041955-2sigE_bilan_chap1.pdf"
      },
      {
        id: "history-1734928084652",
        title: "az",
        pdfUrl: "/pdfs/history/1734928084650-2sigE_bilan_chap1.pdf"
      },
      {
        id: "history-1734928129684",
        title: "az",
        pdfUrl: "/pdfs/history/1734928129683-2sigE_bilan_chap3.pdf"
      }
    ]
  },
  {
    id: "1734969412481",
    title: "az",
    description: "",
    activities: []
  }
];