import { useAtomValue } from 'jotai';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { configAtom } from '@/store';
import Text from '@/components/Inputs/Text';
import Voice from '@/components/Inputs/Voice';

const Editor = () => {
  const { textInput } = useAtomValue(configAtom);

  return (
    <div className="flex flex-col">
      {textInput ? <Text /> : <Voice />}
      <ToastContainer theme="dark" pauseOnHover draggable hideProgressBar />
    </div>
  );
};

export default Editor;
