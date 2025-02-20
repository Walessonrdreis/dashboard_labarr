import { Button, Flex, Text } from '@chakra-ui/react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { LABELS } from '../../../pages/Users/constants/userConstants';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <Flex align="center" justify="center" mt={6} gap={4}>
      <Button
        leftIcon={<FiChevronLeft />}
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        size="sm"
      >
        {LABELS.PREVIOUS}
      </Button>

      <Text>
        {LABELS.PAGE} {currentPage} de {totalPages}
      </Text>

      <Button
        rightIcon={<FiChevronRight />}
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        size="sm"
      >
        {LABELS.NEXT}
      </Button>
    </Flex>
  );
};

export default Pagination; 