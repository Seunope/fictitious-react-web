import { Button } from 'baseui/button';
import { HeadingXXLarge, HeadingXLarge } from 'baseui/typography';
import {
  Container,
  ErrorText,
  InnerContainer,
  InputWrapper,
  StyledInput,
} from '../commons';
import { StyledLink } from 'baseui/link';

import { useState } from 'react';
import { useFormik } from 'formik';
import axios, { AxiosError } from 'axios';
import { useSignIn } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';

function Login(props: any) {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (values: any) => {
    setError('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}auth/login`,
        values
      );

      signIn({
        token: response.data.token,
        expiresIn: 360000,
        tokenType: 'Bearer',
        authState: { user: response.data.user, token: response.data.token },
      });
      navigate('/');
    } catch (err) {
      if (err && err instanceof AxiosError)
        setError(err.response?.data.message);
      else if (err && err instanceof Error) setError(err.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit,
  });

  return (
    <Container>
      <HeadingXXLarge color="black">Fictitious Bank</HeadingXXLarge>

      <InnerContainer>
        <form onSubmit={formik.handleSubmit}>
          <HeadingXLarge>Hey, welcome back!</HeadingXLarge>
          <ErrorText>{error}</ErrorText>
          <InputWrapper>
            <StyledInput
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              placeholder="Email"
              clearOnEscape
              size="large"
              type="email"
            />
          </InputWrapper>
          <InputWrapper>
            <StyledInput
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              placeholder="Password"
              clearOnEscape
              size="large"
              type="password"
            />
          </InputWrapper>

          <InputWrapper>
            <Button size="large" kind="primary" isLoading={formik.isSubmitting}>
              Login
            </Button>
          </InputWrapper>
          <StyledLink onClick={() => navigate('/register')}>Sign up</StyledLink>
        </form>
      </InnerContainer>
    </Container>
  );
}

export { Login };
