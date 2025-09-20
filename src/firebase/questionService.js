import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  deleteDoc, 
  updateDoc,
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "./config";

// Collection reference
const questionsCollection = collection(db, "questions");

// Get all questions
export const getQuestions = async () => {
  try {
    const q = query(questionsCollection, orderBy("uploadTime", "desc"));
    const querySnapshot = await getDocs(q);
    const questions = [];
    querySnapshot.forEach((doc) => {
      questions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

// Add new question
export const addQuestion = async (questionData) => {
  try {
    const docRef = await addDoc(questionsCollection, questionData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
};

// Update question
export const updateQuestion = async (questionId, questionData) => {
  try {
    const docRef = doc(db, "questions", questionId);
    await updateDoc(docRef, questionData);
  } catch (error) {
    console.error("Error updating question:", error);
    throw error;
  }
};

// Delete question
export const deleteQuestion = async (questionId) => {
  try {
    await deleteDoc(doc(db, "questions", questionId));
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
};

// Initialize mock data
export const initializeMockData = async () => {
  try {
    // Check if data already exists
    const existingQuestions = await getQuestions();
    if (existingQuestions.length > 0) {
      console.log("Data already exists, skipping initialization");
      return;
    }

    // Create mock data
    const mockQuestions = [
      {
        questionTitle: "How to Build a House in Australia",
        category: "housing",
        questionDate: new Date("2024-01-15"),
        updateTime: new Date("2024-01-20"),
        uploadTime: new Date("2024-01-15"),
        isJiJing: false,
      },
      {
        questionTitle: "Domestic Violence Legal Aid",
        category: "legal",
        questionDate: new Date("2024-02-10"),
        updateTime: new Date("2024-02-15"),
        uploadTime: new Date("2024-02-10"),
        isJiJing: false,
      },
      {
        questionTitle: "Australian Immigration Policy Overview",
        category: "immigration",
        questionDate: new Date("2024-03-05"),
        updateTime: new Date("2024-03-10"),
        uploadTime: new Date("2024-03-05"),
        isJiJing: true,
      },
      {
        questionTitle: "Medical Emergency Procedures",
        category: "medical",
        questionDate: new Date("2024-01-25"),
        updateTime: new Date("2024-01-30"),
        uploadTime: new Date("2024-01-25"),
        isJiJing: false,
      },
      {
        questionTitle: "Social Welfare Application Guide",
        category: "social-welfare",
        questionDate: new Date("2024-02-20"),
        updateTime: new Date("2024-02-25"),
        uploadTime: new Date("2024-02-20"),
        isJiJing: false,
      },
      {
        questionTitle: "Housing Lease Contract Considerations",
        category: "housing",
        questionDate: new Date("2024-03-01"),
        updateTime: new Date("2024-03-05"),
        uploadTime: new Date("2024-03-01"),
        isJiJing: true,
      },
      {
        questionTitle: "Workers' Compensation Claims Process",
        category: "legal",
        questionDate: new Date("2024-01-10"),
        updateTime: new Date("2024-01-15"),
        uploadTime: new Date("2024-01-10"),
        isJiJing: false,
      },
      {
        questionTitle: "Permanent Residency Application Requirements",
        category: "immigration",
        questionDate: new Date("2024-02-05"),
        updateTime: new Date("2024-02-10"),
        uploadTime: new Date("2024-02-05"),
        isJiJing: false,
      },
      {
        questionTitle: "Childhood Vaccination Schedule",
        category: "medical",
        questionDate: new Date("2024-03-10"),
        updateTime: new Date("2024-03-15"),
        uploadTime: new Date("2024-03-10"),
        isJiJing: true,
      },
      {
        questionTitle: "Unemployment Benefits Application",
        category: "social-welfare",
        questionDate: new Date("2024-01-20"),
        updateTime: new Date("2024-01-25"),
        uploadTime: new Date("2024-01-20"),
        isJiJing: false,
      }
    ];

    // Batch add data
    for (const question of mockQuestions) {
      await addQuestion(question);
    }

    console.log("Mock data initialization completed");
  } catch (error) {
    console.error("Error initializing mock data:", error);
    throw error;
  }
};
