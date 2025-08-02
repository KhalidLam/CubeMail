import React, { useState, useContext } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Search } from "lucide-react";
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
    <div className="py-2 px-3 bg-white border border-gray-200">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 text-blue-600"
          onClick={handleQuery}
          disabled={loading || !query}
          aria-label="Search messages"
        >
          {loading ? <Spinner size={4} /> : <Search className="h-4 w-4" />}
        </Button>
        <Input
          type="text"
          placeholder="Search mail"
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
          value={query}
          onChange={handleOnChange}
          onKeyDown={handleQuery}
        />
      </div>
    </div>
  );
};

export default SearchBar;
