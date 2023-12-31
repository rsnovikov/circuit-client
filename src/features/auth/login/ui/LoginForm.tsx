import { FC } from 'react';
import { useLoginMutation } from '@/entities/auth/api/api';
import { FormField } from '@/shared/model/types';
import { authSchema } from '../../../../shared/lib/authSchema';
import { Form } from '../../../../shared/ui/form/Form';

const formFields: FormField[] = [
  {
    name: 'email',
    title: 'Email',
    placeholder: 'job.novikovroman@gmail.com',
  },
  { name: 'password', type: 'password', title: 'Пароль' },
];

export const LoginForm: FC = () => {
  const [login, { error, isLoading }] = useLoginMutation();

  // todo: add normal typing
  const handleSubmit = (formData: { [key: string]: string }) => {
    if ('email' in formData && 'password' in formData) {
      login({ email: formData.email.trim(), password: formData.password.trim() });
    } else {
      throw new Error('Type error');
    }
  };

  return (
    <Form
      handleSubmit={handleSubmit}
      fields={formFields}
      error={error}
      schema={authSchema}
      isLoading={isLoading}
      btnText="Войти"
    />
  );
};
