import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './QuestionDetail.module.css';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import DialogItem from '../DialogItem/DialogItem';
import { getQuestionDetail } from '../../firebase/questionDetailService';
import { getQuestions } from '../../firebase/questionService';
import { useLoading } from '../../contexts/LoadingContext';

const QuestionDetail = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [questionDetail, setQuestionDetail] = useState(null);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { withLoading } = useLoading();

  useEffect(() => {
    const fetchQuestionDetail = async () => {
      try {
        setLoading(true);
        
        // Get basic question info and detailed content
        const [questionsData, detailData] = await Promise.all([
          withLoading(() => getQuestions()),
          withLoading(() => getQuestionDetail(questionId))
        ]);

        // Find the matching question
        const foundQuestion = questionsData.find(q => q.id === questionId);
        
        if (!foundQuestion) {
          setError('Question not found');
          return;
        }

        setQuestion(foundQuestion);
        setQuestionDetail(detailData);

      } catch (err) {
        console.error('Error fetching question detail:', err);
        setError('Failed to load question details');
      } finally {
        setLoading(false);
      }
    };

    if (questionId) {
      fetchQuestionDetail();
    }
  }, [questionId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const getCategoryInfo = (category) => {
    const categoryMap = {
      'housing': { label: 'Housing', color: '#28a745' },
      'social-welfare': { label: 'Social Welfare', color: '#17a2b8' },
      'legal': { label: 'Legal', color: '#ffc107' },
      'immigration': { label: 'Immigration', color: '#fd7e14' },
      'medical': { label: 'Medical', color: '#6f42c1' },
    };
    return categoryMap[category] || { label: category, color: '#6c757d' };
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingMessage}>
          Loading question details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          {error}
        </div>
        <button onClick={handleGoBack} className={styles.backButton}>
          ← Go Back
        </button>
      </div>
    );
  }

  if (!question) {
    return (
      <div className={styles.container}>
        <div className={styles.errorMessage}>
          Question not found
        </div>
        <button onClick={handleGoBack} className={styles.backButton}>
          ← Go Back
        </button>
      </div>
    );
  }

  const categoryInfo = getCategoryInfo(question.category);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <button onClick={handleGoBack} className={styles.backButton}>
            ← Go Back
          </button>
          
          <div className={styles.questionHeader}>
            <div className={styles.titleSection}>
              <h1 className={styles.questionTitle}>
                {question.title}
              </h1>
              <span 
                className={styles.categoryTag}
                style={{ backgroundColor: categoryInfo.color }}
              >
                {categoryInfo.label}
              </span>
            </div>
            
            <div className={styles.questionMeta}>
              <span className={styles.questionNumber}>
                Question: {questionDetail?.questionNumber || question.id.slice(-4).padStart(4, '0')}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Introduction Section */}
        {questionDetail && (
          <section className={styles.introSection}>
            <h2 className={styles.sectionTitle}>Introduction</h2>
            
            <div className={styles.introContent}>
              <p className={styles.introText}>
                {questionDetail.introduction}
              </p>
              
              <AudioPlayer 
                audioSrc={questionDetail.introductionAudio}
                className={styles.introAudio}
              />
            </div>
          </section>
        )}

        {/* Dialogs Section */}
        {questionDetail?.dialogs && questionDetail.dialogs.length > 0 && (
          <section className={styles.dialogsSection}>
            {questionDetail.dialogs.map((dialog, index) => (
              <DialogItem
                key={dialog.id}
                dialog={dialog}
                dialogNumber={index + 1}
                showTranslation={false}
              />
            ))}
          </section>
        )}

        {/* No Details Available */}
        {!questionDetail && (
          <section className={styles.noDataSection}>
            <div className={styles.noDataMessage}>
              <h3>Question details are not available yet</h3>
              <p>This question is part of our collection, but detailed content including dialogs and audio are still being prepared.</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default QuestionDetail;
