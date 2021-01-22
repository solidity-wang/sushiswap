import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Label from '../../../components/Label'
import Spacer from '../../../components/Spacer'
import Value from '../../../components/Value'
import useAllEarnings from '../../../hooks/useAllEarnings'
import useAllStakedValue from '../../../hooks/useAllStakedValue'
import useFarms from '../../../hooks/useFarms'
import useTokenBalance from '../../../hooks/useTokenBalance'
// import useSushi from '../../../hooks/useSushi'
import usePresale from '../../../hooks/usePresale'
import { getDepositAmount } from '../../../presale/utils'


// import { getSushiAddress, getSushiSupply } from '../../../sushi/utils'
// import { getDepositAmount } from '../../../presale/Presale'
import { getBalanceNumber } from '../../../utils/formatBalance'

import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
  },
}));
const PrettoSlider = withStyles({
  root: {
    color: '#477ccc',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

const PendingRewards: React.FC = () => {
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [scale, setScale] = useState(1)

  const allEarnings = useAllEarnings()
  let sumEarning = 0
  for (let earning of allEarnings) {
    sumEarning += new BigNumber(earning)
      .div(new BigNumber(10).pow(18))
      .toNumber()
  }

  const [farms] = useFarms()

  const allStakedValue = useAllStakedValue()

  if (allStakedValue && allStakedValue.length) {
    const sumWeth = farms.reduce(
      (c, { id }, i) => c + (allStakedValue[i].totalWethValue.toNumber() || 0),
      0,
    )
  }

  useEffect(() => {
    setStart(end)
    setEnd(sumEarning)
  }, [sumEarning])

  return (
    <span
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'right bottom',
        transition: 'transform 0.5s',
        display: 'inline-block',
      }}
    >
      <CountUp
        start={start}
        end={end}
        decimals={end < 0 ? 4 : end > 1e5 ? 0 : 3}
        duration={1}
        onStart={() => {
          setScale(1.25)
          setTimeout(() => setScale(1), 600)
        }}
        separator=","
      />
    </span>
  )
}

const Balances: React.FC = () => {
  const classes = useStyles();
  
  const [DepositAmount, setDepositAmount] = useState<BigNumber>()

  const { account, ethereum }: { account: any; ethereum: any } = useWallet()

  const presale = usePresale();

  useEffect(() => {
    async function fetchDepositAmount() {
      const amount = await getDepositAmount(presale)
      setDepositAmount(amount)
    }
    if (presale.presale) {
      fetchDepositAmount()
    }
  }, [presale, setDepositAmount])

  let depositAmount = 0
  BigNumber.set({ DECIMAL_PLACES: 10 })
  if(DepositAmount)
    depositAmount = DepositAmount.toNumber() / 1E18

  return (
    <StyledWrapper>
      <Card>
        <CardContent>
          <StyledBalances>
            <StyledBalance>
              <Spacer />
              <div style={{ flex: 1 }}>
                <Label text="ETH Raised" />
                {/* <Value
          //        value={!!account ? getBalanceNumber(sushiBalance) : 'Locked'}
                /> */}
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item>
          {0}
        </Grid>
        <Grid item xs>
          <PrettoSlider className='' key={`PrettoSlider-${depositAmount}`} valueLabelDisplay="auto" defaultValue={depositAmount} min={0} max={1000}/>
        </Grid>
        <Grid item>
          {1000}
        </Grid>
      </Grid>
      <Spacer />
    </div>
              </div>
            </StyledBalance>
          </StyledBalances>
        </CardContent>
        <Footnote>
          Current Price
          <FootnoteValue>
            $ <PendingRewards />
          </FootnoteValue>
        </Footnote>
      </Card>
    </StyledWrapper>
  )
}

const Footnote = styled.div`
  font-size: 14px;
  padding: 8px 20px;
  color: ${(props) => props.theme.color.grey[400]};
  border-top: solid 1px ${(props) => props.theme.color.grey[300]};
`
const FootnoteValue = styled.div`
  font-family: 'Roboto Mono', monospace;
  float: right;
`

const StyledWrapper = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
`

const StyledBalances = styled.div`
  display: flex;
`

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
`

export default Balances
