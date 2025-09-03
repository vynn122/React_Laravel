import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
// export const profileStore = create((set) => ({
//   //   profile: {
//   //     id: null,
//   //     name: null,
//   //     email: null,
//   //     image: "",
//   //     role: null,
//   //     permission: null,
//   //   },
//   profile: null,
//   accessToken: null,

//   setProfile: (dataProfile) =>
//     set((pre) => ({ profile: { ...pre.profile, ...dataProfile } })),
//   setAccessToken: (token) => set((pre) => ({ accessToken: token })),
//   logout: () => set({ profile: null }),
// }));

export const profileStore = create(
  persist(
    (set, get) => ({
      profile: null,
      accessToken: null,
      setProfile: (dataProfile) =>
        set((pre) => ({ profile: { ...pre.profile, ...dataProfile } })),
      setAccessToken: (token) => set((pre) => ({ accessToken: token })),
      logout: () => set({ profile: null }),
    }),
    {
      name: "profile",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
