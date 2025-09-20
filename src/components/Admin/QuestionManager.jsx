import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './QuestionManager.module.css';
import DialogManager from './DialogManager';
import AudioUpload from './AudioUpload';
import { addQuestion, updateQuestion, getQuestions } from '../../firebase/questionService';
import { addQuestionDetail, updateQuestionDetail, getQuestionDetail } from '../../firebase/questionDetailService';
import { useAuth } from '../../contexts/AuthContext';
import { useLoading } from '../../contexts/LoadingContext';
import { generateTTSForQuestion } from '../../firebase/functionsService';

const QuestionManager = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const { isAdmin } = useAuth();
  const isEditing = !!questionId;
  const { withLoading } = useLoading();
  const [formData, setFormData] = useState({
    questionTitle: '',
    category: 'housing',
    introduction: '',
    introductionAudio: '',
    isJiJing: false
  });
  
  const [dialogs, setDialogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ttsGenerating, setTtsGenerating] = useState(false);

  const categories = [
    { value: 'housing', label: 'Housing' },
    { value: 'social-welfare', label: 'Social Welfare' },
    { value: 'legal', label: 'Legal' },
    { value: 'immigration', label: 'Immigration' },
    { value: 'medical', label: 'Medical' }
  ];

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
      return;
    }
    
    if (isEditing) {
      loadQuestionData();
    } else {
      resetForm();
    }
  }, [questionId, isAdmin, navigate]);

  const loadQuestionData = async () => {
    try {
      setLoading(true);
      
      // Load detailed question data
      const questionDetail = await withLoading(() => getQuestionDetail(questionId));
      if (questionDetail) {
        setFormData({
          questionTitle: questionDetail.title || '',
          category: questionDetail.category || 'housing',
          introduction: questionDetail.introduction || '',
          introductionAudio: questionDetail.introductionAudio || '',
          isJiJing: questionDetail.isJiJing || false
        });
        setDialogs(questionDetail.dialogs || []);
      } else {
        setError('Question not found');
        setDialogs([]);
      }
    } catch (err) {
      console.error('Error loading question data:', err);
      setError('Failed to load question data');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      questionTitle: '',
      category: 'housing',
      introduction: '',
      introductionAudio: '',
      isJiJing: false
    });
    setDialogs([]);
    setError('');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIntroAudioUpload = (uploadResult) => {
    handleInputChange('introductionAudio', uploadResult.url);
  };

  const handleGenerateAudio = async () => {
    try {
      setTtsGenerating(true);
      setError('');

      const payload = {
        docId: questionId || undefined,
        introduction: formData.introduction,
        dialogs: dialogs.map(d => ({ id: d.id, originalText: d.originalText, translation: d.translation }))
      };

      const data = await withLoading(() => generateTTSForQuestion(payload));

      if (data?.introductionAudio) {
        handleInputChange('introductionAudio', data.introductionAudio);
      }

      if (Array.isArray(data?.dialogs)) {
        const updated = dialogs.map(d => {
          const found = data.dialogs.find(x => x.id === d.id);
          if (!found) return d;
          return {
            ...d,
            dialogAudio: found.dialogAudio || d.dialogAudio,
            translationAudio: found.translationAudio || d.translationAudio
          };
        });
        setDialogs(updated);
      }

    } catch (err) {
      console.error('Generate TTS error:', err);
      setError('Failed to generate audio. Please try again.');
    } finally {
      setTtsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.questionTitle.trim()) {
      setError('Question title is required');
      return;
    }

    if (!formData.introduction.trim()) {
      setError('Introduction is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      let currentQuestionId;

      if (isEditing) {
        // Update existing question
        currentQuestionId = questionId;
        
        // Update basic question info
        await withLoading(() => updateQuestion(currentQuestionId, {
          questionTitle: formData.questionTitle,
          category: formData.category,
          isJiJing: formData.isJiJing,
          updateTime: new Date()
        }));
      } else {
        // Create new question
        currentQuestionId = await withLoading(() => addQuestion({
          questionTitle: formData.questionTitle,
          category: formData.category,
          isJiJing: formData.isJiJing,
          questionDate: new Date(),
          updateTime: new Date(),
          uploadTime: new Date()
        }));
      }

      // Prepare question detail data
      const questionDetailData = {
        questionId: currentQuestionId,
        questionNumber: currentQuestionId.slice(-4).padStart(4, '0'),
        title: formData.questionTitle,
        category: formData.category,
        introduction: formData.introduction,
        introductionAudio: formData.introductionAudio,
        dialogs: dialogs
      };

      // Check if question detail already exists
      const existingDetail = await withLoading(() => getQuestionDetail(currentQuestionId));
      
      if (existingDetail) {
        // Update existing detail
        await withLoading(() => updateQuestionDetail(existingDetail.id, questionDetailData));
      } else {
        // Create new detail
        await withLoading(() => addQuestionDetail(questionDetailData));
      }

      // Navigate back to admin portal on success
      navigate('/admin');

    } catch (err) {
      console.error('Error saving question:', err);
      setError('Failed to save question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.loadingMessage}>Loading question data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isEditing ? 'Edit Question' : 'Create New Question'}
          </h2>
          <button onClick={() => navigate('/admin')} className={styles.cancelButton}>
            Back to Admin
          </button>
        </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Basic Question Info */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Basic Information</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Question Title *</label>
            <input
              type="text"
              value={formData.questionTitle}
              onChange={(e) => handleInputChange('questionTitle', e.target.value)}
              placeholder="Enter question title..."
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={styles.select}
                required
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.isJiJing}
                  onChange={(e) => handleInputChange('isJiJing', e.target.checked)}
                  className={styles.checkbox}
                />
                Exam Tips (Ji Jing)
              </label>
            </div>
          </div>
        </div>

        {/* Introduction Section */}
        <div className={styles.section}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h3 className={styles.sectionTitle} style={{border:'none', paddingBottom:0}}>Introduction</h3>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleGenerateAudio}
              disabled={ttsGenerating || !formData.introduction.trim()}
              title={!formData.introduction.trim() ? 'Enter introduction text first' : 'Generate audio from text'}
            >
              {ttsGenerating ? 'Generating...' : 'Generate Audio'}
            </button>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Introduction Text *</label>
            <textarea
              value={formData.introduction}
              onChange={(e) => handleInputChange('introduction', e.target.value)}
              placeholder="Enter question introduction..."
              className={styles.textarea}
              rows={4}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Introduction Audio</label>
            <AudioUpload
              onUploadComplete={handleIntroAudioUpload}
              label="Upload Introduction Audio"
              folder="audio/introductions"
              className={styles.audioUpload}
            />
            {formData.introductionAudio && (
              <div className={styles.audioPreview}>
                <audio controls src={formData.introductionAudio} className={styles.audioPlayer}>
                  Your browser does not support audio playback.
                </audio>
              </div>
            )}
          </div>
        </div>

        {/* Dialogs Section */}
        <div className={styles.section}>
          <DialogManager
            dialogs={dialogs}
            onDialogsChange={setDialogs}
            onGenerateDialogAudios={async (partial) => {
              // partial: { dialogs: [{id, originalText?}|{id, translation?}] }
              const payload = {
                docId: questionId || undefined,
                introduction: '',
                dialogs: partial.dialogs || []
              };
              const data = await withLoading(() => generateTTSForQuestion(payload));
              // 回调给子组件由其自行回填对应字段
              return data;
            }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className={styles.submitSection}>
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Question' : 'Create Question')}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
};

export default QuestionManager;
