import axios from 'axios';
import { Button } from 'baseui/button';
import { HeadingXXLarge, HeadingXLarge } from 'baseui/typography';
import { useSignOut, useAuthUser } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { Container, ContainerHome } from '../commons';
import { useStyletron } from 'baseui';
import { Table } from 'baseui/table-semantic';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { StyledLink } from 'baseui/link';
import { useFormik } from 'formik';

import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationList,
  StyledNavigationItem,
} from 'baseui/header-navigation';

import {
  ErrorText,
  InnerContainer,
  InputWrapper,
  StyledInput,
} from '../commons';

import { useState, useEffect } from 'react';

function Home() {
  const auth = useAuthUser();
  const singOut = useSignOut();
  const navigate = useNavigate();
  const [css, theme] = useStyletron();
  const [trans, setTrans] = useState();
  const [error, setError] = useState('');
  const [walletBalance, setWalletBalance] = useState();

  useEffect(() => {
    getWalletBalance();
  }, []);

  const logout = () => {
    singOut();
    navigate('/login');
  };

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
      console.log('Error: ', err);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit,
  });

  const getPayment = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}transaction/me`,
        {
          headers: {
            Authorization: `Bearer ${auth()?.token}`,
          },
        }
      );
      console.log('response: ', response);

      const finalData = response.data?.data.map((t: any, index: number) => {
        return [
          index + 1,
          t.description,
          t.type,
          t.amount,
          t.reference,
          t.createdAt,
        ];
      });
      setTrans(finalData);
    } catch (err) {
      console.log('Error: ', err);
    }
  };

  const getWalletBalance = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}wallet/me`,
        {
          headers: {
            Authorization: `Bearer ${auth()?.token}`,
          },
        }
      );
      console.log('response: ', response);
      setWalletBalance(response.data?.data?.balance);
      const finalData = response.data?.data.map((t: any, index: number) => {
        return [
          index + 1,
          t.description,
          t.type,
          t.amount,
          t.reference,
          t.createdAt,
        ];
      });
      console.log('DATA', finalData);
      setTrans(finalData);
    } catch (err) {
      console.log('Error: ', err);
    }
  };

  return (
    <ContainerHome>
      <HeaderNavigation>
        <StyledNavigationList $align={ALIGN.left}>
          <StyledNavigationItem color="#fff">Wegro</StyledNavigationItem>
        </StyledNavigationList>
        <StyledNavigationList $align={ALIGN.center} />
        <StyledNavigationList $align={ALIGN.right}>
          <StyledNavigationItem>
            <StyledLink href="#basic-link1">Fund Wallet</StyledLink>
          </StyledNavigationItem>
          <StyledNavigationItem>
            <StyledLink href="#basic-link1">Send Money</StyledLink>
          </StyledNavigationItem>
          {/* <StyledNavigationItem>
            <StyledLink href="#basic-link2">View Ledger</StyledLink>
          </StyledNavigationItem> */}
          <StyledNavigationItem>
            <StyledLink href="#basic-link2" onClick={getPayment}>
              View Transaction
            </StyledLink>
          </StyledNavigationItem>
        </StyledNavigationList>
        <StyledNavigationList $align={ALIGN.right}>
          <StyledNavigationItem>
            <Button onClick={logout}>Logout</Button>
          </StyledNavigationItem>
        </StyledNavigationList>
      </HeaderNavigation>

      <HeadingXXLarge
        color="secondary500"
        className={css({
          marginBottom: '20px',
        })}
      >
        Hello! {auth()?.user?.firstName} {auth()?.user?.lastName}
      </HeadingXXLarge>

      <HeadingXLarge
        color="secondary500"
        className={css({
          marginBottom: '20px',
        })}
      >
        Wallet Balance! {walletBalance}
      </HeadingXLarge>

      <FormControl label={() => 'label'} caption={() => 'caption'}>
        <Input />
      </FormControl>

      <Table
        columns={[
          'S/N',
          'Description',
          'Type',
          'Amount',
          'Reference',
          'CreatedAt',
        ]}
        data={trans}
        // data={[
        //   ['Sarah Brown', 31, '100 Broadway St., New York City, New York'],
        //   ['Jane Smith', 32, '100 Market St., San Francisco, California'],
        // ]}
      />
    </ContainerHome>
  );
}

export { Home };
