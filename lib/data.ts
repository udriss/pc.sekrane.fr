
export interface Activity {
  id: string;
  name: string;
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
    "id": "1735056025955",
    "title": "wwww",
    "description": "w",
    "activities": [
      {
        "id": "1735060908408",
        "name": "document_cours_chap6.pdf",
        "title": "Cours du chapitre 6",
        "pdfUrl": "/pdfs/1735056025955/1735060908406-document_cours_chap6.pdf"
      },
      {
        "id": "1735061620706",
        "name": "document_cours_chap10.pdf",
        "title": "Cours du chapitre 10",
        "pdfUrl": "/pdfs/1735056025955/1735061620705-document_cours_chap10.pdf"
      },
      {
        "id": "1735067516066",
        "title": "Cours du chapitre 7",
        "name": "document_cours_chap7.pdf",
        "pdfUrl": "/pdfs/1735056025955/1735067516065-document_cours_chap7.pdf"
      },
      {
        "id": "1735068155987",
        "title": "doc cours_chap7",
        "name": "document_cours_chap7.pdf",
        "pdfUrl": "/pdfs/1735056025955/1735068155986-document_cours_chap7.pdf"
      },
      {
        "id": "1735068850851",
        "name": "document_cours_chap2.pdf",
        "title": "AQAQAQA",
        "pdfUrl": "/pdfs/1735056025955/1735068850850-document_cours_chap2.pdf"
      }
    ]
  },
  {
    "id": "1735056375896",
    "title": "aaaaaq",
    "description": "qq",
    "activities": []
  },
  {
    "id": "1735060877458",
    "title": "Wsjdhkfsfsd",
    "description": "dQDKJHf",
    "activities": []
  }
];
