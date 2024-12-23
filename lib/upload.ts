export async function uploadPdf(courseId: string, title: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("courseId", courseId);
  
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`Upload failed in upload.ts: ${response.statusText}`);
  }

  return true;
}

