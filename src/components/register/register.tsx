import { Button } from 'baseui/button';
import { Input } from 'baseui/input';
import styled from 'styled-components';
import {
  HeadingXXLarge,
  HeadingXLarge,
  HeadingLarge,
  HeadingMedium,
  HeadingSmall,
  HeadingXSmall,
} from 'baseui/typography';
import {
  Container,
  ErrorText,
  InnerContainer,
  InputWrapper,
  StyledInput,
} from '../commons';

import { useSignIn } from 'react-auth-kit';
import { useFormik } from 'formik';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register(props: any) {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (values: any) => {
    console.log('Values: ', values);
    setError('');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}user/signup`,
        values
      );

      console.log('GGG', response);
      navigate('/login');
    } catch (err) {
      console.log('sdsdsds', err);
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
