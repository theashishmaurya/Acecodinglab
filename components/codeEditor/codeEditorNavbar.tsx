import { Captions, FlaskConical, HardDriveUpload } from 'lucide-react';
import { Button } from '../ui/button';
import CountDown from '../ui/countdown';

const CodeEditorNavbar = () => {
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
            // onClick={() => setTestVisibility(true)}
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
            //   onClick={handleSubmit} disabled={isSubmitting}
          >
            <HardDriveUpload size={18} className="mr-1.5" />
            {/* {isSubmitting ? 'Submitting...' : 'Submit'} */}
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorNavbar;
