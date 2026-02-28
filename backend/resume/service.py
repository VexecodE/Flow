"""Resume parsing service using Groq AI."""
import os
import json
from typing import Optional
from groq import Groq
from dotenv import load_dotenv
from .models import ParsedResumeData

load_dotenv()


class ResumeParserService:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY not found in environment variables")
        self.client = Groq(api_key=api_key)

    def extract_text_from_pdf(self, file_content: bytes) -> str:
        """Extract text from PDF file."""
        try:
            import fitz  # PyMuPDF
            doc = fitz.open(stream=file_content, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text.strip()
        except Exception as e:
            raise Exception(f"Failed to extract text from PDF: {str(e)}")

    def extract_text_from_docx(self, file_content: bytes) -> str:
        """Extract text from DOCX file."""
        try:
            from docx import Document
            import io
            doc = Document(io.BytesIO(file_content))
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text.strip()
        except Exception as e:
            raise Exception(f"Failed to extract text from DOCX: {str(e)}")

    def parse_with_groq(self, resume_text: str) -> ParsedResumeData:
        """Parse resume text using Groq AI."""
        prompt = f"""You are an expert resume parser. Extract structured information from the resume text below and return ONLY a valid JSON object with the following structure:

{{
  "name": "Full name",
  "role": "Job title or professional role",
  "email": "Email address",
  "location": "City, State/Country",
  "phone": "Phone number",
  "aboutMe": "Professional summary or objective (2-3 sentences)",
  "education": [
    {{
      "institution": "University/School name",
      "degree": "Degree name or certification",
      "year": "Graduation year or date range"
    }}
  ],
  "experience": [
    {{
      "title": "Job title or position",
      "description": "Brief description of responsibilities and achievements"
    }}
  ],
  "skillCategories": [
    {{
      "category": "Category name (e.g., Programming Languages, Design Tools)",
      "skills": ["skill1", "skill2", "skill3"]
    }}
  ]
}}

IMPORTANT RULES:
1. Return ONLY valid JSON, no additional text or explanations
2. If information is missing, use null for strings or empty arrays []
3. Group skills into logical categories (e.g., "Programming Languages", "Frameworks", "Tools", "Soft Skills")
4. For experience, create separate entries for each job/position
5. Extract ALL skills mentioned and categorize them appropriately
6. Keep descriptions concise but informative

Resume Text:
{resume_text}

JSON Output:"""

        try:
            response = self.client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional resume parser that returns only valid JSON. Never include explanations, only JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.1,  # Low temperature for consistent output
                max_tokens=2000
            )

            json_text = response.choices[0].message.content.strip()
            
            # Remove markdown code blocks if present
            if json_text.startswith("```json"):
                json_text = json_text[7:]
            if json_text.startswith("```"):
                json_text = json_text[3:]
            if json_text.endswith("```"):
                json_text = json_text[:-3]
            
            json_text = json_text.strip()
            
            # Parse JSON
            parsed_data = json.loads(json_text)
            
            # Validate and return as Pydantic model
            return ParsedResumeData(**parsed_data)
            
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse Groq response as JSON: {str(e)}")
        except Exception as e:
            raise Exception(f"Groq API error: {str(e)}")

    def parse_resume(self, file_content: bytes, filename: str) -> ParsedResumeData:
        """Main method to parse resume from file."""
        # Extract text based on file type
        if filename.lower().endswith('.pdf'):
            resume_text = self.extract_text_from_pdf(file_content)
        elif filename.lower().endswith('.docx'):
            resume_text = self.extract_text_from_docx(file_content)
        else:
            raise ValueError("Unsupported file format. Please upload PDF or DOCX files.")

        if not resume_text:
            raise ValueError("No text found in the resume. Please upload a valid document.")

        # Parse with Groq
        return self.parse_with_groq(resume_text)


# Singleton instance
resume_parser = ResumeParserService()
