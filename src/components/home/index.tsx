import axios from 'axios';
import { Card } from 'baseui/card';
import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { StyledLink } from 'baseui/link';
import { ContainerHome } from '../commons';
import { useNavigate } from 'react-router-dom';
import { Table } from 'baseui/table-semantic';
import { useSignOut, useAuthUser } from 'react-auth-kit';
import { HeadingXXLarge, HeadingXLarge, HeadingLarge } from 'baseui/typography';
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationList,
  StyledNavigationItem,
} from 'baseui/header-navigation';

import { useState, useEffect } from 'react';

function Home() {
  const auth = useAuthUser();
  const singOut = useSignOut();
  const navigate = useNavigate();
  const [css, theme] = useStyletron();
  const [trans, setTrans] = useState();
  const [error, setError] = useState('');
  const [walletBalance, setWalletBalance] = useState();
  const [walletNumber, setWalletNumber] = useState();

  const [formValues, setFormValues] = useState({
    description: '',
    reference: '',
    amount: '',
    platform: '',
    type: 'credit',
  });

  const [formValuesDebit, setFormValuesDebit] = useState({
    receiverWalletNumber: '',
    reference: '',
    amount: '',
    type: 'debit',
  });

  useEffect(() => {
    getWalletBalance();
  }, []);

  const logout = () => {
    singOut();
    navigate('/login');
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}transaction/fund`,
        formValues,
        {
          headers: {
            Authorization: `Bearer ${auth()?.token}`,
          },
        }
      );
      navigate('/');
      getPayment();
    } catch (err) {
      // setError(err?.message);
      console.log('Error: ', err);
    }
  };

  const handleSubmitDebit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}transaction/send-money`,
        formValuesDebit,
        {
          headers: {
            Authorization: `Bearer ${auth()?.token}`,
          },
        }
      );

      navigate('/');
      getPayment();
    } catch (err) {
      // setError(err?.message);
      console.log('Error: ', err);
    }
  };

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
      // console.log('response: ', response);
      setWalletBalance(response.data?.data?.balance);
      setWalletNumber(response.data?.data?.walletNumber);
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
          marginBottom: '10px',
        })}
      >
        Wallet Balance: ₦{walletBalance}
      </HeadingXLarge>

      <HeadingLarge
        color="secondary500"
        className={css({
          marginBottom: '20px',
        })}
      >
        Wallet Number: {walletNumber}
      </HeadingLarge>

      <div
        className="row"
        style={{
          display: 'flex',
          padding: '10px',
        }}
      >
        <Card
          overrides={{
            Root: {
              style: {
                width: '328px',
                // padding: '20px',
                marginBottom: '10px',
                marginRight: '20px',
                // marginTop: '100px',
              },
            },
          }}
          title="Fund wallet "
        >
          <form onSubmit={handleSubmit}>
            <label>
              Amount :
              <input
                type="number"
                value={formValues.amount}
                onChange={(e) =>
                  setFormValues({ ...formValues, amount: e.target.value })
                }
              />
            </label>

            <label>
              Reference:
              <input
                type="text"
                value={formValues.reference}
                onChange={(e) =>
                  setFormValues({ ...formValues, reference: e.target.value })
                }
              />
            </label>

            <label>
              Description:
              <input
                type="text"
                value={formValues.description}
                onChange={(e) =>
                  setFormValues({ ...formValues, description: e.target.value })
                }
              />
            </label>

            <label>
              Platform:
              <select
                value={formValues.platform}
                onChange={(e) =>
                  setFormValues({ ...formValues, platform: e.target.value })
                }
              >
                <option value="">-- Select --</option>
                <option value="Type A">Paystack</option>
                <option value="Flutter">Flutter</option>
              </select>
            </label>
            <br />
            <br />
            <button type="submit"> Submit</button>
          </form>
          <text style={{ color: 'red' }}>{error}</text>
        </Card>

        <Card
          overrides={{
            Root: {
              style: {
                width: '328px',
                // padding: '20px',
                marginBottom: '10px',
                // marginTop: '100px',
              },
            },
          }}
          title="With from  wallet "
        >
          <form onSubmit={handleSubmitDebit}>
            <label>
              Amount :
              <input
                type="number"
                value={formValuesDebit.amount}
                onChange={(e) =>
                  setFormValuesDebit({
                    ...formValuesDebit,
                    amount: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Reference:
              <input
                type="text"
                value={formValuesDebit.reference}
                onChange={(e) =>
                  setFormValuesDebit({
                    ...formValuesDebit,
                    reference: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Receiver Wallet:
              <input
                type="text"
                value={formValuesDebit.receiverWalletNumber}
                onChange={(e) =>
                  setFormValuesDebit({
                    ...formValuesDebit,
                    receiverWalletNumber: e.target.value,
                  })
                }
              />
            </label>
            <br />
            <br />

            <button type="submit"> Submit</button>
          </form>
        </Card>
      </div>
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
      />
    </ContainerHome>
  );
}

export { Home };
