
export interface RegisterFormValues {
  name: string;
  email: string;
  phonenumber: string;
  date_of_birth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  password: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}
