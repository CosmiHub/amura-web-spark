
export type AdminUser = {
  email: string;
  password: string;
  username: string;
};

export const ALLOWED_ADMINS: AdminUser[] = [
  {
    email: "uvcosmos2@gmail.com",
    password: "123Sumit_",
    username: "Sumit Raj"
  },
  {
    email: "srsaini2004@gmail.com",
    password: "123Saini_",
    username: "Saini"
  },
  {
    email: "sumitraj23aiml@rnsit.ac.in",
    password: "123Sumitraj_",
    username: "Sumit"
  }
];
