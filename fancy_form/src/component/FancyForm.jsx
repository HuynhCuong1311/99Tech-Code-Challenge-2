import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import React, { useEffect, useState } from "react";
import { currencyService } from "../services/currency_service";

export const FancyForm = () => {
  const [currencyList, setCurrencyList] = useState([]);
  const [currencyFrom, setCurrencyFrom] = useState("");
  const [currencyTo, setCurrencyTo] = useState("");
  const [valueFrom, setValueFrom] = useState("");
  const [valueTo, setValueTo] = useState("");

  const getCurrencyList = async () => {
    try {
      const response = await currencyService.getCurrencyList();

      // Create a Map object to store unique currencies with the latest date
      const uniqueCurrenciesMap = new Map();

      response.forEach((item) => {
        const { currency, date, price } = item;

        // Check if the currency already exists in the Map
        if (!uniqueCurrenciesMap.has(currency)) {
          // If it doesn't exist, add it with the current item's date as the key and the item object as the value
          uniqueCurrenciesMap.set(currency, { date, price });
        } else {
          // If it exists, compare the dates to determine which one is more recent
          const existingDate = new Date(uniqueCurrenciesMap.get(currency).date);
          const currentDate = new Date(date);

          if (currentDate > existingDate) {
            // If the current date is newer, update the date and price for the currency in the Map
            uniqueCurrenciesMap.set(currency, { date, price });
          }
        }
      });
      setCurrencyList(
        Array.from(uniqueCurrenciesMap, ([currency, { date, price }]) => ({
          currency,
          date,
          price,
        }))
      );
    } catch (error) {
      console.log("error: ", error);
    }
  };

  useEffect(() => {
    getCurrencyList();
  }, []);

  useEffect(() => {
    const newValueTo = (valueFrom * currencyFrom) / currencyTo;
    setValueTo(newValueTo);
  }, [currencyTo, valueFrom, currencyFrom]);

  const handleChangeCurrency1 = (event) => {
    setCurrencyFrom(event.target.value);
  };

  const handleChangeCurrency2 = (event) => {
    setCurrencyTo(event.target.value);
  };

  const handleChangeValueFrom = (event) => {
    setValueFrom(event.target.value);
  };

  const handleSwap = (event) => {
    const copyValueFrom = valueFrom;
    setValueFrom(valueTo);
    setValueTo(copyValueFrom);

    const copyCurrencyFrom = currencyFrom;
    setCurrencyFrom(currencyTo);
    setCurrencyTo(copyCurrencyFrom);
  };
  return (
    <Stack
      width="100%"
      mt="50px"
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <form style={{ width: "700px" }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }} mb={2}>
          <Grid item xs={9}>
            <TextField
              size="small"
              fullWidth
              id="outlined-required"
              label="Amount to send"
              type="number"
              value={valueFrom}
              onChange={handleChangeValueFrom}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Currency</InputLabel>
              <Select
                label="Currency"
                // placeholder="Select currency"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={currencyFrom}
                onChange={handleChangeCurrency1}
                sx={{
                  "& .MuiListItemSecondaryAction-root": {
                    right: "30px",
                  },
                  fontFamily: "Montserrat,Nucleo,Helvetica,sans-serif",
                  backgroundColor: "signingWFBackground.main",
                }}
              >
                {currencyList.map((val, index) => (
                  <MenuItem key={index} value={val.price}>
                    {val.currency}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={9}>
            <TextField
              size="small"
              fullWidth
              id="outlined-required"
              label="Amount to receive"
              type="number"
              InputProps={{
                readOnly: true,
              }}
              value={valueTo}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Currency</InputLabel>
              <Select
                label="Currency"
                // placeholder="Select currency"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={currencyTo}
                onChange={handleChangeCurrency2}
                sx={{
                  "& .MuiListItemSecondaryAction-root": {
                    right: "30px",
                  },
                  fontFamily: "Montserrat,Nucleo,Helvetica,sans-serif",
                  backgroundColor: "signingWFBackground.main",
                }}
              >
                {currencyList.map((val, index) => (
                  <MenuItem key={index} value={val.price}>
                    {val.currency}
                    {/* <ListItemSecondaryAction>
                  <img src={val.logo} height="25" alt="logo" />
                </ListItemSecondaryAction> */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Button variant="contained" onClick={handleSwap}>
          CONFIRM SWAP
        </Button>
      </form>
    </Stack>
  );
};

FancyForm.propTypes = {};

export default FancyForm;
