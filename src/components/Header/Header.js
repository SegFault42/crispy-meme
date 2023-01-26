import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState } from 'react';

const networkVersion = 0x5 // Goerli Testnet

function Header() {

    const [buttonText, setButtonText] = useState(checkMetamaskStatus);


    function checkMetamaskStatus() {
        if (!isMetaMaskInstalled()) {
            return 'Install MetaMask';
        } else if (!isGoerliTestnet()) {
            return 'Please select Goerli Testnet';
        } else if (!isMetaMaskConnected()) {
            return 'Connect to MetaMask';
        } else {
            return window.ethereum.selectedAddress.substring(0, 5) +
                "..." +
                window.ethereum.selectedAddress.substring(window.ethereum.selectedAddress.length - 5, window.ethereum.selectedAddress.length);
        }
    }

    function isMetaMaskConnected() {
        return Boolean(window.ethereum.selectedAddress);
    }

    function isGoerliTestnet() {
        return Boolean(window.ethereum.networkVersion === networkVersion.toString());
    }

    function isMetaMaskInstalled() {
        const { ethereum } = window;
        return Boolean(ethereum && ethereum.isMetaMask);
    }

    function DownloadMetaMask() {
        window.open('https://metamask.io/download.html', '_blank');
    }

    function GetCurentAddress() {
        if (window.ethereum) {
            return window.ethereum.selectedAddress
        }
    }

    function ConnectToMetaMask() {
        // Check if Goerli Testnet
        if (!isGoerliTestnet()) {
            setButtonText('Please select Goerli Testnet')
        } else if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(res => {
                    // Return the address of the wallet
                    console.log(res)
                })
            const address = GetCurentAddress();

            setButtonText(address.substring(0, 5) +
                "..." +
                address.substring(address.length - 5, address.length))

        } else {
            setButtonText('Install MetaMask')
        }
    }

    return (
        <AppBar position="static">
            <Toolbar style={{ background: '#272727' }}>
                <Typography align="left" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Ethereum Dashboard Management
                </Typography>
                <Button
                    style={{ textTransform: 'none', fontWeight: 'bold' }}
                    variant="outlined"
                    color="inherit"
                    size='large'
                    onClick={() => isMetaMaskInstalled() ? ConnectToMetaMask() : DownloadMetaMask()}>
                    {buttonText}
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
