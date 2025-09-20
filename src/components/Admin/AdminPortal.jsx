import React, { useState, useEffect } from 'react';
import { useLoading } from '../../contexts/LoadingContext';
import { useNavigate } from 'react-router-dom';
import styles from './AdminPortal.module.css';
import { getQuestions, deleteQuestion } from '../../firebase/questionService';
import { useAuth } from '../../contexts/AuthContext';

const AdminPortal = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('questions');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { withLoading } = useLoading();
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadQuestions();
    }
  }, [isAdmin]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const questionsData = await withLoading(() => getQuestions());
      setQuestions(questionsData);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await deleteQuestion(questionId);
      await loadQuestions(); // Reload the list
    } catch (err) {
      console.error('Error deleting question:', err);
      setError('Failed to delete question');
    }
  };

  const handleEditQuestion = (question) => {
    navigate(`/admin/question/edit/${question.id}`);
  };

  const handleCreateNew = () => {
    navigate('/admin/question/new');
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

  if (!isAdmin) {
    return (
      <div className={styles.container}>
        <div className={styles.accessDenied}>
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin portal.</p>
        </div>
      </div>
    );
  }


  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Admin Portal</h1>
          <div className={styles.userInfo}>
            Welcome, {user?.displayName || user?.email}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className={styles.tabsContainer}>
        <div className={styles.tabs}>
          <button
            onClick={() => setActiveTab('questions')}
            className={`${styles.tab} ${activeTab === 'questions' ? styles.activeTab : ''}`}
          >
            Questions Management
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`${styles.tab} ${activeTab === 'users' ? styles.activeTab : ''}`}
          >
            User Management
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {activeTab === 'questions' && (
          <div className={styles.questionsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Questions Management</h2>
              <button 
                onClick={handleCreateNew}
                className={styles.createButton}
              >
                + Create New Question
              </button>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            {loading ? (
              <div className={styles.loadingMessage}>
                Loading questions...
              </div>
            ) : (
              <div className={styles.questionsList}>
                {questions.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>No questions found. Create your first question to get started.</p>
                  </div>
                ) : (
                  questions.map((question) => {
                    const categoryInfo = getCategoryInfo(question.category);
                    return (
                      <div key={question.id} className={styles.questionCard}>
                        <div className={styles.questionHeader}>
                          <div className={styles.questionInfo}>
                            <h3 className={styles.questionTitle}>
                              {question.title || question.questionTitle}
                            </h3>
                            <div className={styles.questionMeta}>
                              <span 
                                className={styles.categoryTag}
                                style={{ backgroundColor: categoryInfo.color }}
                              >
                                {categoryInfo.label}
                              </span>
                              {question.isJiJing && (
                                <span className={styles.jiJingTag}>
                                  Exam Tips
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={styles.questionActions}>
                            <button
                              onClick={() => handleEditQuestion(question)}
                              className={styles.editButton}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className={styles.deleteButton}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className={styles.questionFooter}>
                          <span className={styles.questionDate}>
                            Created: {new Date(question.uploadTime?.toDate?.() || question.uploadTime).toLocaleDateString()}
                          </span>
                          <span className={styles.questionId}>
                            ID: {question.id.slice(-8)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className={styles.usersSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>User Management</h2>
            </div>
            <div className={styles.comingSoon}>
              <p>User management features coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPortal;
