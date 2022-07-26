import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import truncateEthAddress from 'truncate-eth-address';
import './App.css';
import abi from './utils/WavePortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [totalWaveCount, setTotalWaveCount] = useState(0);
  const [totalUserWaveCount, setTotalUserWaveCount] = useState(0);

  const contractAddress = '0x5a04eD7D8B12b9554fEA620ddE7618401bbf529E';
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have metamask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];

        console.log('Found an authorized account:', account);

        setCurrentAccount(account);
        getTotalWaveCount();
      } else {
        console.log('No authorized account found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const waveTxn = await wavePortalContract.wave();
        console.log('Mining...', waveTxn.hash);

        await waveTxn.wait();
        console.log('Mined -- ', waveTxn.hash);

        getTotalWaveCount();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalWaveCount = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        let count = await wavePortalContract.getTotalWaves();
        console.log('Retrieved total wave count...', count.toNumber());

        let userWaveCount = await wavePortalContract.getTotalWavesFor(
          currentAccount
        );

        console.log(
          'Retrieved total wave count for address...',
          userWaveCount.toNumber()
        );

        setTotalWaveCount(count.toNumber());
        setTotalUserWaveCount(userWaveCount.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [currentAccount, contractAddress, contractABI]);

  return (
    <div className='mainContainer'>
      <div className='dataContainer'>
        <div className='header'>
          <span role='img' aria-label='Waving hand sign emoji'>
            👋
          </span>{' '}
          Hey there!
        </div>

        <div className='bio'>
          <p>
            I am Fecony and I learn about web3 & Solidity{' '}
            <span role='img' aria-label='Octopus emoji'>
              🐙
            </span>
            .{' '}
          </p>
          <p>Connect your Ethereum wallet and wave at me!</p>
        </div>

        <div className='wave-count'>
          <div className='wave-count-container'>
            {currentAccount && totalUserWaveCount && totalWaveCount ? (
              <>
                <div className='wave-count-header'>
                  <span role='img' aria-label='Waving hand sign emoji'>
                    👋
                  </span>{' '}
                  Total :{' '}
                  <span className='wave-count-text'>{totalWaveCount}</span>
                </div>
                <div className='wave-count-header'>
                  <span role='img' aria-label='Waving hand sign emoji'>
                    👋
                  </span>{' '}
                  Wave Count from {truncateEthAddress(currentAccount)} :{' '}
                  <span className='wave-count-text'>{totalUserWaveCount}</span>
                </div>
              </>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 100 100'
                className='loader'
                xmlSpace='preserve'
              >
                <path
                  fill='red'
                  d='M73 50c0-12.7-10.3-23-23-23S27 37.3 27 50m3.9 0c0-10.5 8.5-19.1 19.1-19.1S69.1 39.5 69.1 50'
                >
                  <animateTransform
                    attributeName='transform'
                    attributeType='XML'
                    type='rotate'
                    dur='1s'
                    from='0 50 50'
                    to='360 50 50'
                    repeatCount='indefinite'
                  />
                </path>
              </svg>
            )}
          </div>
        </div>

        <button
          className='waveButton'
          disabled={!currentAccount}
          onClick={wave}
        >
          Wave at Me{' '}
          <span role='img' aria-label='Waving hand sign emoji'>
            👋
          </span>{' '}
        </button>

        {!currentAccount && (
          <button className='waveButton' onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
