import React from 'react';
import Bill from "./components/Bill/Bill";
import Form from "./components/Form/Form";
import {OrderContext} from "./context/OrderContext";

const App=()=> {
  return (
      <OrderContext>
         <Form/>
          <Bill/>
      </OrderContext>
  );
}

export default App;
