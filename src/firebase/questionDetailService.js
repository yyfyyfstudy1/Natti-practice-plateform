import { 
  collection, 
  doc,
  getDocs, 
  getDoc,
  addDoc, 
  setDoc,
  query, 
  where,
  orderBy 
} from "firebase/firestore";
import { db } from "./config";

// Collection reference
const questionDetailsCollection = collection(db, "questionDetails");

// Get question detail by question ID
export const getQuestionDetail = async (questionId) => {
  try {
    const q = query(questionDetailsCollection, where("questionId", "==", questionId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching question detail:", error);
    return null;
  }
};

// Add question detail
export const addQuestionDetail = async (detailData) => {
  try {
    const docRef = await addDoc(questionDetailsCollection, detailData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding question detail:", error);
    throw error;
  }
};

// Update question detail
export const updateQuestionDetail = async (detailId, detailData) => {
  try {
    const docRef = doc(db, "questionDetails", detailId);
    await setDoc(docRef, detailData, { merge: true });
  } catch (error) {
    console.error("Error updating question detail:", error);
    throw error;
  }
};

// Initialize mock data for question details
export const initializeQuestionDetailMockData = async () => {
  try {
    // Check if data already exists
    const q = query(questionDetailsCollection);
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.size > 0) {
      console.log("Question detail data already exists, skipping initialization");
      return;
    }

    // Import getQuestions to get actual question IDs
    const { getQuestions } = await import('./questionService');
    const questions = await getQuestions();
    
    if (questions.length === 0) {
      console.log("No questions found, skipping question detail initialization");
      return;
    }

    // Create mock question details with actual question IDs
    const mockQuestionDetails = [
      {
        questionId: questions[0]?.id || "mock_question_1",
        questionNumber: "0001",
        title: "How to Build a House in Australia",
        category: "housing",
        introduction: "In this lesson, you'll learn about the process of building a house in Australia, including permits, regulations, and working with contractors.",
        introductionAudio: "/audio/intro_house_building.mp3",
        dialogs: [
          {
            id: "dialog_1",
            originalText: "Good morning. I'd like to inquire about building permits for residential construction.",
            dialogAudio: "/audio/dialog_house_1_original.mp3",
            translation: "早上好。我想咨询住宅建设的建筑许可证。",
            translationAudio: "/audio/dialog_house_1_translation.mp3"
          },
          {
            id: "dialog_2", 
            originalText: "You'll need to submit your building plans to the local council for approval first.",
            dialogAudio: "/audio/dialog_house_2_original.mp3",
            translation: "您需要先向当地议会提交建筑计划以获得批准。",
            translationAudio: "/audio/dialog_house_2_translation.mp3"
          },
          {
            id: "dialog_3",
            originalText: "How long does the approval process usually take?",
            dialogAudio: "/audio/dialog_house_3_original.mp3", 
            translation: "批准流程通常需要多长时间？",
            translationAudio: "/audio/dialog_house_3_translation.mp3"
          }
        ]
      },
      {
        questionId: questions[1]?.id || "mock_question_2",
        questionNumber: "0002", 
        title: "Home Visit Cleaning Support",
        category: "social-welfare",
        introduction: "Learn how to request and arrange home cleaning support services through social welfare programs.",
        introductionAudio: "/audio/intro_cleaning_support.mp3",
        dialogs: [
          {
            id: "dialog_1",
            originalText: "Good morning. I am David Smith. I am coming to do a home visit.",
            dialogAudio: "/audio/dialog_cleaning_1_original.mp3",
            translation: "早上好。我是大卫·史密斯。我来做家访。",
            translationAudio: "/audio/dialog_cleaning_1_translation.mp3"
          },
          {
            id: "dialog_2",
            originalText: "Thank you for coming. I really need help with cleaning my house.",
            dialogAudio: "/audio/dialog_cleaning_2_original.mp3",
            translation: "谢谢您的到来。我真的需要帮助清理我的房子。",
            translationAudio: "/audio/dialog_cleaning_2_translation.mp3"
          },
          {
            id: "dialog_3",
            originalText: "That's what we're here for. Let me assess what services you need.",
            dialogAudio: "/audio/dialog_cleaning_3_original.mp3",
            translation: "这就是我们来这里的目的。让我评估一下您需要什么服务。",
            translationAudio: "/audio/dialog_cleaning_3_translation.mp3"
          }
        ]
      },
      {
        questionId: questions[2]?.id || "mock_question_3",
        questionNumber: "0003",
        title: "Australian Immigration Policy Overview", 
        category: "immigration",
        introduction: "Understand the key aspects of Australian immigration policies, visa types, and application processes.",
        introductionAudio: "/audio/intro_immigration.mp3",
        dialogs: [
          {
            id: "dialog_1",
            originalText: "I'm interested in applying for permanent residency in Australia. What are my options?",
            dialogAudio: "/audio/dialog_immigration_1_original.mp3",
            translation: "我有兴趣申请澳大利亚永久居留权。我有什么选择？",
            translationAudio: "/audio/dialog_immigration_1_translation.mp3"
          },
          {
            id: "dialog_2",
            originalText: "There are several pathways including skilled migration, family visas, and business visas.",
            dialogAudio: "/audio/dialog_immigration_2_original.mp3",
            translation: "有几种途径，包括技术移民、家庭签证和商业签证。",
            translationAudio: "/audio/dialog_immigration_2_translation.mp3"
          },
          {
            id: "dialog_3",
            originalText: "I have a degree in engineering. Which category would be best for me?",
            dialogAudio: "/audio/dialog_immigration_3_original.mp3",
            translation: "我有工程学位。哪个类别最适合我？",
            translationAudio: "/audio/dialog_immigration_3_translation.mp3"
          }
        ]
      },
      {
        questionId: questions[3]?.id || "mock_question_4",
        questionNumber: "0004",
        title: "Medical Emergency Procedures",
        category: "medical", 
        introduction: "Learn essential procedures for handling medical emergencies and when to call emergency services.",
        introductionAudio: "/audio/intro_medical_emergency.mp3",
        dialogs: [
          {
            id: "dialog_1",
            originalText: "Emergency services, this is triple zero. What's your emergency?",
            dialogAudio: "/audio/dialog_medical_1_original.mp3",
            translation: "紧急服务，这里是000。您遇到什么紧急情况？",
            translationAudio: "/audio/dialog_medical_1_translation.mp3"
          },
          {
            id: "dialog_2",
            originalText: "My neighbor has collapsed and is not responding. I need an ambulance.",
            dialogAudio: "/audio/dialog_medical_2_original.mp3", 
            translation: "我的邻居昏倒了，没有反应。我需要救护车。",
            translationAudio: "/audio/dialog_medical_2_translation.mp3"
          },
          {
            id: "dialog_3",
            originalText: "Are they breathing? Please check if they have a pulse.",
            dialogAudio: "/audio/dialog_medical_3_original.mp3",
            translation: "他们还在呼吸吗？请检查他们是否有脉搏。",
            translationAudio: "/audio/dialog_medical_3_translation.mp3"
          }
        ]
      },
      {
        questionId: questions[4]?.id || "mock_question_5",
        questionNumber: "0005", 
        title: "Social Welfare Application Guide",
        category: "social-welfare",
        introduction: "Step-by-step guide to applying for various social welfare benefits and understanding eligibility criteria.",
        introductionAudio: "/audio/intro_welfare_guide.mp3",
        dialogs: [
          {
            id: "dialog_1",
            originalText: "I'd like to apply for unemployment benefits. What documents do I need?",
            dialogAudio: "/audio/dialog_welfare_1_original.mp3",
            translation: "我想申请失业救济金。我需要什么文件？",
            translationAudio: "/audio/dialog_welfare_1_translation.mp3"
          },
          {
            id: "dialog_2",
            originalText: "You'll need your tax file number, bank details, and evidence of job seeking activities.",
            dialogAudio: "/audio/dialog_welfare_2_original.mp3",
            translation: "您需要税务档案号、银行详细信息和求职活动证明。",
            translationAudio: "/audio/dialog_welfare_2_translation.mp3"
          },
          {
            id: "dialog_3",
            originalText: "How often do I need to report my job search activities?",
            dialogAudio: "/audio/dialog_welfare_3_original.mp3",
            translation: "我需要多久报告一次求职活动？",
            translationAudio: "/audio/dialog_welfare_3_translation.mp3"
          }
        ]
      }
    ];

    // Add each question detail to Firestore
    for (const questionDetail of mockQuestionDetails) {
      await addQuestionDetail(questionDetail);
    }

    console.log("Question detail mock data initialization completed");
  } catch (error) {
    console.error("Error initializing question detail mock data:", error);
    throw error;
  }
};
