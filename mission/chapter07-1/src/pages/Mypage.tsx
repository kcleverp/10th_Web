import { useMutation, useQueryClient } from '@tanstack/react-query';

import { patchMyProfile } from '../apis/auth';

import type { RequestPatchUser } from '../types/authType';

import { useAuth } from '../context/AuthContext';

import { useNavigate } from 'react-router-dom';

import { uploadImage } from '../apis/uploadApi';

import { useMypage, MY_INFO_QUERY_KEY } from '../hooks/useMypage';



const Mypage = () => {

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { logout, isAuthenticated, isLoading: isAuthLoading, syncUserFromProfile } = useAuth();



  const {

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

  } = useMypage(isAuthenticated, isAuthLoading, navigate);



  const logoutMutation = useMutation({

    mutationFn: logout,

    onSuccess: () => navigate('/'),

  });



  const patchMutation = useMutation({

    mutationFn: async () => {

      const body: RequestPatchUser = {

        name: name.trim(),

      };

      const bioTrim = bio.trim();

      if (bioTrim) body.bio = bioTrim;

      else body.bio = null;



      if (avatarFile) {

        body.avatar = await uploadImage(avatarFile);

      }



      return patchMyProfile(body);

    },

    onSuccess: (res) => {
      if (res.data) {
        syncUserFromProfile({
          id: res.data.id,
          email: res.data.email,
          name: res.data.name,
        });
      }

      setSettingsOpen(false);

      queryClient.invalidateQueries({ queryKey: MY_INFO_QUERY_KEY });
    },

  });



  if (isAuthLoading || isDataLoading) {

    return (

      <div className="w-full h-[60vh] flex items-center justify-center">

        <p className="text-gray-400 animate-pulse text-sm font-medium tracking-widest">LOADING USER DATA...</p>

      </div>

    );

  }



  if (!data || !data.data) {

    return (

      <div className="w-full h-[60vh] flex items-center justify-center">

        <p className="text-red-400 text-sm italic">USER NOT FOUND.</p>

      </div>

    );

  }



  const u = data.data;



  return (

    <div className="w-full max-w-4xl mx-auto py-20 px-6">

      <div className="flex flex-col items-center border border-[#eee] bg-white p-12 rounded-2xl shadow-sm">

        <div className="w-20 h-20 bg-[#807bff10] rounded-full flex items-center justify-center mb-6 overflow-hidden">

          {u.avatar ? (

            <img src={u.avatar} alt="" className="w-full h-full object-cover" />

          ) : (

            <span className="text-[#807bff] text-3xl font-black">{u.name[0].toUpperCase()}</span>

          )}

        </div>



        <h1 className="text-3xl font-black tracking-tighter text-gray-900 mb-1">{u.name}</h1>

        <p className="text-sm text-gray-400 tracking-widest uppercase font-bold mb-2">{u.email}</p>

        {u.bio && <p className="text-xs text-gray-600 text-center max-w-md mb-6 leading-relaxed">{u.bio}</p>}



        <div className="w-full h-[1px] bg-[#f0f0f0] mb-6" />



        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[320px]">

          <button

            type="button"

            className="flex-1 py-4 border border-[#807bff] text-[#807bff] text-[10px] font-black tracking-[0.2em] hover:bg-[#f8f8ff] transition-all duration-300"

            onClick={() => setSettingsOpen(true)}

          >

            SETTINGS

          </button>

          <button

            type="button"

            className="flex-1 py-4 border border-black text-black text-[10px] font-black tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50"

            onClick={() => logoutMutation.mutate()}

            disabled={logoutMutation.isPending}

          >

            LOGOUT SYSTEM

          </button>

        </div>

      </div>



      {settingsOpen && (

        <div

          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm px-4"

          onClick={() => !patchMutation.isPending && setSettingsOpen(false)}

          role="presentation"

        >

          <div

            className="w-full max-w-md bg-white border border-[#eee] shadow-2xl rounded-sm p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"

            onClick={(e) => e.stopPropagation()}

            role="dialog"

            aria-modal="true"

          >

            <div className="flex justify-between border-b border-[#f0f0f0] pb-3">

              <h2 className="text-sm font-black tracking-widest text-[#807bff]">PROFILE SETTINGS</h2>

              <button type="button" className="text-gray-400 hover:text-black" onClick={() => setSettingsOpen(false)}>

                ×

              </button>

            </div>



            <label className="flex flex-col gap-1">

              <span className="text-[10px] font-black tracking-widest text-gray-400">NAME</span>

              <input

                value={name}

                onChange={(e) => setName(e.target.value)}

                className="border border-[#ccc] rounded-sm px-3 py-2 text-sm outline-none focus:border-[#807bff]"

              />

            </label>



            <label className="flex flex-col gap-1">

              <span className="text-[10px] font-black tracking-widest text-gray-400">BIO (선택)</span>

              <textarea

                value={bio}

                onChange={(e) => setBio(e.target.value)}

                rows={3}

                className="border border-[#ccc] rounded-sm px-3 py-2 text-sm outline-none focus:border-[#807bff] resize-none"

                placeholder="비워두면 저장 시 비게 됩니다."

              />

            </label>



            <div className="flex flex-col gap-2">

              <span className="text-[10px] font-black tracking-widest text-gray-400">AVATAR (선택)</span>

              <input type="file" accept="image/*" onChange={handleAvatarChange} className="text-xs" />

              {avatarPreview && (

                <img src={avatarPreview} alt="" className="w-16 h-16 rounded-full object-cover border border-[#eee]" />

              )}

            </div>



            <button

              type="button"

              disabled={patchMutation.isPending || !name.trim()}

              onClick={() => patchMutation.mutate()}

              className="w-full py-4 bg-black text-white text-[10px] font-black tracking-widest hover:bg-[#807bff] transition-colors disabled:bg-gray-300 rounded-sm"

            >

              {patchMutation.isPending ? 'SAVING…' : 'SAVE'}

            </button>

          </div>

        </div>

      )}

    </div>

  );

};



export default Mypage;

