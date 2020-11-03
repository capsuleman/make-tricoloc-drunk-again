import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import client from 'src/services/networking/client';

import { Container, Title, InputContainer, AddBetButton, FormContainer } from './AddBet.style';

interface Option {
  id: string;
  name: string;
  numberOfBets: number;
}

interface IProps {
  onChange: () => void;
}

const AddBet: React.FC<IProps> = ({ onChange }) => {
  const [options, setOptions] = React.useState<Option[]>([]);
  const [optionId, setOptionId] = React.useState<string>('');
  const [numberOfShots, setNumberOfShots] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    client.getOptions().then((options) => setOptions(options));
  }, []);

  const handleBet = async () => {
    setIsLoading(true);
    await client.addBet(Number(numberOfShots), optionId);
    setIsLoading(false);
    setOptionId('');
    setNumberOfShots('');
    onChange();
  };

  const sumOfNumberOfBets = options
    .map(({ numberOfBets }) => numberOfBets)
    .reduce((prev, current) => prev + current, 0);

  return (
    <Container>
      <Title>Add a bet</Title>
      <FormContainer xs={12}>
        <InputContainer>
          <FormControl fullWidth>
            <InputLabel id="option">Option</InputLabel>
            <Select
              value={optionId}
              onChange={(e) => setOptionId(e.target.value as string)}
              labelId="option"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {options.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name} (
                  {Math.round(
                    (10 * (sumOfNumberOfBets + Number(numberOfShots))) /
                      (option.numberOfBets + Number(numberOfShots)),
                  ) / 10}
                  )
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </InputContainer>
        <InputContainer>
          <TextField
            id="value"
            label="Number of shot"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            value={numberOfShots}
            onChange={(e) => setNumberOfShots(e.target.value)}
          />
        </InputContainer>
        <AddBetButton
          variant="contained"
          color="secondary"
          endIcon={isLoading && <CircularProgress color="primary" size={20} />}
          onClick={handleBet}
          disabled={!(optionId && numberOfShots && Number(numberOfShots) > 0)}
        >
          Bet!
        </AddBetButton>
      </FormContainer>
    </Container>
  );
};

export default AddBet;
