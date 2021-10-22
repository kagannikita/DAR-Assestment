import React from 'react';

import {ConverterContext} from "./context/ConverterContext";
import Form from "./components/Form/Form";

const App=()=> {
  return (
    <ConverterContext>
      <Form/>
    </ConverterContext>
  );
}

export default App;
