import { StrictMode } from "react";
import ReactDOM from "react-dom";

import ClassicDateRange from "./ClassicDateRange";
import MappedDateRange from "./MappedDateRange";
import TestDate from "./TestMappedDate";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <ClassicDateRange maxDateRange={3} />
    <hr />
    {/* <MappedDateRange maxDateRange={5} /> */}
    <TestDate />
  </StrictMode>,
  rootElement
);
