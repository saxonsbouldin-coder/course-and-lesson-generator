import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CourseData, GenerationConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const courseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    courseTitle: { type: Type.STRING },
    courseDescription: { type: Type.STRING },
    estimatedTotalDuration: { type: Type.STRING, description: "The total calculated duration of the entire course (e.g. '12 Hours', '3 Days')." },
    syllabus: {
      type: Type.OBJECT,
      properties: {
        learningObjectives: { type: Type.ARRAY, items: { type: Type.STRING } },
        targetAudience: { type: Type.STRING },
        prerequisites: { type: Type.ARRAY, items: { type: Type.STRING } },
        courseStructureSummary: { type: Type.STRING },
        roadmap: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        schedule: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              timeframe: { type: Type.STRING },
              topic: { type: Type.STRING },
              description: { type: Type.STRING },
              deadline: { type: Type.STRING }
            },
            required: ["timeframe", "topic", "description", "deadline"]
          }
        }
      },
      required: ["learningObjectives", "targetAudience", "prerequisites", "courseStructureSummary", "roadmap", "schedule"]
    },
    modules: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          duration: { type: Type.STRING, description: "Total estimated time for this module (sum of lessons)" },
          lessons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                duration: { type: Type.STRING },
                content: { type: Type.STRING, description: "Detailed lesson content (300-500 words). Be concise for long courses." },
                imagePrompt: { type: Type.STRING },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      duration: { type: Type.STRING },
                      objective: { type: Type.STRING },
                      materialsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
                      instructions: { type: Type.STRING, description: "Brief step-by-step instructions" }
                    },
                    required: ["title", "duration", "objective", "materialsNeeded", "instructions"]
                  }
                },
                worksheets: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      difficulty: { type: Type.STRING, enum: ["Basic", "Advanced"] },
                      questions: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            question: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ["short_answer", "multiple_choice", "checklist"] },
                            options: { type: Type.ARRAY, items: { type: Type.STRING } }
                          },
                          required: ["question", "type"]
                        }
                      }
                    },
                    required: ["title", "difficulty", "questions"]
                  }
                }
              },
              required: ["title", "duration", "content", "imagePrompt", "activities", "worksheets"]
            }
          }
        },
        required: ["title", "description", "duration", "lessons"]
      }
    },
    slideDeck: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          bulletPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          speakerNotes: { type: Type.STRING }
        },
        required: ["title", "bulletPoints", "speakerNotes"]
      }
    },
    checklist: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    studentSop: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        purpose: { type: Type.STRING },
        steps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              stepNumber: { type: Type.INTEGER },
              action: { type: Type.STRING },
              detail: { type: Type.STRING }
            },
            required: ["stepNumber", "action", "detail"]
          }
        }
      },
      required: ["title", "purpose", "steps"]
    },
    teacherSop: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        purpose: { type: Type.STRING },
        steps: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              stepNumber: { type: Type.INTEGER },
              action: { type: Type.STRING },
              detail: { type: Type.STRING }
            },
            required: ["stepNumber", "action", "detail"]
          }
        }
      },
      required: ["title", "purpose", "steps"]
    },
    capstoneProjects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          scope: { type: Type.STRING, enum: ['Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Final'] },
          duration: { type: Type.STRING, description: "Estimated time to complete this project" },
          requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "description", "scope", "duration", "requirements", "steps"]
      }
    },
    digitalAssets: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['email', 'social_post', 'prompt', 'resource_list'] },
          content: { type: Type.STRING }
        },
        required: ["title", "type", "content"]
      }
    },
    videoScripts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Title of the lesson, module, or activity this script is for." },
          type: { type: Type.STRING, enum: ['module_intro', 'lesson_summary', 'activity_guide'] },
          script: { type: Type.STRING, description: "A video script including scene direction and spoken dialogue." }
        },
        required: ["title", "type", "script"]
      }
    }
  },
  required: ["courseTitle", "courseDescription", "estimatedTotalDuration", "syllabus", "modules", "slideDeck", "checklist", "studentSop", "teacherSop", "capstoneProjects", "digitalAssets", "videoScripts"]
};

