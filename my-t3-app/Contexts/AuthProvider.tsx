/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/consistent-type-imports */
// contexts/AuthContext.tsx
import { createContext, ReactNode, useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Api from '../src/utils/api1';
import axios from 'axios';


interface IUser {
  name: string;
  email: string;
  password: string;
  bio: string;
  contact: string;
  course_module: string;
}

export interface IFormRegister extends IUser {
  ConfirmarSenha: string;
}

interface IProviderChildren {
  children: ReactNode;
}

interface IPost {
  token: string;
  user: IUser;
}

interface ITech {
  title: string;
  status: string;
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface IUserLogin {
  email: string;
  password: string;
}

interface IAuthContext {
  loginUser: (data: IUserLogin) => Promise<void>;
  registerUser: (data: IFormRegister) => Promise<void>;
  abrirModal: (data: boolean) => void;
  modalVisible: boolean;
  listaTech: ITech[];
  setListaTech: React.Dispatch<React.SetStateAction<ITech[]>>;
  usuarioLogado: IUser;
  setUsuarioLogado: React.Dispatch<React.SetStateAction<IUser>>;
  postRegisterTech: (data: ITech) => Promise<void>;
  deleteTech: (id: string) => Promise<void>;
  limparToken: () => void;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider = ({ children }: IProviderChildren) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [listaTech, setListaTech] = useState<ITech[]>([]);
  const [usuarioLogado, setUsuarioLogado] = useState({} as IUser);
  const token = localStorage.getItem('@TOKEN');
  // const router = useRouter();

  function abrirModal(data: boolean) {
    setModalVisible(data);
  }

  // Login

  async function loginUser(data: IUserLogin) {
    try {
        const realizandoLogin = await axios.post<IPost>('/sessions', data);

      if (realizandoLogin) {
        const { token } = realizandoLogin.data;
        localStorage.setItem('@TOKEN', token);
        console.log(realizandoLogin);
        // router.push('/dashboard');
      } else {
        alert('Houve algum problema');
      }
    } catch (error) {
      if(axios.isAxiosError(error))
      error.response!.data.message ===
        "Incorrect email / password combination" &&
      toast.error("E-mail ou senha incorreto!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      })
    }
  }

  // register

  // tipar o post
  async function registerUser(data: IFormRegister) {
    try {
      const cadastrando = await Api.post<IFormRegister>('/users', data);

      if (cadastrando) {
        toast.success('Usuario Cadastrado', { autoClose: 2000 });
        setTimeout(() => {
          // router.push('/');
        }, 2000);
      } else {
        alert('ocorreu algum erro');
      }
    } catch (error) {
      if ((error as any).response?.data?.message === 'Email already exists') {
        toast.error('E-mail já cadastrado', { autoClose: 2000 });
      }
    }
  }

  useEffect(() => {
    async function acessandoDados() {
      const token = localStorage.getItem('@TOKEN');
      if (token) {
        try {
          Api.defaults.headers['Authorization'] = `Bearer ${token}`;
          const infosUser = await Api.get('/profile');
          setUsuarioLogado(infosUser.data);
          setListaTech(infosUser.data.techs);
        } catch (error) {
          console.log(error);
        }
      }
    }
    acessandoDados();
  }, []);

  async function postRegisterTech(data: {}) {
    try {
      const response = await Api.post<IFormRegister>('/users/techs', data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`${response}`, {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error(`${error}`, {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  async function deleteTech(id: {}) {
    try {
      const response = await Api.delete(`/users/techs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`${response}`, {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error(`${error}`, {
        position: 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  function limparToken() {
    localStorage.clear();
  }

  return (
    <AuthContext.Provider
      value={{
        loginUser,
        registerUser,
        abrirModal,
        modalVisible,
        listaTech,
        setListaTech,
        usuarioLogado,
        setUsuarioLogado,
        postRegisterTech,
        deleteTech,
        limparToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
