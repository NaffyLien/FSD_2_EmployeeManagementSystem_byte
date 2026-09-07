import { useLogin } from '../hooks/useLogin';
import { LoginForm } from './LoginForm';

export function LoginPage() {
  const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLogin();

  return (
    <LoginForm
      onSubmit={handleSubmit}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      error={error}
      loading={loading} />
  );
}
