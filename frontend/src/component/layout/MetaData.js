import React from "react";
import Helmet from "react-helmet";   // for redux implement, chrome er upore oi page er title show korbe

const MetaData = ({ title }) => {    // je page ei component import korbo, oi page er title oi comkponent hoye jabe je "title" ekhane pass korchi
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

export default MetaData;