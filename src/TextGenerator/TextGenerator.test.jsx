// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import TextGenerator from './TextGenerator'; // Adjust the path if necessary
// import {  } from '@testing-library/jest-dom';
// import fetchMock from 'jest-fetch-mock';

// // Mock the fetch API globally
// global.fetch = fetchMock;

// describe('TextGenerator Component', () => {
//   beforeEach(() => {
//     // Clear all mocks before each test
//     fetchMock.resetMocks();
//   });

//   // Helper function to simulate a successful API response
//   const mockSuccessfulFetch = (response: string) => {
//     fetchMock.mockResponse(JSON.stringify({
//       result: response,
//     }));
//   };

//   // Helper function to simulate an API error
//   const mockFailedFetch = () => {
//     fetchMock.mockReject(new Error('Failed to fetch'));
//   };

//   it('should render without crashing', () => {
//     render(<TextGenerator />);
//   });

//   it('should display the title and tagline', () => {
//     render(<TextGenerator />);
//     expect(screen.getByText(/The Wacky Word Wizard/i)).toBeInTheDocument();
//     expect(screen.getByText(/Your source for silly sentences and ludicrous literature!/i)).toBeInTheDocument();
//   });

//   it('should render the task selection dropdown', () => {
//     render(<TextGenerator />);
//     const selectElement = screen.getByLabelText(/Choose a Task/i);
//     expect(selectElement).toBeInTheDocument();
//   });

//   it('should render the input text field when a task is selected', () => {
//     render(<TextGenerator />);
//     const selectElement = screen.getByLabelText(/Choose a Task/i);
//     fireEvent.change(selectElement, { target: { value: 'story idea' } });
//     const inputElement = screen.getByLabelText(/Enter Theme\/Topic/i);
//     expect(inputElement).toBeInTheDocument();
//   });

//   it('should render the generate button when a task is selected', () => {
//     render(<TextGenerator />);
//     const selectElement = screen.getByLabelText(/Choose a Task/i);
//     fireEvent.change(selectElement, { target: { value: 'joke' } });
//     const generateButton = screen.getByText(/Generate/i);
//     expect(generateButton).toBeInTheDocument();
//   });

//   it('should update the task state when the dropdown changes', () => {
//     render(<TextGenerator />);
//     const selectElement = screen.getByLabelText(/Choose a Task/i);
//     fireEvent.change(selectElement, { target: { value: 'summary' } });
//     expect(selectElement.value).toBe('summary');
//   });

//   it('should update the input text state when the input field changes', () => {
//     render(<TextGenerator />);
//     const selectElement = screen.getByLabelText(/Choose a Task/i);
//     fireEvent.change(selectElement, { target: { value: 'story idea' } });
//     const inputElement = screen.getByLabelText(/Enter Theme\/Topic/i);
//     fireEvent.change(inputElement, { target: { value: 'A new story idea' } });
//     expect(inputElement.value).toBe('A new story idea');
//   });

//   it('should call handleGenerate when the generate button is clicked', async () => {
//     render(<TextGenerator />);
//     const selectElement = screen.getByLabelText(/Choose a Task/i);
//     fireEvent.change(selectElement, { target: { value: 'joke' } });
//     const inputElement = screen.getByLabelText(/Enter Theme\/Topic/i);
//     fireEvent.change(inputElement, { target: { value: 'Why did the chicken cross the road?' } });
//     const generateButton = screen.getByText(/Generate/i);

//     mockSuccessfulFetch('To get to the other side!');
//     fireEvent.click(generateButton);

//     await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
//     expect(fetchMock).toHaveBeenCalledWith(
//       'http://localhost:5000/generate',
//       expect.objectContaining({
//         method: 'POST',
//         body: expect.stringContaining('joke'),
//         }),
//     );
//   });

//   it('should display the generated text after successful API call', async () => {
//     render(<TextGenerator />);
//     const selectElement = screen.getByLabelText(/Choose a Task/i);
//     fireEvent.change(selectElement, { target: { value: 'summary' } });
//     const inputElement = screen.getByLabelText(/Enter Text to Summarize/i);
//     fireEvent.change(inputElement, { target: { value: 'This is a long text to summarize.' } });
//     const generateButton = screen.getByText(/Generate/i);

//     mockSuccessfulFetch('Summary: This is a long text.');
//     fireEvent.click(generateButton);

//     await screen.findByText(/Summary: This is a long text./i);
//   });

