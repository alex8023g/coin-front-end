import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useState,
} from 'react';
import styles from './message.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { typeMsg } from '../AccountPage';

export function Message({
  isMsgOpen,
  setIsMsgOpen,
  textMsg,
  typeMsg,
}: {
  isMsgOpen: boolean;
  setIsMsgOpen: Dispatch<SetStateAction<boolean>>;
  textMsg: string;
  typeMsg: typeMsg;
}) {
  const [open, setOpen] = useState(false);

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsMsgOpen(false);
  };

  return (
    <Snackbar open={isMsgOpen} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={typeMsg}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {textMsg}
      </Alert>
    </Snackbar>
  );
}
