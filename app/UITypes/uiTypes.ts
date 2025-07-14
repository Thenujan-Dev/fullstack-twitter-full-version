export type SuggestedUserResponse = {
  id: string;
  profilePic: string;
  fullname: string;
  username: string;
};
export type UserRegisterType = {
  fullname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  link: string;
  bio: string;
};
export type UserLoginType = {
  username: string;
  password: string;
};
