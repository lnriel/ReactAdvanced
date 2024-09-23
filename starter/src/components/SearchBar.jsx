import { Input } from "@chakra-ui/react";

export const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <Input
      variant="outline"
      className="searchbar"
      placeholder="Find a fun event to attend"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      bg="white"
    />
  );
};
