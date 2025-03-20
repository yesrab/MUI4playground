import React from "react";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Button } from "@material-ui/core";

import * as _ from "lodash";

function isTruthyNumber(value) {
  return _.isNumber(value) && value !== 0;
}

const inputsDates = [
  {
    id: 3449,
    fieldName: "fromDate",
    extraField2: {
      disableFuture: false,
      maxDateRange: 5,
    },
  },
  {
    id: 3450,
    fieldName: "toDate",
    extraField2: { disableFuture: false },
  },
];

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

function formatDate(date) {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date input");
  }
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = parsedDate.getFullYear();
  const hours = String(parsedDate.getHours()).padStart(2, "0");
  const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year}, ${hours}:${minutes}`;
}

const todysDate = new Date();
const dateString = [
  todysDate.getFullYear(),
  ("0" + (todysDate.getMonth() + 1)).slice(-2),
  ("0" + todysDate.getDate()).slice(-2),
].join("-");

function ReusableDateComponent({ dateInfo, values, setValues, maxDateRange }) {
  const isFutureDisabled = dateInfo.extraField2?.disableFuture;
  const isFromDate = dateInfo.fieldName === "fromDate";
  const dateValue = isFromDate ? values.fromDate : values.toDate;

  const defaultMinDate = new Date(values.fromDate);

  const minDate =
    maxDateRange > 0
      ? isFromDate
        ? setStartOfDay(
            new Date(
              new Date(values.toDate).setDate(
                new Date(values.toDate).getDate() - (maxDateRange - 1)
              )
            )
          )
        : setStartOfDay(new Date(values.fromDate))
      : undefined;

  const maxDate =
    maxDateRange > 0
      ? isFromDate
        ? setEndOfDay(new Date(values.toDate))
        : setEndOfDay(
            new Date(
              new Date(values.fromDate).setDate(
                new Date(values.fromDate).getDate() + (maxDateRange - 1)
              )
            )
          )
      : undefined;

  const newMin =
    !isTruthyNumber(maxDateRange) && dateInfo.fieldName === "toDate"
      ? defaultMinDate
      : minDate;

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justifyContent="space-around">
        <KeyboardDatePicker
          autoOk
          disableFuture={isFutureDisabled}
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          id={`${dateInfo.fieldName}-picker`}
          label={isFromDate ? "From Date" : "To Date"}
          value={dateValue}
          onChange={(date) =>
            setValues((prev) => ({
              ...prev,
              [dateInfo.fieldName]: isFromDate
                ? setStartOfDay(date)
                : setEndOfDay(date),
            }))
          }
          minDate={newMin}
          maxDate={maxDate}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}

export default function MappedDateRange() {
  const [datesList, setDatesList] = React.useState(inputsDates);
  const [values, setValues] = React.useState({
    fromDate: dateString,
    toDate: dateString,
  });

  const maxDateRange = Math.max(
    ...datesList.map((date) => date.extraField2?.maxDateRange || 0)
  );

  return (
    <>
      <h3>Reusable Date Picker</h3>
      <Button
        variant="outlined"
        onClick={() => {
          setDatesList((prev) =>
            prev.map((date) => ({
              ...date,
              extraField2: {
                ...date.extraField2,
                disableFuture: !date.extraField2.disableFuture,
              },
            }))
          );
        }}
      >
        Toggle Future Dates
      </Button>
      <Grid container justifyContent="space-around">
        {datesList.map((dateInfo) => (
          <ReusableDateComponent
            key={dateInfo.id}
            dateInfo={dateInfo}
            values={values}
            setValues={setValues}
            maxDateRange={maxDateRange}
          />
        ))}
      </Grid>
      <p> From Date: {formatDate(values.fromDate)}</p>
      <p> To Date: {formatDate(values.toDate)}</p>
      <p>{JSON.stringify(values)}</p>
    </>
  );
}
