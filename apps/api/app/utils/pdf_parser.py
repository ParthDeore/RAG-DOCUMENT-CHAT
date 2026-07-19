import fitz  # PyMuPDF
from fastapi import HTTPException


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract plain text from a PDF's bytes using PyMuPDF."""
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not read PDF: {exc}")

    text_parts = []
    for page in doc:
        text_parts.append(page.get_text())
    doc.close()

    full_text = "\n".join(text_parts).strip()

    if not full_text:
        raise HTTPException(
            status_code=422,
            detail="No extractable text found in this PDF (it may be a scanned image).",
        )

    return full_text
