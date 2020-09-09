import React, { useState, useContext } from "react";
import { Box, Input, InputGroup, IconButton } from "@chakra-ui/core";
import EmailContext from "../../context/email/emailContext";

const SearchBar = () => {
  const { getMessagesQuery, loading } = useContext(EmailContext);
  const [query, setQuery] = useState("");

  const handleOnChange = (e) => setQuery(e.target.value);

  const handleQuery = (e) => {
    if (!query) return;
    if (e.keyCode === 13 || e.type === "click") getMessagesQuery(query);
  };

  return (
    <Box py='5px' bg='white' border='1px' borderColor='gray.200'>
      <InputGroup size='lg'>
        <IconButton
          icon='search'
          variant='ghost'
          variantColor='blue'
          marginLeft='5px'
          aria-label='Search messages'
          onClick={handleQuery}
          isLoading={loading}
        />
        <Input
          type='text'
          placeholder='Search mail'
          borderWidth='0px'
          borderRadius='0px'
          focusBorderColor='white'
          value={query}
          onChange={handleOnChange}
          onKeyDown={handleQuery}
        />
      </InputGroup>
    </Box>
  );
};

export default SearchBar;
