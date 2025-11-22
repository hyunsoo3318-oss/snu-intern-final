import axios from 'axios';
import { useEffect, useState } from 'react';
import { FaBookmark } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import apiClient from '../api';
import { Post } from '../type';
import styles from './MyPage.module.css';

interface Profile {
  name: string;
  email: string;
  enrollYear: number;
  department: string;
}

const MyPage = () => {
  const [activeTab, setActiveTab] = useState('bookmarks');
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    if (activeTab === 'bookmarks') {
      const fetchBookmarkedPosts = async () => {
        try {
          const response = await apiClient.get('/api/post/bookmarks');
          setBookmarkedPosts(response.data.posts);
        } catch (error) {
          console.error('Failed to fetch bookmarked posts:', error);
        }
      };
      fetchBookmarkedPosts();
    } else if (activeTab === 'info') {
      const fetchProfile = async () => {
        try {
          const response = await apiClient.get('/api/applicant/me');
          setProfile(response.data);
          setProfileExists(true);
        } catch (error: unknown) {
          if (
            axios.isAxiosError(error) &&
            error.response &&
            error.response.data.code === 'APPLICANT_002'
          ) {
            setProfileExists(false);
          } else {
            console.error('Failed to fetch profile:', error);
          }
        }
      };
      fetchProfile();
    }
  }, [activeTab]);

  const calculateDday = (dateString: string | null | undefined) => {
    if (!dateString || dateString === '상시') return '상시';
    const endDate = new Date(dateString);
    const today = new Date();
    const utcEndDate = Date.UTC(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );
    const utcToday = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const diffTime = utcEndDate - utcToday;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return '마감';
    if (diffDays === 0) return 'D-day';
    return `D-${diffDays}`;
  };

  return (
    <div className={styles.myPage}>
      <h1 className={styles.title}>마이페이지</h1>
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${
            activeTab === 'bookmarks' ? styles.activeTab : ''
          }`}
          onClick={() => setActiveTab('bookmarks')}
        >
          관심공고
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === 'info' ? styles.activeTab : ''
          }`}
          onClick={() => setActiveTab('info')}
        >
          내 정보
        </div>
        {activeTab === 'info' && profileExists && (
          <Link to="/profile" className={styles.editProfileButton}>
            내 프로필 수정
          </Link>
        )}
      </div>
      {activeTab === 'bookmarks' && (
        <div>
          {bookmarkedPosts.map((post) => (
            <div key={post.id} className={styles.bookmarkCard}>
              <FaBookmark className={styles.bookmarkIcon} />
              <div className={styles.companyName}>{post.companyName}</div>
              <div className={styles.positionTitle}>{post.positionTitle}</div>
              <div
                className={styles.deadline}
                style={{
                  color:
                    calculateDday(post.employmentEndDate) === '마감'
                      ? 'red'
                      : 'blue',
                }}
              >
                {calculateDday(post.employmentEndDate)}
              </div>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'info' && (
        <div>
          {profileExists ? (
            <div className={styles.profileInfo}>
              <div className={styles.profileName}>{profile?.name}</div>
              <div className={styles.profileEmail}>{profile?.email}</div>
              <div className={styles.profileDetails}>
                {profile?.department.split(',').join(', ')}{' '}
                {profile?.enrollYear.toString().slice(-2)}학번
              </div>
            </div>
          ) : (
            <div className={styles.noProfile}>
              <h2>아직 프로필이 등록되지 않았어요!</h2>
              <p>기업에 소개할 나의 정보를 작성해서 나를 소개해보세요.</p>
              <Link to="/profile" className={styles.createProfileButton}>
                지금 바로 프로필 작성하기
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyPage;
