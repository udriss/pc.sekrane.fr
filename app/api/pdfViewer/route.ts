import { NextRequest, NextResponse } from 'next/server';
import {
    PdfViewer,
    Toolbar, 
    Magnification, 
    Navigation, 
    Annotation, 
    LinkAnnotation,
    ThumbnailView,
    BookmarkView,
    TextSelection,
    TextSearch,
    FormFields,
    FormDesigner
} from '@syncfusion/ej2-pdfviewer';

// Initialize PDF viewer with required features
PdfViewer.Inject(
    Toolbar,
    Magnification,
    Navigation,
    Annotation,
    LinkAnnotation,
    ThumbnailView,
    BookmarkView,
    TextSelection,
    TextSearch,
    FormFields,
    FormDesigner
);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const pdfViewer = new PdfViewer();
        const result = await pdfViewer.load(body, '');
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { error: 'PDF processing failed' }, 
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    return NextResponse.json({ status: 'PDF Viewer Service Ready' });
}