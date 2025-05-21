import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import { Container, Box } from '@mui/material';
import axios from 'axios';
import './TextGenerator.css'; // Import the CSS file
import { FormHelperText } from '@mui/material';

const TextGenerator = () => {
  const [task, setTask] = useState('');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState('');

  const handleTaskChange = (event) => {
    setTask(event.target.value);
    setInputText('');
    setOutputText('');
    setInputError(''); // Clear error on task change
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
    setInputError(''); // Clear error on input change
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setInputError('Please enter a theme/topic or text.');
      return;
    }

    setLoading(true);
    setOutputText('');
    try {
      const response = await axios.post('http://localhost:5000/generate', {
        task: task,
        prompt: inputText,
      });
      setOutputText(response.data.result);
    } catch (error) {
      console.error('Error generating text:', error);
      setOutputText('Error generating text.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="root">
      <Typography variant="h4" component="h1" gutterBottom className="title">
        {/* Changed title and added tagline */}
        The Wacky Word Wizard
        <Typography variant="subtitle1" component="h2" className="tagline">
          Your source for silly sentences and ludicrous literature!
        </Typography>
      </Typography>

      <FormControl className="formControl" error={!!inputError}>
        <InputLabel id="task-select-label" className="label">Choose a Task</InputLabel>
        <Select
          labelId="task-select-label"
          id="task-select"
          value={task}
          label="Choose a Task"
          onChange={handleTaskChange}
          className="select"
          error={!!inputError}
        >
          <MenuItem value="story idea">Story Idea</MenuItem>
          <MenuItem value="joke">Joke</MenuItem>
          <MenuItem value="summary">Summary</MenuItem>
        </Select>
      </FormControl>

      {task && (
        <FormControl className="formControl" error={!!inputError}>
          <TextField
            label={task === 'summary' ? 'Enter Text to Summarize' : 'Enter Theme/Topic'}
            value={inputText}
            onChange={handleInputChange}
            multiline
            rows={4}
            className="textField"
            error={!!inputError}
            placeholder={inputError ? " " : "Enter here..."} // Added placeholder
          />
          <FormHelperText className="errorText">{inputError}</FormHelperText>
        </FormControl>
      )}

      {task && (
        <Button variant="contained" color="primary" onClick={handleGenerate} disabled={loading || !inputText} className="button">
          {loading ? 'Generating...' : 'Generate'}
        </Button>
      )}

      {outputText && (
        <Box className="outputBox">
          <Typography variant="h6" gutterBottom className="outputTitle">
            Output:
          </Typography>
          <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }} className="outputText">
            {outputText}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default TextGenerator;
