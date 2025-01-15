import { Spec } from "@codesandbox/sandpack-react/components/Tests/Specs";

interface TestResult {
    status: 'pass' | 'fail';
    name: string;
    errors?: Array<{ message: string }>;
  }
  
  interface FlattenedTestResult extends TestResult {
    path: string[];
  }
  
  export function flattenTestResults(data: Spec): FlattenedTestResult[] {
    const flattenedResults: FlattenedTestResult[] = [];
  
    function traverse(obj: Spec, path: string[] = []) {
      if (obj.tests) {
        Object.entries(obj.tests).forEach(([testName, testData]: [string, any]) => {
          flattenedResults.push({
            status: testData.status,
            name: testName,
            errors: testData.errors,
            path: [...path, testName],
          });
        });
      }
  
      if (obj.describes) {
        Object.entries(obj.describes).forEach(([describeName, describeData]: [string, any]) => {
          traverse(describeData, [...path, describeName]);
        });
      }
    }
  
    traverse(data);
    return flattenedResults;
  }
  
  