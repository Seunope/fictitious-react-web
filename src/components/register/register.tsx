import {
  Container,
  ErrorText,
  InnerContainer,
  InputWrapper,
  StyledInput,
} from '../commons';
import { useState } from 'react';
import { useFormik } from 'formik';
import { Button } from 'baseui/button';
import axios, { AxiosError } from 'axios';
import { useSignIn } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { HeadingXXLarge, HeadingXLarge } from 'baseui/typography';

function Register(props: any) {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (values: any) => {
    setError('');
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}user/signup`,
        values
      );

      navigate('/login');
    } catch (err) {
      if (err && err instanceof AxiosError)
        setError(err.response?.data.message);
      else if (err && err instanceof Error) setError(err.message);

      console.log('Error: ', err);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    },
    onSubmit,
  });

  return (
    <Container>
      <HeadingXXLarge color="black">Fictitious Bank</HeadingXXLarge>

      <InnerContainer>
        <form onSubmit={formik.handleSubmit}>
          <HeadingXLarge>Hey, create an account!</HeadingXLarge>
          <ErrorText>{error}</ErrorText>

          <InputWrapper>
            <StyledInput
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              placeholder="First name"
              clearOnEscape
              size="large"
              // type="email"
            />
          </InputWrapper>
          <InputWrapper>
            <StyledInput
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              placeholder="Last name"
              clearOnEscape
              size="large"
              // type="email"
            />
          </InputWrapper>

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
              Sign up
            </Button>
          </InputWrapper>
        </form>
      </InnerContainer>
    </Container>
  );
}

export { Register };
