import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home, Transaction, NotFound } from "./pages";
import { ROUTER } from "./utils/configs/router.config";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTER.HOME} element={<Home />}/>
        <Route path={ROUTER.TRANSACTION_DATE} element={<Transaction type={'date'}/>}/>
        <Route path={ROUTER.TRANSACTION_MONTH} element={<Transaction type={'month'}/>}/>
        <Route path={ROUTER.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;