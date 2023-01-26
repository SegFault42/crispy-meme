import Alert from '@mui/material/Alert';
import { TxStatus } from './Transaction/Transaction';
// import AlertTitle from '@mui/material/AlertTitle';

export default function ErrorMessage({ message }) {
    // if (!message) return null;

    // let messageStatus = ""

    // if (message === TxStatus.SUCCESS) {
    //     messageStatus = "Transaction done !"
    // } else if (message === TxStatus.FAILED) {
    //     messageStatus = "Transaction failed !"
    // } else if (message === TxStatus.PENDING) {
    //     messageStatus = "Transaction pending !"
    // }

    return (
        <div className="alert alert-error mt-5">
            <div className="flex-1">
                <Alert severity={message === TxStatus.SUCCESS ? "success": (message === TxStatus.PENDING) ? "info" : "error"}>
                    {message === "" ? <strong>Transaction done !</strong> : <strong>{message}</strong>}
                </Alert>
            </div>
        </div>
    );
}
