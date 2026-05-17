import { useEffect, useState, type ChangeEvent } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '../apis/auth';

export const MY_INFO_QUERY_KEY = ['myInfo'] as const;

export function useMypage(
  isAuthenticated: boolean,
  isAuthLoading: boolean,
  navigate: NavigateFunction
) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      alert('로그인이 필요한 페이지입니다.');
      navigate('/login');
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  const { data, isLoading: isQueryLoading } = useQuery({
    queryKey: MY_INFO_QUERY_KEY,
    queryFn: getMyInfo,
    enabled: isAuthenticated && !isAuthLoading,
  });

  const isDataLoading = isAuthenticated && !isAuthLoading && isQueryLoading;

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
