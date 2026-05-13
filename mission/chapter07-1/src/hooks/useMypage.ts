import { useEffect, useState, type ChangeEvent } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { getMyInfo } from '../apis/auth';
import type { ResponseMyInfo } from '../types/authType';

export function useMypage(
  isAuthenticated: boolean,
  isAuthLoading: boolean,
  navigate: NavigateFunction
) {
  const [data, setData] = useState<ResponseMyInfo | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      alert('로그인이 필요한 페이지입니다.');
      navigate('/login');
      return;
    }

    const getData = async () => {
      try {
        setIsDataLoading(true);
        const response = await getMyInfo();
        setData(response);
      } catch (error) {
        console.error('내 정보 불러오기 실패:', error);
      } finally {
        setIsDataLoading(false);
      }
    };

    if (isAuthenticated) {
      getData();
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  useEffect(() => {
    if (!settingsOpen || !data?.data) return;
    setName(data.data.name);
    setBio(data.data.bio ?? '');
    setAvatarFile(null);
    setAvatarPreview(data.data.avatar);
  }, [settingsOpen, data]);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview((prev) => {
      if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
  };

  return {
    data,
    setData,
    isDataLoading,
    settingsOpen,
    setSettingsOpen,
    name,
    setName,
    bio,
    setBio,
    avatarFile,
    avatarPreview,
    handleAvatarChange,
  };
}
