import { useEffect, useState } from 'react';
import type { NavigateFunction } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMyInfo } from '../apis/auth';
import { usePreviewUrl } from './usePreviewUrl';

export const MY_INFO_QUERY_KEY = ['myInfo'] as const;

export function useMypage(
  isAuthenticated: boolean,
  isAuthLoading: boolean,
  navigate: NavigateFunction
) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');

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

  const remoteUrl = data?.data.avatar ?? null;
  const {
    previewUrl: avatarPreview,
    selectedFile: avatarFile,
    handleFileChange: handleAvatarChange,
  } = usePreviewUrl(settingsOpen, remoteUrl);

  useEffect(() => {
    if (!settingsOpen) {
      setName('');
      setBio('');
      return;
    }

    if (!data?.data) return;
    setName(data.data.name);
    setBio(data.data.bio ?? '');
  }, [settingsOpen, data]);

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