//   it('should display an error message when the API call fails', async () => {
//     render(<TextGenerator />);
//     const selectElement = screen.getByLabelText(/Choose a Task/i);
//     fireEvent.change(selectElement, { target: { value: 'story idea' } });
//     const inputElement = screen.getByLabelText(/Enter Theme\/Topic/i);
//     fireEvent.change(inputElement, { target: { value: 'A bad idea' } });
//     const generateButton = screen.getByText(/Generate/i);

//     mockFailedFetch();
//     fireEvent.click(generateButton);

//     await screen.findByText(/Error generating text./i);
//   });

//   it('should display loading state while waiting for API response', async () => {
//     render(<TextGenerator />);
//     const selectElement = screen.getByLabelText(/Choose a Task/i);
//     fireEvent.change(selectElement, { target: { value: 'joke' } });
//     const inputElement = screen.getByLabelText(/Enter Theme\/Topic/i);
//     fireEvent.change(inputElement, { target: { value: 'Another joke' } });
//     const generateButton = screen.getByText(/Generate/i);

//     // Simulate a delayed response
//     fetchMock.mockResponse(async () => {
//       await new Promise(resolve => setTimeout(resolve, 500)); // 0.5 second delay
//       return {
//         status: 200,
//         body: JSON.stringify({ result: 'Delayed joke' }),
//       };
//     });

//     fireEvent.click(generateButton);
//     expect(screen.getByText(/Generating.../i)).toBeInTheDocument();  // Check for "Generating..." text
//     await screen.findByText(/Delayed joke/i);
//   });

//   it('should disable the generate button when loading or input is empty', () => {
//       render(<TextGenerator />);
//       const generateButton = screen.getByText(/Generate/i);
//       expect(generateButton).toBeDisabled(); // Initially disabled

//       const selectElement = screen.getByLabelText(/Choose a Task/i);
//       fireEvent.change(selectElement, { target: { value: 'story idea' } });
//       expect(generateButton).toBeDisabled(); // Still disabled because input is empty

//       const inputElement = screen.getByLabelText(/Enter Theme\/Topic/i);
//       fireEvent.change(inputElement, { target: { value: 'Some input' } });
//       expect(generateButton).toBeEnabled(); // Enabled after input

//       // Simulate loading
//       fetchMock.mockResponse(async () => {
//         await new Promise(resolve => setTimeout(resolve, 500));
//         return { status: 200, body: JSON.stringify({ result: 'result' }) };
//       });
//       fireEvent.click(generateButton);
//       expect(generateButton).toBeDisabled(); // Disabled during loading
//   });

//     it('should display an error message if the input text is empty on generate', async () => {
//         render(<TextGenerator />);
//         const selectElement = screen.getByLabelText(/Choose a Task/i);
//         fireEvent.change(selectElement, { target: { value: 'summary' } });
//         const generateButton = screen.getByText(/Generate/i);
//         fireEvent.click(generateButton);
//         await waitFor(() => {
//             expect(screen.getByText(/Please enter a theme\/topic or text./i)).toBeInTheDocument();
//         });
//     });

//     it('should clear the input error message when the task is changed', async () => {
//         render(<TextGenerator />);
//         const selectElement = screen.getByLabelText(/Choose a Task/i);
//         const generateButton = screen.getByText(/Generate/i);

//         fireEvent.change(selectElement, { target: { value: 'summary' } });
//         fireEvent.click(generateButton);
//         await waitFor(() => {
//              expect(screen.getByText(/Please enter a theme\/topic or text./i)).toBeInTheDocument();
//         });
//         fireEvent.change(selectElement, { target: { value: 'joke' } });
//         expect(screen.queryByText(/Please enter a theme\/topic or text./i)).toBeNull();
//     });

//     it('should clear the input error message when the input text changes', async () => {
//         render(<TextGenerator />);
//         const selectElement = screen.getByLabelText(/Choose a Task/i);
//         fireEvent.change(selectElement, { target: { value: 'summary' } });
//         const inputElement = screen.getByLabelText(/Enter Text to Summarize/i);
//         const generateButton = screen.getByText(/Generate/i);
//         fireEvent.click(generateButton);
//        await waitFor(() => {
//              expect(screen.getByText(/Please enter a theme\/topic or text./i)).toBeInTheDocument();
//         });
//         fireEvent.change(inputElement, { target: { value: 'Some text' } });
//         expect(screen.queryByText(/Please enter a theme\/topic or text./i)).toBeNull();
//     });
// });
