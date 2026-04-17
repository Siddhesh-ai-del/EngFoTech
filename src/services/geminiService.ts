import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function callGeminiWithRetry(fn: () => Promise<any>, retries = 5, delay = 2000): Promise<any> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error.status === 429 || error.code === 429 || 
                       error.message?.includes("429") || 
                       error.message?.includes("quota") ||
                       error.message?.includes("RESOURCE_EXHAUSTED");
                       
    if (retries > 0 && isRateLimit) {
      // Add some jitter to the delay
      const jitter = Math.random() * 1000;
      const nextDelay = delay + jitter;
      
      console.warn(`Gemini API rate limit hit. Retrying in ${Math.round(nextDelay)}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, nextDelay));
      return callGeminiWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function generateCareerAnalysis(profile: UserProfile): Promise<AnalysisResult> {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `
    Act as a Senior Engineering Manager at a Tier 1 Product Company (like Google, Atlassian, or Microsoft). 
    Analyze the following student profile and generate a high-impact "SDE Explore Path" roadmap for 2026.
    
    Student Profile:
    - University: ${profile.university}
    - College: ${profile.college}
    - Branch: ${profile.branch}
    - Year: ${profile.year}
    - CGPA: ${profile.cgpa || "N/A"}
    - College Tier: ${profile.tier}
    - Skills: ${JSON.stringify(profile.skills)}
    - Interests: ${profile.interests.join(", ")}
    - Constraints: ${JSON.stringify(profile.constraints)}
    
    The student is aiming for a Software Development Engineer (SDE) role with an expected CTC of 15-30 LPA.
    
    Your analysis and roadmap MUST include:
    1. TECHNICAL STACK: Recommend a modern backend-focused stack (e.g., Go/Rust/Java Spring Boot) vs a Full-Stack approach, explaining which is more valued for high-package roles today.
    2. SYSTEM DESIGN: A step-by-step guide to learning Low-Level Design (LLD) and High-Level Design (HLD) for someone without industry experience.
    3. AI INTEGRATION: How to showcase "AI Literacy" in my projects—specifically, how to integrate LLM APIs and Vector Databases (like Pinecone or Milvus) to make a project stand out.
    4. INTERVIEW STRATEGY: A 6-month timeline for mastering DSA, Mock Interviews, and Behavioral rounds (STAR method).
    5. CLOUD/DEVOPS: The minimum viable knowledge needed for AWS/Azure and Docker to survive a product-company interview.
    
    You must provide:
    1. Skill Gap Analysis: Compare current skills with market requirements for Tier 1 SDE roles.
    2. Recommended Skills: Specifically list skills the student should focus on. For each skill, explain its deep relevance to their branch and chosen path, and provide a rationale for its difficulty level.
    3. Target Opportunities: List specific job roles, industries, and top companies (relevant to the Indian market) that align perfectly with their branch and interests.
    4. Career Sector Fit: Evaluate fit for Core, IT, Govt, PSU, Startups, Research, Higher Studies.
    5. Job Probability: Current likelihood of landing a job and timeline.
    6. Personalized Roadmap: A 6-12 month structured plan with milestones, tasks, and resources. Include "Pro-Tips" for someone residing in a college hostel with limited time.
    7. Application Strategy: Resume, LinkedIn, and networking tips specific to the Indian market.
    8. Career Summary: A professional career recommendation summary for the "Your Career Opportunities" section, including:
       - Compatibility Score (percentage)
       - Recommended Job Roles
       - Trending Roles in the Market
       - Suitable Industries
       - Companies Currently Hiring
       - Why These Roles Fit the User
       - 3-5 Practical Next Career Steps
    9. STRATEGIC METRICS: Assign a score (0-100) for Skills, Interests, Academic Performance, Market Demand, and Strategy based on the student's current state.
    10. MARKET INSIGHTS: Provide 3-5 specific insights into the job market (trending skills, demand levels, salary ranges, and growth).
    
    Respond strictly in JSON format matching the defined schema.
  `;

  const response = await callGeminiWithRetry(() => ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          skillGap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                priority: { type: Type.STRING },
                difficulty: { type: Type.NUMBER },
                estimatedTime: { type: Type.STRING }
              }
            }
          },
          recommendedSkills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING },
                relevance: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                difficultyRationale: { type: Type.STRING },
                resources: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          targetJobs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                industry: { type: Type.STRING },
                companies: { type: Type.ARRAY, items: { type: Type.STRING } },
                reason: { type: Type.STRING },
                averageSalary: { type: Type.STRING }
              }
            }
          },
          sectorFit: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sector: { type: Type.STRING },
                score: { type: Type.NUMBER },
                probability: { type: Type.NUMBER },
                justification: { type: Type.STRING },
                recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          jobProbability: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              percentage: { type: Type.NUMBER },
              reasoning: { type: Type.STRING }
            }
          },
          roadmap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                month: { type: Type.STRING },
                milestone: { type: Type.STRING },
                tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                resources: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      url: { type: Type.STRING },
                      type: { type: Type.STRING }
                    }
                  }
                },
                projects: { type: Type.ARRAY, items: { type: Type.STRING } },
                proTips: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          strategy: {
            type: Type.OBJECT,
            properties: {
              resumeTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              atsKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              linkedinTips: { type: Type.ARRAY, items: { type: Type.STRING } },
              platforms: { type: Type.ARRAY, items: { type: Type.STRING } },
              emailTemplate: { type: Type.STRING }
            }
          },
          strategicAdvice: {
            type: Type.OBJECT,
            properties: {
              techStackRecommendation: { type: Type.STRING },
              systemDesignFocus: { type: Type.STRING },
              aiIntegrationTips: { type: Type.STRING },
              interviewMastery: { type: Type.STRING },
              devOpsEssentials: { type: Type.STRING }
            }
          },
          careerSummary: {
            type: Type.OBJECT,
            properties: {
              compatibilityScore: { type: Type.NUMBER },
              recommendedRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
              trendingRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
              suitableIndustries: { type: Type.ARRAY, items: { type: Type.STRING } },
              hiringCompanies: { type: Type.ARRAY, items: { type: Type.STRING } },
              whyFit: { type: Type.STRING },
              nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          strategicMetrics: {
            type: Type.OBJECT,
            properties: {
              skills: { type: Type.NUMBER },
              interests: { type: Type.NUMBER },
              academicPerformance: { type: Type.NUMBER },
              marketDemand: { type: Type.NUMBER },
              strategy: { type: Type.NUMBER }
            }
          },
          marketInsights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                trendingSkill: { type: Type.STRING },
                demandLevel: { type: Type.STRING },
                salaryRange: { type: Type.STRING },
                growthPercentage: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    }
  }));

  return JSON.parse(response.text || "{}");
}

export async function chatWithMentor(context: string, history: { role: 'user' | 'assistant', content: string }[]): Promise<string> {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Act as "EngFoTech Mentor", a highly advanced, ultra-intelligent career mentor for engineering students.
    You are calm, professional, and provide structured, detailed advice.
    You have knowledge of the Indian and global job markets, DSA, System Design, and AI trends.
    
    User Context: ${context}
    
    Chat History:
    ${history.map(m => `${m.role === 'user' ? 'Student' : 'Mentor'}: ${m.content}`).join('\n')}
    
    Mentor:
  `;
  
  const response = await callGeminiWithRetry(() => ai.models.generateContent({
    model,
    contents: prompt
  }));
  return response.text || "";
}

export async function analyzeResume(resumeText: string): Promise<any> {
  const model = "gemini-3-flash-preview";
  const prompt = `Analyze this resume text for an engineering student in India. Provide an ATS score (0-100), missing keywords, and improvement suggestions. Respond in JSON. \n\nResume Text: ${resumeText}`;
  
  const response = await callGeminiWithRetry(() => ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  }));
  return JSON.parse(response.text || "{}");
}

export async function conductMockInterview(context: string, lastMessage?: string): Promise<string> {
  const model = "gemini-3-flash-preview";
  const prompt = lastMessage 
    ? `You are an elite Tech Interviewer at EngFoTech. 
       The student just answered: "${lastMessage}".
       
       Tasks:
       1. [FEEDBACK]: Provide a concise feedback on the answer. Evaluate technical accuracy, depth, and the "Confidence Level" perceived from the tone/content.
       2. [NEXT]: Ask a thoughtful follow-up question. If they did well, increase difficulty. If they struggled, clarify or provide a hint then ask a related simpler question.
       
       Style: Professional, firm but encouraging.
       Context: ${context}`
    : `Start a high-stakes mock interview for an engineering student. 
       Welcome them to the EngFoTech Interview Simulation. 
       Check their profile context: ${context} and ask the first most relevant question (HR or Technical).
       
       Style: Professional and realistic.`;
    
  const response = await callGeminiWithRetry(() => ai.models.generateContent({
    model,
    contents: prompt
  }));
  return response.text || "";
}
