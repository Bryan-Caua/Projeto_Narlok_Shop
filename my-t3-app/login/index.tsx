/* eslint-disable @typescript-eslint/no-misused-promises */
import { useContext } from 'react';
// import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext, IUserLogin } from '../Contexts/AuthProvider';
import styles from './LoginStyle.module.css';
import styles2 from './FormStyle.module.css';
import Image from '../../assets/logo.svg';
import Link from 'next/link';

const schema = yup.object().shape({
  email: yup.string().required('E-mail Obrigatório').email('E-mail Inválido'),
  password: yup.string().required('O campo senha é obrigatório'),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserLogin>({ resolver: yupResolver(schema) });

  const { loginUser } = useContext(AuthContext);
  // const router = useRouter();

  const onSubmit = async (data: IUserLogin) => {
    await loginUser(data);
    // router.push('/');
  };

  return (
    <>
      <div className={styles.loginStyle}>
        <div>
          <Image src="/images/my-photo.jpg" alt="Minha Foto" width={500} height={300} />
        </div>
        <div className={styles.div1Login}>
          <h2>Login</h2>
          <form className={styles2.FormStyle} onSubmit={handleSubmit(onSubmit)}>
            <label>
              Email
              <input
                type="text"
                id="email"
                {...register('email')}
                placeholder="Digite seu e-mail"
              />
              <p id="p1login">{errors.email?.message}</p>
            </label>

            <label>
              Senha
              <input
                type="password"
                id="password"
                {...register('password')}
                placeholder="Digite sua senha"
              />
              <p id="p2login">{errors.password?.message}</p>
            </label>

            <button type="submit">Entrar</button>
          </form>
          <div>
            <p id="p3login">Ainda não possui uma conta?</p>
            <Link href="/register">
              <a>
                <button id="botaoLink">Cadastre-se</button>
              </a>
            </Link>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;
