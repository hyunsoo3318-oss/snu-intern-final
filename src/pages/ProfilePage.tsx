import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api';
import styles from './ProfilePage.module.css';

interface ProfileData {
  enrollYear: number;
  department: string;
  cvKey: string;
}

const ProfilePage = () => {
  const [enrollYear, setEnrollYear] = useState('');
  const [departments, setDepartments] = useState<string[]>(['']);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);

  const [enrollYearError, setEnrollYearError] = useState('');
  const [departmentsError, setDepartmentsError] = useState('');
  const [cvError, setCvError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/api/applicant/me');
        const data: ProfileData = response.data;
        setEnrollYear(data.enrollYear.toString().slice(-2));
        setDepartments(data.department.split(','));
        setCvFileName(data.cvKey.split('/').pop() || null);
      } catch (error: unknown) {
        if (
          axios.isAxiosError(error) &&
          error.response &&
          error.response.data.code === 'APPLICANT_002'
        ) {
          // Profile does not exist, so we are creating a new one
        } else {
          console.error('Failed to fetch profile:', error);
          setGeneralError('Failed to load profile data.');
        }
      }
    };
    fetchProfile();
  }, []);

  const handleDepartmentChange = (index: number, value: string) => {
    const newDepartments = [...departments];
    newDepartments[index] = value;
    setDepartments(newDepartments);
    setDepartmentsError('');
  };

  const addDepartment = () => {
    if (departments.length < 7) {
      setDepartments([...departments, '']);
    }
  };

  const removeDepartment = (index: number) => {
    if (departments.length > 1) {
      const newDepartments = [...departments];
      newDepartments.splice(index, 1);
      setDepartments(newDepartments);
    }
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        setCvError('Only PDF files are allowed for CV.');
        setCvFile(null);
        setCvFileName(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setCvError('CV file size cannot exceed 5MB.');
        setCvFile(null);
        setCvFileName(null);
        return;
      }
      setCvFile(file);
      setCvFileName(file.name);
      setCvError('');
    }
  };

  const validateForm = () => {
    let isValid = true;

    // Validate enrollYear
    if (!enrollYear || !/^\d{2}$/.test(enrollYear)) {
      setEnrollYearError('두 자리 숫자로 작성해주세요. (e.g. 25)');
      isValid = false;
    } else {
      setEnrollYearError('');
    }

    // Validate departments
    if (departments.some((dep) => !dep.trim())) {
      setDepartmentsError(
        '주전공은 필수 작성이며, 다전공은 총 6개 이하로 중복되지 않게 입력해주세요.'
      );
      isValid = false;
    } else if (new Set(departments).size !== departments.length) {
      setDepartmentsError(
        '주전공은 필수 작성이며, 다전공은 총 6개 이하로 중복되지 않게 입력해주세요.'
      );
      isValid = false;
    } else {
      setDepartmentsError('');
    }

    // Validate CV
    if (!cvFile && !cvFileName) {
      setCvError('5MB 이하의 PDF 파일을 올려주세요.');
      isValid = false;
    } else {
      setCvError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError(''); // Clear general error before validation

    if (!validateForm()) {
      return;
    }

    const formattedEnrollYear =
      parseInt(enrollYear) < 50
        ? 2000 + parseInt(enrollYear)
        : 1900 + parseInt(enrollYear);
    const formattedDepartments = departments.join(',');
    const randomString = Math.random().toString(36).substring(2, 12);
    const date = new Date();
    const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
    const cvKey = cvFileName
      ? `static/private/CV/${randomString}_${formattedDate}/${cvFileName}`
      : '';

    try {
      await apiClient.put('/api/applicant/me', {
        enrollYear: formattedEnrollYear,
        department: formattedDepartments,
        cvKey: cvKey,
      });
      alert('Profile saved successfully!');
      navigate('/mypage');
    } catch (error) {
      console.error('Failed to save profile:', error);
      setGeneralError('Failed to save profile. Please try again.');
    }
  };

  return (
    <div className={styles.profilePage}>
      <h1 className={styles.title}>프로필 생성</h1>
      <h2 className={styles.sectionTitle}>필수 작성 항목</h2>
      <p>아래 항목은 필수로 작성해주세요.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        {generalError && <p className={styles.generalError}>{generalError}</p>}
        <div className={styles.formGroup}>
          <label>학번 *</label>
          <div className={styles.studentIdInput}>
            <input
              type="text"
              value={enrollYear}
              onChange={(e) => setEnrollYear(e.target.value)}
              maxLength={2}
            />
            <span>학번</span>
          </div>
          {enrollYearError && (
            <p className={styles.errorText}>{enrollYearError}</p>
          )}
        </div>
        <div className={styles.formGroup}>
          <label>학과 *</label>
          {departments.map((department, index) => (
            <div
              key={index}
              className={index > 0 ? styles.departmentInput : ''}
            >
              <input
                type="text"
                value={department}
                onChange={(e) => handleDepartmentChange(index, e.target.value)}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeDepartment(index)}
                  className={`${styles.button}`}
                >
                  삭제
                </button>
              )}
            </div>
          ))}
          {departments.length < 7 && (
            <button type="button" onClick={addDepartment}>
              추가
            </button>
          )}
          {departmentsError && (
            <p className={styles.errorText}>{departmentsError}</p>
          )}
        </div>
        <div className={styles.formGroup}>
          <label>이력서 (CV) *</label>
          {cvFileName ? (
            <div className={styles.cvSelected}>
              <div className={styles.cvFileName}>{cvFileName}</div>
              <button
                type="button"
                onClick={() => {
                  setCvFile(null);
                  setCvFileName(null);
                  setCvError('');
                }}
                className={`${styles.button} ${styles.deleteButton}`}
              >
                삭제
              </button>
            </div>
          ) : (
            <div className={styles.cvInput}>
              <label htmlFor="cv-upload">↑ PDF 파일만 업로드 가능해요.</label>
              <input
                id="cv-upload"
                type="file"
                accept=".pdf"
                onChange={handleCvChange}
                style={{ display: 'none' }}
              />
            </div>
          )}
          {cvError && <p className={styles.errorText}>{cvError}</p>}
        </div>
        <div>
          <button
            type="submit"
            className={`${styles.button} ${styles.saveButton}`}
          >
            저장
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`${styles.button} ${styles.backButton}`}
          >
            뒤로가기
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
