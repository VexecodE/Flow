"""API routes for resume parsing."""
from fastapi import APIRouter, UploadFile, File, HTTPException
from .service import resume_parser
from .models import ResumeParseResponse, ParsedResumeData

router = APIRouter(prefix="/resume", tags=["resume"])


@router.post("/parse", response_model=ResumeParseResponse)
async def parse_resume(file: UploadFile = File(...)):
    """
    Parse a resume file (PDF or DOCX) and extract structured data.
    
    Args:
        file: Uploaded resume file
        
    Returns:
        Structured resume data including name, email, skills, education, experience
    """
    try:
        # Validate file type
        if not file.filename:
            raise HTTPException(status_code=400, detail="No filename provided")
        
        if not (file.filename.lower().endswith('.pdf') or file.filename.lower().endswith('.docx')):
            raise HTTPException(
                status_code=400,
                detail="Invalid file format. Please upload a PDF or DOCX file."
            )
        
        # Read file content
        file_content = await file.read()
        
        if len(file_content) == 0:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        # Parse resume
        parsed_data = resume_parser.parse_resume(file_content, file.filename)
        
        return ResumeParseResponse(
            success=True,
            message="Resume parsed successfully",
            data=parsed_data
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "resume-parser"}
