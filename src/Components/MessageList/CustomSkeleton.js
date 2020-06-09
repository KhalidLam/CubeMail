import React from "react";
import { Flex, Box, Skeleton } from "@chakra-ui/core";

const CustomSkeleton = () => (
  <Flex
    justify='space-around'
    py={2}
    borderTop='1px'
    borderBottom='1px'
    borderColor='gray.200'
  >
    <Box>
      <Skeleton width='48px' height='48px' borderRadius='50%' />
    </Box>
    <Box w='70%'>
      <Skeleton height='20px' mb='10px' />
      <Skeleton height='20px' mb='10px' />
      <Skeleton height='30px' mb='10px' />
    </Box>
  </Flex>
);

export default CustomSkeleton;
