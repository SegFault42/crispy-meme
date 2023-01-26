import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import { useState } from 'react'
import Web3 from 'web3';
import Chip from '@mui/material/Chip';
import db from "../../firebase";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const TxStatus = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
};

const Balance = () => {
    const [balance, setBalance] = useState(0);

    React.useEffect(() => {
        getBalance(); 
    }, []);

    const getBalance = async () => {
        // Check if MetaMask is available
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
                // Request account access if needed
                await window.ethereum.enable();
                // Get the current account
                const accounts = await web3.eth.getAccounts();
                const currentAccount = accounts[0];
                // Get the balance of the current account
                const balance = await web3.eth.getBalance(currentAccount);

                setBalance(Web3.utils.fromWei(balance, 'ether'));
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log('MetaMask is not installed or enabled.');
        }
    };

    return (
        <div>
            <Chip size='100px' color="primary" label={"Availbale balance: " + balance} />
        </div>
    );
};

function Transaction() {

    const [address, setAddress] = useState('')
    const [amount, setAmount] = useState('')
    const [transaction, setTansaction] = useState('')
    const [isShown, setIsShown] = useState(false);

    function isValidEthereumAddress(address) {
        return Web3.utils.isAddress(address)
    }

    function isValidAmount(amount) {
        if (amount > 0) {
            return true;
        }
        return false;
    }

    function GetCurentAddress() {
        if (window.ethereum) {
            return window.ethereum.selectedAddress
        }
    }

    function addFirebaseEntry(txHash, toAddr, fromAddr, amount) {

        db.collection("Transactions").doc(txHash).set({
            txHash: txHash,
            from: fromAddr,
            to: toAddr,
            amount: amount,
            date: new Date(),
            status: TxStatus.PENDING,
        }).then(() => {
            console.log("Document successfully written!");
        })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }

    const checkTransactionStatus = async (txHash) => {
        const web3 = new Web3(window.ethereum);
        const receipt = await web3.eth.getTransactionReceipt(txHash);
        if (receipt) {
            if (receipt.status) {
                console.log("Transaction successful");
                setTansaction(TxStatus.SUCCESS)
                db.collection("Transactions").doc(txHash).update({
                    status: TxStatus.SUCCESS,
                }).then(() => {
                    console.log("Document successfully updated!");
                })
                    .catch((error) => {
                        console.error("Error updating document: ", error);
                    });
            } else {
                console.log("Transaction failed");
                setTansaction(TxStatus.FAILED)
                db.collection("Transactions").doc(txHash).update({
                    status: TxStatus.FAILED,
                }).then(() => {
                    console.log("Document successfully updated!");
                })
                    .catch((error) => {
                        console.error("Error updating document: ", error);
                    });
            }
        } else {
            console.log("Transaction pending");
            setTansaction(TxStatus.PENDING)
            setTimeout(() => {
                checkTransactionStatus(txHash);

            }, 2000);
        }
    };


    const makeTransaction = async () => {

        const fromAddr = GetCurentAddress();
        const toAddr = address;

        if (isValidEthereumAddress(toAddr) && isValidAmount(fromAddr)) {
            const gasPrice = '0x5208' // 21000 Gas Price
            const amountHex = (amount * Math.pow(10, 18)).toString(16)

            const tx = {
                from: fromAddr,
                to: toAddr,
                value: amountHex,
                gas: gasPrice,
            }

            window.ethereum.request({ method: 'eth_sendTransaction', params: [tx] }).then((txHash) => {
                addFirebaseEntry(txHash, toAddr, fromAddr, amount)
                checkTransactionStatus(txHash)
                setTansaction("")
            }
            ).catch((error) => {
                console.log("Error:", error)
                setTansaction(error.message)
            })
            setIsShown(true)
        }
    }

    const handleClose = () => {
        setIsShown(false)
        setTansaction('')
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                component="form"
                sx={boxStyles}
                noValidate
                autoComplete="off"
            >
                <Typography align="center" variant="h6" >
                    Send Ethereum
                </Typography>

                {/* {
                address ?
            } */}

                <Balance />

                <FormControl sx={{ width: '80%' }}>

                    <TextField type="number" step="0.1" min='0' onChange={event => setAmount(event.target.value)}
                        fullWidth id="outlined-basic" label="Amount" variant="outlined" />
                </FormControl>

                <FormControl sx={{ width: '80%' }}>
                    <TextField onChange={event => setAddress(event.target.value)}
                        id="outlined-basic" label="Address" variant="outlined" />
                </FormControl>

                <Button
                    disabled={!isValidEthereumAddress(address) || !isValidAmount(amount)}
                    sx={{ width: '80%', height: '10%' }}
                    style={{ textTransform: 'none', fontWeight: 'bold' }}
                    variant="outlined"
                    color="inherit"
                    size="large"
                    onClick={() => { makeTransaction() }}
                >Send
                </Button>
                {
                    isShown === true && transaction ? (
                        <Snackbar open={isShown}
                            autoHideDuration={10000}
                            onClick={handleClose}
                            onClose={handleClose}
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        >
                            <Alert
                                onClose={handleClose}
                                severity={transaction === TxStatus.SUCCESS ? "success" : (transaction === TxStatus.PENDING) ? "info" : "error"}
                                sx={{ width: '100%' }}>
                                {transaction}
                            </Alert>
                        </Snackbar>
                    ) : (null)
                }
            </Box>
        </div>
    )
}

const boxStyles = {
    boxShadow: '1px 2px 9px #000000',
    margin: '4em',
    padding: '1em',
    width: 400,
    height: 500,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: '10px',
    backgroundColor: 'white',
};

export default Transaction;
