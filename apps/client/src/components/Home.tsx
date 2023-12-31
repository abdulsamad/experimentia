import { useAtom, useAtomValue } from 'jotai';

import { chatSaveEffect, configAtom } from '@/store';
import Text from '@/components/Inputs/Text';
import Voice from '@/components/Inputs/Voice';
import { IS_SPEECH_RECOGNITION_SUPPORTED } from '@/utils';

const Home = () => {
  const { textInput } = useAtomValue(configAtom);

  // Subscribe to chat side effects
  useAtom(chatSaveEffect);

  return (
    <div className="flex flex-col">
      {!textInput && IS_SPEECH_RECOGNITION_SUPPORTED() ? <Voice /> : <Text />}
    </div>
  );
};

export default Home;