export const generateCourse = async (config: GenerationConfig): Promise<CourseData> => {
  try {
    let capstoneInstructions = "9. Capstone Project: Create one final comprehensive project.";
    let courseFormatDescription = config.courseType.replace(/_/g, ' ');
    let structureInstruction = "";

    const isLargeCourse = config.lessonCount > 10 || config.courseType === 'yearly' || config.courseType === 'quarterly';

    if (config.courseType === 'existing_structure') {
        courseFormatDescription = "Existing Structure (Follow Input)";
        structureInstruction = `
        - **CRITICAL**: The input content contains a pre-defined structure. You MUST extract and use the Modules, Lessons, and Activities exactly as listed. 
        - Your job is to FLESH OUT the content (worksheets, scripts, instructions) for the provided outline.
        `;
        capstoneInstructions = `
        9. Capstone Projects:
           - If a final project is mentioned, flesh it out. 
           - Otherwise, create 1 "Final" Capstone project.
        `;
    } else if (config.courseType === 'custom') {
      courseFormatDescription = `Custom (${config.lessonCount} Lessons)`;
      capstoneInstructions = `9. Capstone Projects: Create 1 Final Capstone project.`;
      structureInstruction = `- Divide the requested ${config.lessonCount} lessons logically among these modules.`;
    } else if (config.courseType === '1_3_weeks' && config.weekCount) {
      courseFormatDescription = `${config.weekCount} Weeks`;
      capstoneInstructions = `
      9. Capstone Projects Structure:
         - Generate ${config.weekCount} "Weekly" capstone projects.
         - Generate 1 "Final" capstone project.
      `;
      structureInstruction = `- Divide the requested ${config.lessonCount} lessons logically among these modules.`;
    } else if (config.courseType === 'monthly') {
      capstoneInstructions = `
      9. Capstone Projects Structure:
         - Generate 4 "Weekly" capstone projects.
         - Generate 1 "Final" project.
      `;
      structureInstruction = `- Divide the requested ${config.lessonCount} lessons logically among these modules.`;
    } else if (isLargeCourse) {
      capstoneInstructions = `
      9. Capstone Projects Structure (CONCISE FOR STORAGE):
         - Generate exactly 3 key milestone projects (e.g. Monthly/Quarterly).
         - Generate 1 "Final" project.
      `;
      structureInstruction = `- Divide the requested ${config.lessonCount} lessons logically. For very high counts (like 52), be extremely brief in descriptions to avoid output limits.`;
    } else {
      structureInstruction = `- Divide the requested ${config.lessonCount} lessons logically among these modules.`;
    }

    const scriptConstraint = isLargeCourse 
      ? "ONLY generate 'module_intro' scripts for each module. Skip lesson-level scripts to save tokens."
      : "Generate 'module_intro' for modules, 'lesson_summary' for lessons, and 'activity_guide' for activities.";

    const textPart = {
      text: `
      Create a comprehensive course structure based on the provided content.
      
      CONTENT SOURCE: "${config.content.substring(0, 10000)}"
      
      CONFIGURATION:
      - Course Format: ${courseFormatDescription}
      - Lesson Duration: ${config.lessonDuration}
      ${config.courseType !== 'existing_structure' ? `- Number of Lessons: ${config.lessonCount}` : ''}
      - Include Assets: ${config.includeAssets}
      - Include Video Scripts: ${config.includeVideoScripts}
      
      STRICT CONSTRAINTS (IMPORTANT):
      1. ${structureInstruction}
      2. For EACH Lesson, generate 2 Activities and 2 Worksheets.
      3. ${scriptConstraint}
      4. BE CONCISE. Use bullet points. Do not exceed output limits. If the course is long, make lesson content punchy and summarized.
      5. Estimated TOTAL duration in 'estimatedTotalDuration' is mandatory.
      `
    };

    const parts = [textPart, ...(config.imageParts || [])];

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: courseSchema,
        thinkingConfig: { thinkingBudget: 4000 },
        systemInstruction: "You are an expert instructional designer. You must return a VALID JSON response. If the requested course is large, prioritize brevity in text descriptions to ensure the JSON does not truncate.",
      },
    });

    if (!response.text) {
      throw new Error("No text returned from Gemini");
    }

    let jsonString = response.text.trim();
    jsonString = jsonString.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");

    try {
      const data = JSON.parse(jsonString);
      return {
        ...data,
        id: crypto.randomUUID(),
        createdAt: Date.now()
      } as CourseData;
    } catch (parseError) {
      console.error("JSON Parse Error. Partial text:", jsonString.slice(-200));
      // Attempt to fix simple truncation by appending closing braces - very risky but might save a slightly cut off result
      if (jsonString.endsWith('"') || jsonString.endsWith(' ')) {
         try {
            const fixedJson = jsonString + '}]}]}]}'; // Best guess attempt to close nested structures
            const data = JSON.parse(fixedJson);
            return { ...data, id: crypto.randomUUID(), createdAt: Date.now() } as CourseData;
         } catch {
            throw new Error("The course structure was too large for the AI to generate in one pass. Try reducing the number of lessons or asking for a smaller duration.");
         }
      }
      throw parseError;
    }
  } catch (error) {
    console.error("Error generating course:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          { text: `Create a professional, flat-design vector illustration suitable for an educational textbook. White background. Subject: ${prompt}` }
        ]
      },
      config: {}
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};