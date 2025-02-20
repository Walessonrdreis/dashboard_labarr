import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Flex,
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { UserSearchProps } from '../../types/User';
import { LABELS, USER_STATUS } from '../../constants/userConstants';

const UserSearch = ({
  onSearch,
  onStatusChange,
  isLoading = false,
}: UserSearchProps) => {
  return (
    <Flex gap={4}>
      <Box flex={1}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder={LABELS.SEARCH_PLACEHOLDER}
            onChange={(e) => onSearch(e.target.value)}
            disabled={isLoading}
          />
        </InputGroup>
      </Box>

      <Select
        maxW="200px"
        onChange={(e) => onStatusChange(e.target.value)}
        disabled={isLoading}
      >
        <option value="">{LABELS.ALL}</option>
        {Object.entries(USER_STATUS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </Flex>
  );
};

export default UserSearch; 