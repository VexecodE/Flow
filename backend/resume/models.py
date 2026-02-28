"""Pydantic models for resume parsing."""
from pydantic import BaseModel
from typing import List, Optional


class Education(BaseModel):
    institution: str
    degree: str
    year: str


class Experience(BaseModel):
    title: str
    description: str


class SkillCategory(BaseModel):
    category: str
    skills: List[str]


class ParsedResumeData(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    aboutMe: Optional[str] = None
    education: List[Education] = []
    experience: List[Experience] = []
    skillCategories: List[SkillCategory] = []


class ResumeParseResponse(BaseModel):
    success: bool
    message: str
    data: Optional[ParsedResumeData] = None
