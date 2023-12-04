import { useAtomValue } from 'jotai';

import { configAtom } from '@/store';
import Text from '@/components/Inputs/Text';
import Voice from '@/components/Inputs/Voice';

const Editor = () => {
  const { textInput } = useAtomValue(configAtom);

  return <div className="flex flex-col">{textInput ? <Text /> : <Voice />}</div>;
};

export default Editor;
