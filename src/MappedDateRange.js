import React from "react";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Button } from "@material-ui/core";

const inputsDates = [
  {
    id: 3449,
    fieldName: "fromDate",
    description: null,
    type: "date",
    defaultValue: null,
    values: null,
    regEx: null,
    extraField1: null,
    extraField2: { disableFuture: true, maxDateRange: 3 },
    isEditable: true,
    isMandatory: false,
  },
  {
    id: 3450,
    fieldName: "toDate",
    description: null,
    type: "date",
    defaultValue: null,
    values: null,
    regEx: null,
    extraField1: null,
    extraField2: { disableFuture: true },
    isEditable: true,
    isMandatory: false,
  },
];

const todysDate = new Date();
const dateString = [
  todysDate.getFullYear(),
  ("0" + (todysDate.getMonth() + 1)).slice(-2),
  ("0" + todysDate.getDate()).slice(-2),
].join("-");

//make a reusable component like reports

function ReusableDateComponent({ dateInfo, values, setValues }) {
  const dateProps =
    dateInfo.fieldName === "toDate"
      ? { minDate: new Date(values.fromDate) }
      : {};

  const isFutureDisabled = dateInfo.extraField2.disableFuture;
  const maxDateRange = dateInfo?.extraField2?.maxDateRange || 0;
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justifyContent="space-around">
        <KeyboardDatePicker
          autoOk
          disableFuture={isFutureDisabled}
          variant="inline"
          format="dd/MM/yyyy"
          margin="normal"
          id="from-date-picker"
          label={dateInfo.fieldName === "fromDate" ? "From Date" : "To date"}
          name={dateInfo.fieldName === "fromDate" ? "From Date" : "To date"}
          KeyboardButtonProps={{ "aria-label": "change date" }}
          value={
            dateInfo.fieldName === "toDate" ? values.toDate : values.fromDate
          }
          onChange={(date) => {
            setValues((prev) => ({ ...prev, [dateInfo.fieldName]: date }));
          }}
          {...dateProps}
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

  return (
    <>
      <p>{dateString}</p>
      <h3>reusable</h3>
      <Button
        variant="outlined"
        onClick={() => {
          const newTemplate = inputsDates.map((dateInfo) => {
            dateInfo.extraField2.disableFuture =
              !dateInfo.extraField2.disableFuture;
            return dateInfo;
          });
          setDatesList(newTemplate);
        }}
      >
        Disable Future
      </Button>
      <Grid container justifyContent="space-around">
        {datesList.map((dateInfo) => (
          <ReusableDateComponent
            dateInfo={dateInfo}
            values={values}
            setValues={setValues}
          />
        ))}
      </Grid>
      <p>{JSON.stringify(values)}</p>
    </>
  );
}
