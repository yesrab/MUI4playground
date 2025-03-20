import React from "react";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Button } from "@material-ui/core";

const setStartOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

const setEndOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

export default function DateRange({ maxDateRange = 0 }) {
  const [fromDate, setFromDate] = React.useState(setStartOfDay(new Date()));
  const [toDate, setToDate] = React.useState(setEndOfDay(new Date()));
  const [isFutureDisabled, setIsFutureDisabled] = React.useState(false);

  const handleFromDateChange = (date) => {
    const newFromDate = setStartOfDay(date);
    setFromDate(newFromDate);
    if (maxDateRange) {
      let newToDate = new Date(newFromDate);
      newToDate.setDate(newToDate.getDate() + (maxDateRange - 1));
      setToDate((prevToDate) =>
        prevToDate > newToDate ? newToDate : prevToDate
      );
    }
  };

  const handleToDateChange = (date) => {
    const newToDate = setEndOfDay(date);
    setToDate(newToDate);
    if (maxDateRange) {
      let newFromDate = new Date(newToDate);
      newFromDate.setDate(newFromDate.getDate() - (maxDateRange - 1));
      setFromDate((prevFromDate) =>
        prevFromDate < newFromDate ? newFromDate : prevFromDate
      );
    }
  };

  const minToDate = fromDate;
  const maxToDate = maxDateRange ? new Date(fromDate) : null;
  if (maxDateRange) maxToDate.setDate(fromDate.getDate() + (maxDateRange - 1));

  const minFromDate = maxDateRange ? new Date(toDate) : null;
  if (maxDateRange) minFromDate.setDate(toDate.getDate() - (maxDateRange - 1));

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  }

  return (
    <>
      <Button
        variant={isFutureDisabled ? "contained" : "outlined"}
        onClick={() => {
          setIsFutureDisabled((prev) => !prev);
        }}
      >
        Disable Future
      </Button>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justifyContent="space-around">
          <KeyboardDatePicker
            autoOk
            disableFuture={isFutureDisabled}
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="from-date-picker"
            label="From"
            value={fromDate}
            onChange={handleFromDateChange}
            KeyboardButtonProps={{ "aria-label": "change date" }}
            maxDate={toDate}
            minDate={minFromDate}
          />
          <KeyboardDatePicker
            autoOk
            disableFuture={isFutureDisabled}
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="to-date-picker"
            label="To"
            value={toDate}
            onChange={handleToDateChange}
            KeyboardButtonProps={{ "aria-label": "change date" }}
            minDate={minToDate}
            maxDate={maxToDate}
          />
        </Grid>
      </MuiPickersUtilsProvider>
      <div>
        <p> maxDateRange: {maxDateRange} </p>
        <p>seleted From Date : {formatDate(fromDate)} </p>
        <p>seleted To Date : {formatDate(toDate)} </p>
      </div>
    </>
  );
}
