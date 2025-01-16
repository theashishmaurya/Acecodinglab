import { FlaskConical, HardDriveUpload, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import CountDown from '../ui/countdown';
import { useSideNav } from '@/app/lab/sideNav.provider';
import { useCallback, useRef } from 'react';

const CodeEditorNavbar = () => {
  const { setToggleTestPanel, toggleTestPanel, setIsSubmitting, isSubmitting } =
    useSideNav();

  const handleSubmit = () => {
    setIsSubmitting(true);
    /** If Test Panel open close it wait for a sec open it again. */
    if (toggleTestPanel === true) {
      setToggleTestPanel(false);
      setTimeout(() => {
        setToggleTestPanel(true);
      }, 1);
    } else {
      setToggleTestPanel(true);
    }
  };
  return (
    <div className="flex justify-end items-center my-4">
      <div className="mx-2">
        <CountDown
          hr={0}
          min={0}
          second={10}
          onCounterEnd={() => {
            console.log('counter Ended');
          }}
          autoStart={false}
        />
      </div>
      <div className="flex justify-end items-end">
        <div className="mx-2">
          <Button
            className="flex items-center"
            // Dark theme button
            onClick={() => setToggleTestPanel(!toggleTestPanel)}
            size={'xs'}
          >
            <FlaskConical size={'18'} className="mr-1" />
            Test
          </Button>
        </div>
        <div className="mx-2">
          <Button
            className="bg-green-700 text-white-foreground hover:bg-green/90 flex items-center"
            size="xs"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin mx-4" />
            ) : (
              <HardDriveUpload size={18} className="mr-1.5" />
            )}
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorNavbar;
